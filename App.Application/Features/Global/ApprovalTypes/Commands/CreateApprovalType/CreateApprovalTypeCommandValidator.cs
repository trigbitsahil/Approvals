using FluentValidation;
using OOH.Application.Contracts.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.CreateApprovalType
{
    public class CreateApprovalTypeCommandValidator : AbstractValidator<CreateApprovalTypeCommand>
    {
        private readonly IApprovalTypeRepository _ApprovalTypeRepository;
        public CreateApprovalTypeCommandValidator(IApprovalTypeRepository ApprovalTypeRepository)
        {
            _ApprovalTypeRepository = ApprovalTypeRepository;

            //RuleFor(r => r.Name)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }

}
