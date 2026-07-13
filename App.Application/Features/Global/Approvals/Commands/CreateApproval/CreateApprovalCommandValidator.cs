using FluentValidation;
using OOH.Application.Contracts.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Approvals.Commands.CreateApproval
{
    public class CreateApprovalCommandValidator : AbstractValidator<CreateApprovalCommand>
    {
        private readonly IApprovalRepository _ApprovalRepository;
        public CreateApprovalCommandValidator(IApprovalRepository ApprovalRepository)
        {
            _ApprovalRepository = ApprovalRepository;

            //RuleFor(r => r.Name)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }

}
