using MediatR;
using System;

namespace OOH.Application.Features.Global.Banks.Commands.UpdateBank
{
    public class UpdateBankCommand : IRequest<bool>
    {
        public string BankId { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        
        public string? UserId { get; set; }

        public string? Status { get; set; }
        public bool? IsActive { get; set; }
        public string? LastModifiedBy { get; set; }
        public decimal? InitialBalanceAmount { get; set; }
        public string? InitialBalanceDescription { get; set; }
    }
}
