using OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail;
 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalWithTypeDetail
{
    public class ApprovalWithTypeDetailVM
    {
        public ApprovalDetailVM ApprovalDetails { get; set; }
 
        public ExpenseTransactionDetailVM ExpenseTransactionDetails { get; set; }


    }
}
