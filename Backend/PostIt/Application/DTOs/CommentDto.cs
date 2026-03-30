namespace PostIt.Application.DTOs;

public record CommentDto(
    int Id,
    string Content,
    DateTime CreatedAt,
    string AuthorId,
    string AuthorDisplayName,
    string? AuthorAvatarUrl
);

public record CreateCommentRequest(string Content);
