using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail
{
    public class GetExpenseTransactionDetailQueryValidator : AbstractValidator<GetExpenseTransactionDetailQuery>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;
        public GetExpenseTransactionDetailQueryValidator(IExpenseTransactionRepository ExpenseTransactionRepository)
        {

            _ExpenseTransactionRepository = ExpenseTransactionRepository;

            RuleFor(r => r.ExpenseTransactionID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
