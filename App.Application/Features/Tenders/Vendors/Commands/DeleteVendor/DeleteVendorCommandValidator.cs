using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Vendors.Commands.DeleteVendor
{
    public class DeleteVendorCommandValidator : AbstractValidator<DeleteVendorCommand>
    {
        private readonly IVendorRepository _VendorRepository;
        public DeleteVendorCommandValidator(IVendorRepository VendorRepository)
        {

            _VendorRepository = VendorRepository;

            RuleFor(r => r.VendorID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
