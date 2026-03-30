namespace PostIt.Domain.Entities;

public class UserBadge
{
    public int Id { get; set; }
    public DateTime AwardedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public int BadgeId { get; set; }
    public Badge Badge { get; set; } = null!;
}
