using MediatR;
using System.Collections.Generic;

namespace OOH.Application.Features.Global.Projects.Queries.GetProjectList
{
    public class GetProjectListQuery : IRequest<GetProjectListQueryResponse>
    {
    }

    public class GetProjectListQueryResponse
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public List<ProjectListVM> Data { get; set; } = new List<ProjectListVM>();
    }
}
