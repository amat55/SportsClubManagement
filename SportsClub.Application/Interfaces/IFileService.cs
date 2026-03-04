using Microsoft.AspNetCore.Http;

namespace SportsClub.Application.Interfaces;

public interface IFileService
{
    Task<string> UploadFileAsync(IFormFile file, string folderName);
    Task<bool> DeleteFileAsync(string fileUrl);
}
