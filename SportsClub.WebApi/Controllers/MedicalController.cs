using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsClub.Application.DTOs.Medical;
using SportsClub.Application.Interfaces;

namespace SportsClub.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class MedicalController : ControllerBase
{
    private readonly IMedicalService _medicalService;

    public MedicalController(IMedicalService medicalService)
    {
        _medicalService = medicalService;
    }

    [HttpGet("athlete/{athleteId:guid}/measurements")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi,Antrenör,Veli")] // Veli gelişim tablolarını görebilmeli
    public async Task<IActionResult> GetMeasurements(Guid athleteId)
    {
        return Ok(await _medicalService.GetMeasurementsByAthleteAsync(athleteId));
    }

    [HttpPost("measurements")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi,Antrenör")] // Antrenörler ölçümleri girebilir
    public async Task<IActionResult> AddMeasurement([FromBody] CreatePhysicalMeasurementDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _medicalService.AddMeasurementAsync(model);
        return Ok(result);
    }

    [HttpDelete("measurements/{id:guid}")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi")]
    public async Task<IActionResult> DeleteMeasurement(Guid id)
    {
        var result = await _medicalService.DeleteMeasurementAsync(id);
        if (!result) return NotFound("Ölçüm kaydı bulunamadı.");

        return NoContent();
    }
}
