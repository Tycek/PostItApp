using Microsoft.EntityFrameworkCore;
using PostIt.Application.DTOs;
using PostIt.Application.Interfaces;
using PostIt.Infrastructure.Data;

namespace PostIt.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _db;

    public CategoryService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        return await _db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto(c.Id, c.Name, c.Slug))
            .ToListAsync();
    }
}
