using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportsClub.Application.DTOs.User;
using SportsClub.Domain.Entities;

namespace SportsClub.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;

    public UsersController(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet("coaches")]
    public async Task<IActionResult> GetCoaches()
    {
        var coaches = await _userManager.GetUsersInRoleAsync("Antrenör");
        
        var coachDtos = coaches.Select(c => new UserDto
        {
            Id = c.Id,
            FirstName = c.FirstName,
            LastName = c.LastName,
            Email = c.Email!,
            Role = "Antrenör"
        }).ToList();

        return Ok(coachDtos);
    }
    
    [HttpGet]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email!,
                Role = roles.FirstOrDefault() ?? "Atanmamış"
            });
        }

        return Ok(userDtos);
    }
}
