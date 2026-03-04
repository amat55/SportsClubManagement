using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsClub.Application.DTOs.Athlete;
using SportsClub.Application.Interfaces;

namespace SportsClub.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Sadece giriş yapmış yetkili kullanıcılar erişebilir
public class AthletesController : ControllerBase
{
    private readonly IAthleteService _athleteService;

    public AthletesController(IAthleteService athleteService)
    {
        _athleteService = athleteService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Kurum Yöneticisi,Antrenör")] // Antrenör ve Üstü görebilir
    public async Task<IActionResult> GetAll()
    {
        var athletes = await _athleteService.GetAllAthletesAsync();
        return Ok(athletes);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var athlete = await _athleteService.GetAthleteByIdAsync(id);
        if (athlete == null) return NotFound("Sporcu bulunamadı.");

        return Ok(athlete);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")] // Sadece Yöneticiler Sporcu Ekleyebilir
    public async Task<IActionResult> Create([FromBody] CreateAthleteDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _athleteService.CreateAthleteAsync(model);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPatch("{id:guid}/toggle-status")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")] 
    public async Task<IActionResult> ToggleStatus(Guid id)
    {
        var result = await _athleteService.ToggleAthleteStatusAsync(id);
        if (!result) return NotFound("Sporcu bulunamadı.");

        return Ok("Sporcu durumu başarıyla güncellendi (Aktif/Pasif).");
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")] // Sadece Admin silebilir
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _athleteService.DeleteAthleteAsync(id);
        if (!result) return NotFound("Sporcu bulunamadı.");

        return NoContent();
    }
}
