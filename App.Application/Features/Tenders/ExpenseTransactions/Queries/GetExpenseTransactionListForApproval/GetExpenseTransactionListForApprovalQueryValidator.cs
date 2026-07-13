using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListForApproval
{
    public class GetExpenseTransactionListForApprovalQueryValidator : AbstractValidator<GetExpenseTransactionListForApprovalQuery>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;
        public GetExpenseTransactionListForApprovalQueryValidator(IExpenseTransactionRepository ExpenseTransactionRepository)
        {

            _ExpenseTransactionRepository = ExpenseTransactionRepository;

            //RuleFor(r => r.CategoryID)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
