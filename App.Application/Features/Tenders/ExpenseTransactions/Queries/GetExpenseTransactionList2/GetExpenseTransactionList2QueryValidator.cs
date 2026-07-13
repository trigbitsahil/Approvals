using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList2
{
    public class GetExpenseTransactionList2QueryValidator : AbstractValidator<GetExpenseTransactionList2Query>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;
        public GetExpenseTransactionList2QueryValidator(IExpenseTransactionRepository ExpenseTransactionRepository)
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
