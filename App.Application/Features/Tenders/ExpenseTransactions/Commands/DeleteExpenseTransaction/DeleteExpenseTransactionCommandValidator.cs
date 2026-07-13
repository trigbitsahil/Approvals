using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.DeleteExpenseTransaction
{
    public class DeleteExpenseTransactionCommandValidator : AbstractValidator<DeleteExpenseTransactionCommand>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;
        public DeleteExpenseTransactionCommandValidator(IExpenseTransactionRepository ExpenseTransactionRepository)
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
