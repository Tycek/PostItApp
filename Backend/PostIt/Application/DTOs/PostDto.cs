namespace PostIt.Application.DTOs;

public record PostDto(
    int Id,
    string Title,
    string Content,
    string? ImageUrl,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string AuthorId,
    string AuthorDisplayName,
    string? AuthorAvatarUrl,
    int LikeCount,
    int CommentCount,
    bool IsLikedByCurrentUser,
    IEnumerable<string> Categories
);

public record CreatePostRequest(
    string Title,
    string Content,
    string? ImageUrl,
    IEnumerable<int> CategoryIds
);

public record UpdatePostRequest(
    string Title,
    string Content,
    string? ImageUrl,
    IEnumerable<int> CategoryIds
);
