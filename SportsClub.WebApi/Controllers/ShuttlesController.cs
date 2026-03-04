using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsClub.Application.DTOs.Transport;
using SportsClub.Application.Interfaces;

namespace SportsClub.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ShuttlesController : ControllerBase
{
    private readonly IShuttleService _shuttleService;

    public ShuttlesController(IShuttleService shuttleService)
    {
        _shuttleService = shuttleService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _shuttleService.GetAllShuttlesAsync());
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")]
    public async Task<IActionResult> Create([FromBody] ShuttleDto model)
    {
        var result = await _shuttleService.CreateShuttleAsync(model.LicensePlate, model.DriverName, model.DriverPhone, model.RouteName, model.Capacity);
        return Ok(result);
    }

    [HttpPost("{shuttleId:guid}/enroll")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")]
    public async Task<IActionResult> EnrollStudent(Guid shuttleId, [FromBody] EnrollStudentDto model)
    {
        var result = await _shuttleService.EnrollStudentAsync(shuttleId, model);
        if (!result) return BadRequest("Kapasite dolu, servis bulunamadı veya öğrenci zaten kayıtlı.");

        return Ok("Öğrenci servise kaydedildi.");
    }

    [HttpDelete("{shuttleId:guid}/remove/{athleteId:guid}")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")]
    public async Task<IActionResult> RemoveStudent(Guid shuttleId, Guid athleteId)
    {
        var result = await _shuttleService.RemoveStudentAsync(shuttleId, athleteId);
        if (!result) return NotFound("Kayıt bulunamadı.");

        return Ok("Öğrenci servisten çıkarıldı.");
    }
}
