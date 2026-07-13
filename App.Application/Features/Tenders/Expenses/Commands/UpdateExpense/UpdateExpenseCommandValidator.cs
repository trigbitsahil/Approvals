using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Expenses.Commands.UpdateExpense
{
    public class UpdateExpenseCommandValidator : AbstractValidator<UpdateExpenseCommand>
    {
        private readonly IExpenseRepository _ExpenseRepository;
        public UpdateExpenseCommandValidator(IExpenseRepository ExpenseRepository)
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
