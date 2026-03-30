using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PostIt.Application.DTOs;
using PostIt.Domain.Entities;

namespace PostIt.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _config;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration config)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(GenerateToken(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null) return Unauthorized();

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded) return Unauthorized();

        return Ok(GenerateToken(user));
    }

    // OAuth2 - initiate external login
    [HttpGet("external/{provider}")]
    public IActionResult ExternalLogin(string provider, [FromQuery] string returnUrl = "/")
    {
        var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Auth", new { returnUrl });
        var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
        return Challenge(properties, provider);
    }

    // OAuth2 - callback after external provider authentication
    [HttpGet("external-callback")]
    public async Task<IActionResult> ExternalLoginCallback([FromQuery] string returnUrl = "/")
    {
        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info is null) return BadRequest("External login info not found.");

        var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);

        ApplicationUser user;

        if (result.Succeeded)
        {
            user = (await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey))!;
        }
        else
        {
            var email = info.Principal.FindFirstValue(ClaimTypes.Email)!;
            var displayName = info.Principal.FindFirstValue(ClaimTypes.Name) ?? email;

            user = new ApplicationUser { UserName = email, Email = email, DisplayName = displayName };
            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded) return BadRequest(createResult.Errors);

            await _userManager.AddLoginAsync(user, info);
        }

        var token = GenerateToken(user);
        var frontendUrl = _config["Frontend:Url"] ?? "http://localhost:3000";
        return Redirect($"{frontendUrl}/auth/callback?token={token.Token}");
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult> Me()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();
        return Ok(new { user.Id, user.Email, user.DisplayName, user.Bio, user.AvatarUrl });
    }

    private AuthResponse GenerateToken(ApplicationUser user)
    {
        var secret = _config["Jwt:Secret"]!;
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiry = DateTime.UtcNow.AddDays(7);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiry,
            signingCredentials: creds
        );

        return new AuthResponse(
            new JwtSecurityTokenHandler().WriteToken(token),
            user.Id,
            user.Email!,
            user.DisplayName,
            expiry
        );
    }
}
