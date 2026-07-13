using FluentValidation;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.Customers.Commands.DeleteCustomer
{
    public class DeleteCustomerCommandValidator : AbstractValidator<DeleteCustomerCommand>
    {
        private readonly ICustomerRepository _CustomerRepository;
        public DeleteCustomerCommandValidator(ICustomerRepository CustomerRepository)
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
