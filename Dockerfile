# Use the official .NET 8 SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the solution and project files first to cache layers
COPY ["app.sln", "./"]
COPY ["App.Server/App.Server.csproj", "App.Server/"]
COPY ["App.Application/App.Application.csproj", "App.Application/"]
COPY ["App.Domain/App.Domain.csproj", "App.Domain/"]
COPY ["App.Identity/App.Identity.csproj", "App.Identity/"]
COPY ["App.Infrastructure/App.Infrastructure.csproj", "App.Infrastructure/"]
COPY ["App.Persistence/App.Persistence.csproj", "App.Persistence/"]
# If the app.client frontend needs to be built inside .NET, it requires Node.js, 
# but usually, we separate frontend to Vercel and ONLY host the backend API on Render.
# To ensure the backend builds without NPM errors, we'll strip out SpaProxy from the build
# or just provide the necessary environment. 

RUN dotnet restore "App.Server/App.Server.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/App.Server"
# We publish the API. 
RUN dotnet publish "App.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port 80/8080 depending on the environment
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "App.Server.dll"]
