using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.Vendors.Queries.GetVendorList
{
    public class GetVendorListQueryValidator : AbstractValidator<GetVendorListQuery>
    {
        private readonly IVendorRepository _VendorRepository;
        public GetVendorListQueryValidator(IVendorRepository VendorRepository)
        {

            _VendorRepository = VendorRepository;

            //RuleFor(r => r.CategoryID)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
