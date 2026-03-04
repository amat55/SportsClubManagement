using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsClub.Application.DTOs.Training;
using SportsClub.Application.Interfaces;

namespace SportsClub.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TrainingSessionsController : ControllerBase
{
    private readonly ITrainingSessionService _trainingSessionService;

    public TrainingSessionsController(ITrainingSessionService trainingSessionService)
    {
        _trainingSessionService = trainingSessionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _trainingSessionService.GetAllSessionsAsync());
    }

    [HttpGet("team/{teamId:guid}")]
    public async Task<IActionResult> GetByTeam(Guid teamId)
    {
        return Ok(await _trainingSessionService.GetSessionsByTeamAsync(teamId));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Kurum Yöneticisi,Antrenör")] // Antrenörler de kendi programını oluşturabilir
    public async Task<IActionResult> Create([FromBody] TrainingSessionDto model)
    {
        // Not: Gerçek senaryoda Antrenörün sadece kendi takımına program eklemesine izin vermek gerekir.
        var result = await _trainingSessionService.CreateSessionAsync(model.Title, model.Description, model.TeamId, model.CoachId, model.StartTime, model.EndTime, model.Location);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")] 
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _trainingSessionService.DeleteSessionAsync(id);
        if (!result) return NotFound("Antrenman programı bulunamadı.");

        return NoContent();
    }
}
