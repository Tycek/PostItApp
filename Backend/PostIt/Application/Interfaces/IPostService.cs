using PostIt.Application.DTOs;

namespace PostIt.Application.Interfaces;

public interface IPostService
{
    Task<IEnumerable<PostDto>> GetFeedAsync(int page, int pageSize, string? currentUserId);
    Task<PostDto?> GetByIdAsync(int id, string? currentUserId);
    Task<PostDto> CreateAsync(CreatePostRequest request, string authorId);
    Task<PostDto?> UpdateAsync(int id, UpdatePostRequest request, string requestingUserId);
    Task<bool> DeleteAsync(int id, string requestingUserId);
    Task<bool> ToggleLikeAsync(int postId, string userId);
}
