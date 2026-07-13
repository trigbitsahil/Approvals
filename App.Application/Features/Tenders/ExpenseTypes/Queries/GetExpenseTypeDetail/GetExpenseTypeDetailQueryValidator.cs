using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeDetail
{
    public class GetExpenseTypeDetailQueryValidator : AbstractValidator<GetExpenseTypeDetailQuery>
    {
        private readonly IExpenseTypeRepository _ExpenseTypeRepository;
        public GetExpenseTypeDetailQueryValidator(IExpenseTypeRepository ExpenseTypeRepository)
        {

            _ExpenseTypeRepository = ExpenseTypeRepository;

            RuleFor(r => r.ExpenseTypeID)
            .NotEmpty()
            .WithMessage("{PropertyName} is required")
            .NotNull()
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
