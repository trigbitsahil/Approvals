using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseList
{
    public class GetExpenseListQueryValidator : AbstractValidator<GetExpenseListQuery>
    {
        private readonly IExpenseRepository _ExpenseRepository;
        public GetExpenseListQueryValidator(IExpenseRepository ExpenseRepository)
        {

            _ExpenseRepository = ExpenseRepository;

            RuleFor(r => r.ExpenseTypeID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
