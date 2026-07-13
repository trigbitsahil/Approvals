using OOH.Application.Features.Global.Approvals.Queries.GetApprovalList;
using OOH.Application.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalListByUser
{
    public class GetApprovalListByUserQueryResponse : BaseResponse
    {

        public GetApprovalListByUserQueryResponse() : base()
        {

        }

        public List<ApprovalListByUserVM> Data { get; set; } = default!;
    }
}
