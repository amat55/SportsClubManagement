# Use .NET 9 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files first
COPY ["SportsClub.sln", "./"]
COPY ["SportsClub.Domain/SportsClub.Domain.csproj", "SportsClub.Domain/"]
COPY ["SportsClub.Application/SportsClub.Application.csproj", "SportsClub.Application/"]
COPY ["SportsClub.Infrastructure/SportsClub.Infrastructure.csproj", "SportsClub.Infrastructure/"]
COPY ["SportsClub.WebApi/SportsClub.WebApi.csproj", "SportsClub.WebApi/"]
RUN dotnet restore "SportsClub.sln"

# Copy the rest of the source code
COPY . .

# Build and Publish WebApi
WORKDIR "/src/SportsClub.WebApi"
RUN dotnet publish "SportsClub.WebApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port and configure ASP.NET Core
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "SportsClub.WebApi.dll"]
