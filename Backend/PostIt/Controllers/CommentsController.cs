using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostIt.Application.DTOs;
using PostIt.Application.Interfaces;

namespace PostIt.Controllers;

[ApiController]
[Route("api/posts/{postId:int}/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetByPost(int postId)
    {
        return Ok(await _commentService.GetByPostIdAsync(postId));
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CommentDto>> Create(int postId, [FromBody] CreateCommentRequest request)
    {
        var authorId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var comment = await _commentService.CreateAsync(postId, request, authorId);
        return CreatedAtAction(nameof(GetByPost), new { postId }, comment);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int postId, int id)
    {
        var requestingUserId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var deleted = await _commentService.DeleteAsync(id, requestingUserId);
        return deleted ? NoContent() : Forbid();
    }
}
