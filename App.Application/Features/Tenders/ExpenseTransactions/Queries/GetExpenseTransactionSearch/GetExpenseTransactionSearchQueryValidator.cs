using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionSearch
{
    public class GetExpenseTransactionSearchQueryValidator : AbstractValidator<GetExpenseTransactionSearchQuery>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;
        public GetExpenseTransactionSearchQueryValidator(IExpenseTransactionRepository ExpenseTransactionRepository)
        {

            _ExpenseTransactionRepository = ExpenseTransactionRepository;

        //    RuleFor(r => r.MediaId)
        //    .NotEmpty()
        //    .WithMessage("{PropertyName} is required")
        //    .NotNull()
        //    .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");

        //    RuleFor(r => r.VendorId)
        //.NotEmpty()
        //.WithMessage("{PropertyName} is required")
        //.NotNull()
        //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");




        }


    }
}
