using MediatR;

namespace OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeDetail
{
    public class GetApprovalTypeDetailQuery : IRequest<GetApprovalTypeDetailQueryResponse>
    {
        public string ApprovalTypeID { get; set; }
    }
}
