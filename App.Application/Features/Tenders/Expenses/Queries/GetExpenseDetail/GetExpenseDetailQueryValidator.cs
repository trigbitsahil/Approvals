using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseDetail
{
    public class GetExpenseDetailQueryValidator : AbstractValidator<GetExpenseDetailQuery>
    {
        private readonly IExpenseRepository _ExpenseRepository;
        public GetExpenseDetailQueryValidator(IExpenseRepository ExpenseRepository)
        {

            _ExpenseRepository = ExpenseRepository;

            RuleFor(r => r.ExpenseID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
