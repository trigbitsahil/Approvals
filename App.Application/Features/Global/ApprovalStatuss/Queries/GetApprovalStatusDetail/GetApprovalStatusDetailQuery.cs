using MediatR;

namespace OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusDetail
{
    public class GetApprovalStatusDetailQuery : IRequest<GetApprovalStatusDetailQueryResponse>
    {
        public string ApprovalStatusID { get; set; }
    }
}
