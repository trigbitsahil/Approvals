using MediatR;
using System;

namespace OOH.Application.Features.Global.Banks.Commands.CreateBank
{
    public class CreateBankCommand : IRequest<string>
    {
        public string Name { get; set; }
        public string? Type { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? UserId { get; set; }
        public string? Status { get; set; } = "Active";
        public string? TenantId { get; set; } = "TNT_2024_10_213955709c-50f7-4170-a976-6dd82fe7c8e3";
        public string? CreatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
