using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.UpdateExpenseType
{
    public class UpdateExpenseTypeCommandValidator : AbstractValidator<UpdateExpenseTypeCommand>
    {
        private readonly IExpenseTypeRepository _ExpenseTypeRepository;
        public UpdateExpenseTypeCommandValidator(IExpenseTypeRepository ExpenseTypeRepository)
        {

            _ExpenseTypeRepository = ExpenseTypeRepository;

            RuleFor(r => r.ExpenseTypeID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }

    }
}
