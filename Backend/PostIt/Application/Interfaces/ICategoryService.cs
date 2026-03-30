using PostIt.Application.DTOs;

namespace PostIt.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();
}
