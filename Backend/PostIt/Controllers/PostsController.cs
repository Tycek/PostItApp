using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostIt.Application.DTOs;
using PostIt.Application.Interfaces;

namespace PostIt.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PostDto>>> GetFeed([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Ok(await _postService.GetFeedAsync(page, pageSize, currentUserId));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PostDto>> GetById(int id)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var post = await _postService.GetByIdAsync(id, currentUserId);
        return post is null ? NotFound() : Ok(post);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<PostDto>> Create([FromBody] CreatePostRequest request)
    {
        var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var post = await _postService.CreateAsync(request, authorId);
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<PostDto>> Update(int id, [FromBody] UpdatePostRequest request)
    {
        var requestingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var post = await _postService.UpdateAsync(id, request, requestingUserId);
        return post is null ? Forbid() : Ok(post);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var requestingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var deleted = await _postService.DeleteAsync(id, requestingUserId);
        return deleted ? NoContent() : Forbid();
    }

    [HttpPost("{id:int}/like")]
    [Authorize]
    public async Task<ActionResult<bool>> ToggleLike(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var liked = await _postService.ToggleLikeAsync(id, userId);
        return Ok(new { liked });
    }
}
