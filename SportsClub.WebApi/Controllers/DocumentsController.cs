using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportsClub.Application.DTOs.Document;
using SportsClub.Application.Interfaces;

namespace SportsClub.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin,Kurum Yöneticisi")] // Sadece Yöneticiler belge yükleyebilir
public class DocumentsController : ControllerBase
{
    private readonly IFileService _fileService;
    private readonly IAthleteService _athleteService;

    public DocumentsController(IFileService fileService, IAthleteService athleteService)
    {
        _fileService = fileService;
        _athleteService = athleteService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadDocument([FromForm] DocumentUploadDto model)
    {
        if (model.File == null || model.File.Length == 0)
            return BadRequest("Lütfen geçerli bir dosya seçin.");

        // Sporcuyu kontrol et
        var athlete = await _athleteService.GetAthleteByIdAsync(model.AthleteId);
        if (athlete == null) return NotFound("Sporcu bulunamadı.");

        // Dosya tipine göre alt klasör oluşturma ("documents/kimlikler", "documents/raporlar" vb.)
        string folderName = model.DocumentType.ToLower() switch
        {
            "kimlik" => "documents/identity",
            "saglik" => "documents/medical",
            "foto" => "documents/photos",
            _ => "documents/others"
        };

        try
        {
            var fileUrl = await _fileService.UploadFileAsync(model.File, folderName);
            
            // TODO: Mevcutta Athlete entity'si üzerinde sadece PhotoUrl ve IdentityDocumentUrl var.
            // Bu url'leri veritabanına kaydetmek için AthleteService'de Update metodu çağrılmalıdır.
            
            return Ok(new { Message = "Dosya başarıyla yüklendi", Url = fileUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Dosya yüklenirken hata oluştu: {ex.Message}");
        }
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteDocument([FromQuery] string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl)) return BadRequest("Dosya yolu gereklidir.");

        var result = await _fileService.DeleteFileAsync(fileUrl);
        if (result)
            return Ok("Dosya başarıyla silindi.");

        return NotFound("Dosya bulunamadı.");
    }
}
