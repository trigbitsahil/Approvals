using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorDetail
{
    public class GetVendorDetailQueryValidator : AbstractValidator<GetVendorDetailQuery>
    {
        private readonly IVendorRepository _VendorRepository;
        public GetVendorDetailQueryValidator(IVendorRepository VendorRepository)
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
