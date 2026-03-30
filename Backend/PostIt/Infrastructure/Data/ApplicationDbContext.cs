using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PostIt.Domain.Entities;

namespace PostIt.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Like> Likes => Set<Like>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<PostCategory> PostCategories => Set<PostCategory>();
    public DbSet<Badge> Badges => Set<Badge>();
    public DbSet<UserBadge> UserBadges => Set<UserBadge>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<PostCategory>()
            .HasKey(pc => new { pc.PostId, pc.CategoryId });

        builder.Entity<PostCategory>()
            .HasOne(pc => pc.Post)
            .WithMany(p => p.PostCategories)
            .HasForeignKey(pc => pc.PostId);

        builder.Entity<PostCategory>()
            .HasOne(pc => pc.Category)
            .WithMany(c => c.PostCategories)
            .HasForeignKey(pc => pc.CategoryId);

        builder.Entity<Like>()
            .HasIndex(l => new { l.PostId, l.UserId })
            .IsUnique();

        builder.Entity<Category>()
            .HasIndex(c => c.Slug)
            .IsUnique();

        builder.Entity<Category>()
            .HasIndex(c => c.Name)
            .IsUnique();

        // Seed categories
        builder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Art", Slug = "art" },
            new Category { Id = 2, Name = "Technology", Slug = "technology" },
            new Category { Id = 3, Name = "Science", Slug = "science" },
            new Category { Id = 4, Name = "Gaming", Slug = "gaming" },
            new Category { Id = 5, Name = "Music", Slug = "music" },
            new Category { Id = 6, Name = "Sports", Slug = "sports" },
            new Category { Id = 7, Name = "Travel", Slug = "travel" },
            new Category { Id = 8, Name = "Food", Slug = "food" }
        );

        // Seed badges
        builder.Entity<Badge>().HasData(
            new Badge { Id = 1, Name = "Rising Star", Description = "Received 10 likes", IconUrl = "/badges/rising-star.svg", LikesThreshold = 10 },
            new Badge { Id = 2, Name = "Popular", Description = "Received 50 likes", IconUrl = "/badges/popular.svg", LikesThreshold = 50 },
            new Badge { Id = 3, Name = "Influencer", Description = "Received 100 likes", IconUrl = "/badges/influencer.svg", LikesThreshold = 100 },
            new Badge { Id = 4, Name = "Legend", Description = "Received 500 likes", IconUrl = "/badges/legend.svg", LikesThreshold = 500 }
        );
    }
}
