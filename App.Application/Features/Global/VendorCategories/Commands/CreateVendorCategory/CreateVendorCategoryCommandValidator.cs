using FluentValidation;

namespace OOH.Application.Features.Global.VendorCategories.Commands.CreateVendorCategory
{
    public class CreateVendorCategoryCommandValidator : AbstractValidator<CreateVendorCategoryCommand>
    {
        public CreateVendorCategoryCommandValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("{PropertyName} is required.")
                .NotNull()
                .MaximumLength(500).WithMessage("{PropertyName} must not exceed 500 characters.");
        }
    }
}
