using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace OOH.Application.Features.Tenders.Vendors.Commands.CreateVendor
{
    public class CreateVendorCommandValidator : AbstractValidator<CreateVendorCommand>
    {
        private readonly IVendorRepository _VendorRepository;
        public CreateVendorCommandValidator(IVendorRepository VendorRepository)
        {
            _VendorRepository = VendorRepository;
            //RuleFor(r => r.Name)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
            RuleFor(r => r.VendorCategoryId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull();
        }
    }
}