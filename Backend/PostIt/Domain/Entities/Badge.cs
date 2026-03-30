namespace PostIt.Domain.Entities;

public class Badge
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconUrl { get; set; } = string.Empty;
    public int LikesThreshold { get; set; } // Award when total likes >= this value

    public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
}
