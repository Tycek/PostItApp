using Microsoft.EntityFrameworkCore;
using PostIt.Application.DTOs;
using PostIt.Application.Interfaces;
using PostIt.Domain.Entities;
using PostIt.Infrastructure.Data;

namespace PostIt.Infrastructure.Services;

public class CommentService : ICommentService
{
    private readonly ApplicationDbContext _db;

    public CommentService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<CommentDto>> GetByPostIdAsync(int postId)
    {
        return await _db.Comments
            .Include(c => c.Author)
            .Where(c => c.PostId == postId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new CommentDto(c.Id, c.Content, c.CreatedAt, c.AuthorId, c.Author.DisplayName, c.Author.AvatarUrl))
            .ToListAsync();
    }

    public async Task<CommentDto> CreateAsync(int postId, CreateCommentRequest request, string authorId)
    {
        var comment = new Comment
        {
            Content = request.Content,
            PostId = postId,
            AuthorId = authorId
        };

        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();

        var author = await _db.Users.FindAsync(authorId);
        return new CommentDto(comment.Id, comment.Content, comment.CreatedAt, authorId, author!.DisplayName, author.AvatarUrl);
    }

    public async Task<bool> DeleteAsync(int id, string requestingUserId)
    {
        var comment = await _db.Comments.FindAsync(id);
        if (comment is null || comment.AuthorId != requestingUserId) return false;

        _db.Comments.Remove(comment);
        await _db.SaveChangesAsync();
        return true;
    }
}
