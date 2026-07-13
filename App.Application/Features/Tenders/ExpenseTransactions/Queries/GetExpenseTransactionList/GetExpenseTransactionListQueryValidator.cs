using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList
{
    public class GetExpenseTransactionListQueryValidator : AbstractValidator<GetExpenseTransactionListQuery>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;
        public GetExpenseTransactionListQueryValidator(IExpenseTransactionRepository ExpenseTransactionRepository)
        {

            _ExpenseTransactionRepository = ExpenseTransactionRepository;

            RuleFor(r => r.CategoryID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
