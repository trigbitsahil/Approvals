using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.DeleteExpenseCategory
{
    public class DeleteExpenseCategoryCommandValidator : AbstractValidator<DeleteExpenseCategoryCommand>
    {
        private readonly IExpenseCategoryRepository _ExpenseCategoryRepository;
        public DeleteExpenseCategoryCommandValidator(IExpenseCategoryRepository ExpenseCategoryRepository)
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
