using MediatR;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalWithTypeDetail
{
    public class GetApprovalWithTypeDetailQuery : IRequest<GetApprovalWithTypeDetailQueryResponse>
    {
        public string ApprovalID { get; set; }
    }
}
