using MediatR;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalList
{
    public class GetApprovalListQuery : IRequest<GetApprovalListQueryResponse>
    {
        public string Category { get; set; }

        public string CategoryID { get; set; }

    }
}
