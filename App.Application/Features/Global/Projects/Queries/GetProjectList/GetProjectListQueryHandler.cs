using MediatR;
using OOH.Application.Contracts.Infrastructure;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Projects.Queries.GetProjectList
{
    public class GetProjectListQueryHandler : IRequestHandler<GetProjectListQuery, GetProjectListQueryResponse>
    {
        private readonly IExternalApiClientService _externalApiClientService;

        public GetProjectListQueryHandler(IExternalApiClientService externalApiClientService)
        {
            _externalApiClientService = externalApiClientService;
        }

        public async Task<GetProjectListQueryResponse> Handle(GetProjectListQuery request, CancellationToken cancellationToken)
        {
            var response = new GetProjectListQueryResponse();

            try
            {
                var projects = await _externalApiClientService.GetProjectsAsync(cancellationToken);
                response.Success = true;
                response.Data = projects ?? new List<ProjectListVM>();
                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetProjectListQueryHandler] Exception: {ex.Message}");
                response.Success = false;
                response.Message = $"Error retrieving projects: {ex.Message}";
                return response;
            }
        }
    }
}
