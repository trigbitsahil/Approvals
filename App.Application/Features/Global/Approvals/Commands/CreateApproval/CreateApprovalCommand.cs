using MediatR;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Application.Features.Global.Approvals.Commands.CreateApproval
{
    public class CreateApprovalCommand : IRequest<CreateApprovalCommandResponse>, OOH.Application.Contracts.Infrastructure.ITransactionalCommand
    {



 

        public string Name { get; set; }
        public string? Reference { get; set; }

        public string Description { get; set; }
        public string? Details { get; set; }

        public string ApprovalType { get; set; }

        public string? ApprovalTypeId { get; set; }

        public string ApprovalStatusId { get; set; }

        public string Priority { get; set; }

        public bool AllApproverApprove { get; set; }

        //public string RequestedBy { get; set; }

        //public DateTime RequestedDate { get; set; }

        public string? Category { get; set; }

        public string? CategoryId { get; set; }

        public string? MediaId { get; set; }
      
        public DateTime? DateOfLetter { get; set; }

         public string? DepartmentId { get; set; }

        public string? FromBankId { get; set; }
        public string? ToBankId { get; set; }
        public decimal? TransactionAmount { get; set; }
        public string? VendorId { get; set; }
        public string? ContractId { get; set; }
    }
}
