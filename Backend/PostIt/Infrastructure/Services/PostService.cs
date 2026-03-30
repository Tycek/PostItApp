using Microsoft.EntityFrameworkCore;
using PostIt.Application.DTOs;
using PostIt.Application.Interfaces;
using PostIt.Domain.Entities;
using PostIt.Infrastructure.Data;

namespace PostIt.Infrastructure.Services;

public class PostService : IPostService
{
    private readonly ApplicationDbContext _db;

    public PostService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<PostDto>> GetFeedAsync(int page, int pageSize, string? currentUserId)
    {
        var posts = await _db.Posts
            .Include(p => p.Author)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Include(p => p.PostCategories).ThenInclude(pc => pc.Category)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return posts.Select(p => MapToDto(p, currentUserId));
    }

    public async Task<PostDto?> GetByIdAsync(int id, string? currentUserId)
    {
        var post = await _db.Posts
            .Include(p => p.Author)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Include(p => p.PostCategories).ThenInclude(pc => pc.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        return post is null ? null : MapToDto(post, currentUserId);
    }

    public async Task<PostDto> CreateAsync(CreatePostRequest request, string authorId)
    {
        var post = new Post
        {
            Title = request.Title,
            Content = request.Content,
            ImageUrl = request.ImageUrl,
            AuthorId = authorId
        };

        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        foreach (var categoryId in request.CategoryIds)
        {
            _db.PostCategories.Add(new PostCategory { PostId = post.Id, CategoryId = categoryId });
        }
        await _db.SaveChangesAsync();

        return (await GetByIdAsync(post.Id, authorId))!;
    }

    public async Task<PostDto?> UpdateAsync(int id, UpdatePostRequest request, string requestingUserId)
    {
        var post = await _db.Posts.Include(p => p.PostCategories).FirstOrDefaultAsync(p => p.Id == id);
        if (post is null || post.AuthorId != requestingUserId) return null;

        post.Title = request.Title;
        post.Content = request.Content;
        post.ImageUrl = request.ImageUrl;
        post.UpdatedAt = DateTime.UtcNow;

        _db.PostCategories.RemoveRange(post.PostCategories);
        foreach (var categoryId in request.CategoryIds)
        {
            _db.PostCategories.Add(new PostCategory { PostId = post.Id, CategoryId = categoryId });
        }

        await _db.SaveChangesAsync();
        return await GetByIdAsync(id, requestingUserId);
    }

    public async Task<bool> DeleteAsync(int id, string requestingUserId)
    {
        var post = await _db.Posts.FindAsync(id);
        if (post is null || post.AuthorId != requestingUserId) return false;

        _db.Posts.Remove(post);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleLikeAsync(int postId, string userId)
    {
        var existing = await _db.Likes.FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);
        if (existing is not null)
        {
            _db.Likes.Remove(existing);
            await _db.SaveChangesAsync();
            return false; // unliked
        }

        _db.Likes.Add(new Like { PostId = postId, UserId = userId });
        await _db.SaveChangesAsync();

        await CheckAndAwardBadgesAsync(postId);
        return true; // liked
    }

    private async Task CheckAndAwardBadgesAsync(int postId)
    {
        var post = await _db.Posts.FindAsync(postId);
        if (post is null) return;

        var totalLikes = await _db.Likes
            .Where(l => _db.Posts.Where(p => p.AuthorId == post.AuthorId).Select(p => p.Id).Contains(l.PostId))
            .CountAsync();

        var badges = await _db.Badges.Where(b => b.LikesThreshold <= totalLikes).ToListAsync();
        var awardedBadgeIds = await _db.UserBadges.Where(ub => ub.UserId == post.AuthorId).Select(ub => ub.BadgeId).ToListAsync();

        foreach (var badge in badges.Where(b => !awardedBadgeIds.Contains(b.Id)))
        {
            _db.UserBadges.Add(new UserBadge { UserId = post.AuthorId, BadgeId = badge.Id });
        }

        await _db.SaveChangesAsync();
    }

    private static PostDto MapToDto(Post post, string? currentUserId) => new(
        post.Id,
        post.Title,
        post.Content,
        post.ImageUrl,
        post.CreatedAt,
        post.UpdatedAt,
        post.AuthorId,
        post.Author.DisplayName,
        post.Author.AvatarUrl,
        post.Likes.Count,
        post.Comments.Count,
        currentUserId is not null && post.Likes.Any(l => l.UserId == currentUserId),
        post.PostCategories.Select(pc => pc.Category.Name)
    );
}
