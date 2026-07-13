using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.UpdateExpenseCategory
{
    public class UpdateExpenseCategoryCommandValidator : AbstractValidator<UpdateExpenseCategoryCommand>
    {
        private readonly IExpenseCategoryRepository _ExpenseCategoryRepository;
        public UpdateExpenseCategoryCommandValidator(IExpenseCategoryRepository ExpenseCategoryRepository)
        {

            _ExpenseCategoryRepository = ExpenseCategoryRepository;

            RuleFor(r => r.ExpenseCategoryId)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }

    }
}
