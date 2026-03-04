using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsClub.Application.DTOs.Accounting;
using SportsClub.Application.Interfaces;

namespace SportsClub.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin,Kurum Yöneticisi")] // Sadece yöneticiler/muhasebeciler görebilir ve silebilir (Şimdilik)
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _paymentService.GetAllPaymentsAsync());
    }

    [HttpGet("unpaid")]
    public async Task<IActionResult> GetUnpaid()
    {
        return Ok(await _paymentService.GetUnpaidPaymentsAsync());
    }

    [HttpGet("athlete/{athleteId:guid}")]
    [Authorize(Roles = "Admin,Kurum Yöneticisi,Veli")] // Veliler kendi çocuğunun aidatını görebilmeli
    public async Task<IActionResult> GetByAthlete(Guid athleteId)
    {
        return Ok(await _paymentService.GetPaymentsByAthleteAsync(athleteId));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePaymentDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _paymentService.CreatePaymentAsync(model);
        return Ok(result);
    }

    [HttpPatch("{id:guid}/mark-paid")]
    public async Task<IActionResult> MarkAsPaid(Guid id)
    {
        var result = await _paymentService.MarkAsPaidAsync(id);
        if (!result) return NotFound("Ödeme kaydı bulunamadı.");

        return Ok("Ödeme tahsil edildi olarak işaretlendi.");
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _paymentService.DeletePaymentAsync(id);
        if (!result) return NotFound("Ödeme kaydı bulunamadı.");

        return NoContent();
    }
}
