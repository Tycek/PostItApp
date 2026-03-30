using PostIt.Application.DTOs;

namespace PostIt.Application.Interfaces;

public interface ICommentService
{
    Task<IEnumerable<CommentDto>> GetByPostIdAsync(int postId);
    Task<CommentDto> CreateAsync(int postId, CreateCommentRequest request, string authorId);
    Task<bool> DeleteAsync(int id, string requestingUserId);
}
