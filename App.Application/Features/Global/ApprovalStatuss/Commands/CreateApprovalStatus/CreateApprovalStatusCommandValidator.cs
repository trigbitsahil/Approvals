using FluentValidation;
using OOH.Application.Contracts.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.CreateApprovalStatus
{
    public class CreateApprovalStatusCommandValidator : AbstractValidator<CreateApprovalStatusCommand>
    {
        private readonly IApprovalStatusRepository _ApprovalStatusRepository;
        public CreateApprovalStatusCommandValidator(IApprovalStatusRepository ApprovalStatusRepository)
        {
            _ApprovalStatusRepository = ApprovalStatusRepository;

            //RuleFor(r => r.Name)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }

}
