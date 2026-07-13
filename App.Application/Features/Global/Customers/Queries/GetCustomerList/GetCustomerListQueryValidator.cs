using FluentValidation;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.Customers.Queries.GetCustomerList
{
    public class GetCustomerListQueryValidator : AbstractValidator<GetCustomerListQuery>
    {
        private readonly ICustomerRepository _CustomerRepository;
        public GetCustomerListQueryValidator(ICustomerRepository CustomerRepository)
        {

            _CustomerRepository = CustomerRepository;

            //RuleFor(r => r.CategoryID)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
