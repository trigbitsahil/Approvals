using Microsoft.Extensions.DependencyInjection;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Application.Features.Global.Contracts.Queries.GetContractList;
using OOH.Application.Features.Global.Projects.Queries.GetProjectList;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Infrastructure.Services
{
    public class ExternalApiClientService : IExternalApiClientService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private static string? _cachedToken;
        private static DateTime _tokenExpiry = DateTime.MinValue;
        private static readonly object _lock = new object();

        public ExternalApiClientService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public async Task<string?> GetAccessTokenAsync(CancellationToken cancellationToken = default)
        {
            // Check if valid cached token exists
            if (!string.IsNullOrEmpty(_cachedToken) && DateTime.UtcNow < _tokenExpiry)
            {
                return _cachedToken;
            }

            string email = null;
            string password = null;

            // Resolve scoped repository to fetch credentials
            using (var scope = _scopeFactory.CreateScope())
            {
                var repo = scope.ServiceProvider.GetRequiredService<IApiClientCredentialRepository>();
                var creds = await repo.GetLatestCredentialsAsync();
                if (creds != null && !string.IsNullOrEmpty(creds.Email) && !string.IsNullOrEmpty(creds.Password))
                {
                    email = creds.Email;
                    password = creds.Password;
                }
            }

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                Console.WriteLine("[ExternalApiClientService] Credentials missing in DB api_client_credentials.");
                return null;
            }

            try
            {
                using var client = new HttpClient();
                var loginUrl = "https://oohapi-b7eud8e8hzg0c8bp.centralindia-01.azurewebsites.net/api/v1/auth/login";
                var loginPayload = JsonSerializer.Serialize(new { email, password });
                var loginContent = new StringContent(loginPayload, Encoding.UTF8, "application/json");

                var loginRes = await client.PostAsync(loginUrl, loginContent, cancellationToken);
                if (!loginRes.IsSuccessStatusCode)
                {
                    Console.WriteLine($"[ExternalApiClientService] Auth login failed: {loginRes.StatusCode}");
                    return null;
                }

                var loginJson = await loginRes.Content.ReadAsStringAsync(cancellationToken);
                string accessToken = null;
                int expiresIn = 900; // default 15 mins

                using (var loginDoc = JsonDocument.Parse(loginJson))
                {
                    var root = loginDoc.RootElement;
                    if (root.TryGetProperty("accessToken", out var tokenProp) || root.TryGetProperty("AccessToken", out tokenProp) || root.TryGetProperty("token", out tokenProp))
                    {
                        accessToken = tokenProp.GetString();
                    }
                    else if (root.TryGetProperty("data", out var dataProp) || root.TryGetProperty("Data", out dataProp))
                    {
                        if (dataProp.ValueKind == JsonValueKind.Object && (dataProp.TryGetProperty("accessToken", out tokenProp) || dataProp.TryGetProperty("AccessToken", out tokenProp) || dataProp.TryGetProperty("token", out tokenProp)))
                        {
                            accessToken = tokenProp.GetString();
                        }
                        else if (dataProp.ValueKind == JsonValueKind.String)
                        {
                            accessToken = dataProp.GetString();
                        }
                    }

                    if (root.TryGetProperty("expiresIn", out var expProp) && expProp.ValueKind == JsonValueKind.Number)
                    {
                        expiresIn = expProp.GetInt32();
                    }
                }

                if (!string.IsNullOrEmpty(accessToken))
                {
                    lock (_lock)
                    {
                        _cachedToken = accessToken;
                        _tokenExpiry = DateTime.UtcNow.AddSeconds(expiresIn - 60);
                    }
                    Console.WriteLine("[ExternalApiClientService] Successfully acquired and cached Bearer token.");
                    return accessToken;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ExternalApiClientService] Auth Exception: {ex.Message}");
            }

            return null;
        }

        public async Task<List<ProjectListVM>> GetProjectsAsync(CancellationToken cancellationToken = default)
        {
            var token = await GetAccessTokenAsync(cancellationToken);
            if (string.IsNullOrEmpty(token))
            {
                return new List<ProjectListVM>();
            }

            try
            {
                using var client = new HttpClient();
                var projectUrl = "https://oohapi-b7eud8e8hzg0c8bp.centralindia-01.azurewebsites.net/api/v1/project";
                using var projectReq = new HttpRequestMessage(HttpMethod.Get, projectUrl);
                projectReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var projectRes = await client.SendAsync(projectReq, cancellationToken);
                if (!projectRes.IsSuccessStatusCode)
                {
                    Console.WriteLine($"[ExternalApiClientService] Project API failed: {projectRes.StatusCode}");
                    return new List<ProjectListVM>();
                }

                var projectJson = await projectRes.Content.ReadAsStringAsync(cancellationToken);
                var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                using (var projectDoc = JsonDocument.Parse(projectJson))
                {
                    var projRoot = projectDoc.RootElement;
                    if (projRoot.ValueKind == JsonValueKind.Array)
                    {
                        return JsonSerializer.Deserialize<List<ProjectListVM>>(projectJson, jsonOptions) ?? new List<ProjectListVM>();
                    }
                    else if (projRoot.ValueKind == JsonValueKind.Object && (projRoot.TryGetProperty("data", out var dataElem) || projRoot.TryGetProperty("Data", out dataElem)) && dataElem.ValueKind == JsonValueKind.Array)
                    {
                        return JsonSerializer.Deserialize<List<ProjectListVM>>(dataElem.GetRawText(), jsonOptions) ?? new List<ProjectListVM>();
                    }
                    else if (projRoot.ValueKind == JsonValueKind.Object && (projRoot.TryGetProperty("projects", out var projElem) || projRoot.TryGetProperty("Projects", out projElem)) && projElem.ValueKind == JsonValueKind.Array)
                    {
                        return JsonSerializer.Deserialize<List<ProjectListVM>>(projElem.GetRawText(), jsonOptions) ?? new List<ProjectListVM>();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ExternalApiClientService] Project Exception: {ex.Message}");
            }

            return new List<ProjectListVM>();
        }

        public async Task<List<ContractListVM>> GetContractsAsync(CancellationToken cancellationToken = default)
        {
            var token = await GetAccessTokenAsync(cancellationToken);
            if (string.IsNullOrEmpty(token))
            {
                return new List<ContractListVM>();
            }

            try
            {
                using var client = new HttpClient();
                var contractUrl = "https://oohapi-b7eud8e8hzg0c8bp.centralindia-01.azurewebsites.net/api/v1/contract";
                using var contractReq = new HttpRequestMessage(HttpMethod.Get, contractUrl);
                contractReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var contractRes = await client.SendAsync(contractReq, cancellationToken);
                if (!contractRes.IsSuccessStatusCode)
                {
                    Console.WriteLine($"[ExternalApiClientService] Contract API failed: {contractRes.StatusCode}");
                    return new List<ContractListVM>();
                }

                var contractJson = await contractRes.Content.ReadAsStringAsync(cancellationToken);
                var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                using (var contractDoc = JsonDocument.Parse(contractJson))
                {
                    var contractRoot = contractDoc.RootElement;
                    if (contractRoot.ValueKind == JsonValueKind.Array)
                    {
                        return JsonSerializer.Deserialize<List<ContractListVM>>(contractJson, jsonOptions) ?? new List<ContractListVM>();
                    }
                    else if (contractRoot.ValueKind == JsonValueKind.Object && (contractRoot.TryGetProperty("data", out var dataElem) || contractRoot.TryGetProperty("Data", out dataElem)) && dataElem.ValueKind == JsonValueKind.Array)
                    {
                        return JsonSerializer.Deserialize<List<ContractListVM>>(dataElem.GetRawText(), jsonOptions) ?? new List<ContractListVM>();
                    }
                    else if (contractRoot.ValueKind == JsonValueKind.Object && (contractRoot.TryGetProperty("contracts", out var cElem) || contractRoot.TryGetProperty("Contracts", out cElem)) && cElem.ValueKind == JsonValueKind.Array)
                    {
                        return JsonSerializer.Deserialize<List<ContractListVM>>(cElem.GetRawText(), jsonOptions) ?? new List<ContractListVM>();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ExternalApiClientService] Contract Exception: {ex.Message}");
            }

            return new List<ContractListVM>();
        }
    }
}
