using FluentValidation;
using OOH.Application.Contracts.Persistence.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.CreateApprovalComment
{
    public class CreateApprovalCommentCommandValidator : AbstractValidator<CreateApprovalCommentCommand>
    {
        private readonly IApprovalCommentRepository _ApprovalCommentRepository;
        public CreateApprovalCommentCommandValidator(IApprovalCommentRepository ApprovalCommentRepository)
        {
            _ApprovalCommentRepository = ApprovalCommentRepository;

            //RuleFor(r => r.Name)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }

}
