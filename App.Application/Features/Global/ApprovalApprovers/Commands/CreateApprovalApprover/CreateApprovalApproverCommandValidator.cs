using FluentValidation;
using OOH.Application.Contracts.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.CreateApprovalApprover
{
    public class CreateApprovalApproverCommandValidator : AbstractValidator<CreateApprovalApproverCommand>
    {
        private readonly IApprovalApproverRepository _ApprovalApproverRepository;
        public CreateApprovalApproverCommandValidator(IApprovalApproverRepository ApprovalApproverRepository)
        {
            _ApprovalApproverRepository = ApprovalApproverRepository;

            //RuleFor(r => r.Name)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }

}
