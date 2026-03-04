using Microsoft.AspNetCore.Http;

namespace SportsClub.Application.DTOs.Document;

public class DocumentUploadDto
{
    public Guid AthleteId { get; set; }
    public IFormFile File { get; set; } = null!;
    public string DocumentType { get; set; } = string.Empty; // "Kimlik", "SaglikRaporu", "Foto" vb.
}
