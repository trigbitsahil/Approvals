using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Vendors.Commands.UpdateVendor
{
    public class UpdateVendorCommandValidator : AbstractValidator<UpdateVendorCommand>
    {
        private readonly IVendorRepository _VendorRepository;
        public UpdateVendorCommandValidator(IVendorRepository VendorRepository)
        {

            _VendorRepository = VendorRepository;

            RuleFor(r => r.VendorID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
            RuleFor(r => r.VendorCategoryId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull();
        }

    }
}
