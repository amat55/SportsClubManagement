using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsClub.Application.DTOs.Operations;
using SportsClub.Application.Interfaces;

namespace SportsClub.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AttendancesController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendancesController(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [HttpGet("session/{sessionId:guid}")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi,Antrenör")]
    public async Task<IActionResult> GetBySession(Guid sessionId)
    {
        return Ok(await _attendanceService.GetAttendanceBySessionAsync(sessionId));
    }

    [HttpGet("athlete/{athleteId:guid}")]
    // Veli ve Sporcu sadece kendi verilerini görebilmeli, bu kontroller ileride genişletilmeli
    public async Task<IActionResult> GetByAthlete(Guid athleteId)
    {
        return Ok(await _attendanceService.GetAttendanceByAthleteAsync(athleteId));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Kurum Yöneticisi,Antrenör")] // Antrenör takımı için yoklama girebilir
    public async Task<IActionResult> TakeOrUpdate([FromBody] TakeAttendanceDto model)
    {
        var result = await _attendanceService.TakeOrUpdateAttendanceAsync(model);
        if (!result) return BadRequest("Yoklama kaydedilirken hata oluştu.");

        return Ok("Yoklama başarıyla kaydedildi/güncellendi.");
    }
}
