using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsClub.Application.DTOs.Training;
using SportsClub.Application.Interfaces;

namespace SportsClub.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TeamsController : ControllerBase
{
    private readonly ITeamService _teamService;

    public TeamsController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    [HttpGet("branches")]
    public async Task<IActionResult> GetBranches()
    {
        return Ok(await _teamService.GetAllBranchesAsync());
    }

    [HttpPost("branches")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")]
    public async Task<IActionResult> CreateBranch([FromBody] BranchDto model)
    {
        var result = await _teamService.CreateBranchAsync(model.Name, model.Description);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetTeams()
    {
        return Ok(await _teamService.GetAllTeamsAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTeamById(Guid id)
    {
        var result = await _teamService.GetTeamByIdAsync(id);
        if (result == null) return NotFound("Takım bulunamadı.");
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")]
    public async Task<IActionResult> CreateTeam([FromBody] TeamDto model)
    {
        var result = await _teamService.CreateTeamAsync(model.Name, model.BranchId, model.CoachId);
        return Ok(result);
    }

    [HttpPost("{teamId:guid}/assign-coach/{coachId:guid}")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")]
    public async Task<IActionResult> AssignCoach(Guid teamId, Guid coachId)
    {
        var result = await _teamService.AssignCoachToTeamAsync(teamId, coachId);
        if (!result) return NotFound("Takım veya antrenör bulunamadı.");
        return Ok("Antrenör başarıyla takıma atandı.");
    }

    [HttpPost("{teamId:guid}/add-athlete/{athleteId:guid}")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi,Antrenör")] // Antrenörler de gruba sporcu ekleyebilir
    public async Task<IActionResult> AddAthleteToTeam(Guid teamId, Guid athleteId)
    {
        var result = await _teamService.AddAthleteToTeamAsync(teamId, athleteId);
        if (!result) return NotFound("Takım veya sporcu bulunamadı.");
        return Ok("Sporcu takıma başarıyla eklendi.");
    }

    [HttpDelete("{teamId:guid}/remove-athlete/{athleteId:guid}")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi,Antrenör")]
    public async Task<IActionResult> RemoveAthleteFromTeam(Guid teamId, Guid athleteId)
    {
        var result = await _teamService.RemoveAthleteFromTeamAsync(teamId, athleteId);
        if (!result) return NotFound("İşlem başarısız veya sporcu bu takımda değil.");
        return Ok("Sporcu takımdan çıkarıldı.");
    }
}
