using FluentValidation;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Approvals.Queries.GetApprovalListByUser
{

    public class GetApprovalListByUserQueryValidator : AbstractValidator<GetApprovalListByUserQuery>
    {
        private readonly IApprovalRepository _ApprovalRepository;
        public GetApprovalListByUserQueryValidator(IApprovalRepository ApprovalRepository)
        {

            _ApprovalRepository = ApprovalRepository;

            //RuleFor(r => r.CategoryID)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
