using FluentValidation;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.Customers.Queries.GetCustomerDetail
{
    public class GetCustomerDetailQueryValidator : AbstractValidator<GetCustomerDetailQuery>
    {
        private readonly ICustomerRepository _CustomerRepository;
        public GetCustomerDetailQueryValidator(ICustomerRepository CustomerRepository)
        {

            _CustomerRepository = CustomerRepository;

            RuleFor(r => r.CustomerId)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
