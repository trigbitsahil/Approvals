using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeList
{
    public class GetExpenseTypeListQueryValidator : AbstractValidator<GetExpenseTypeListQuery>
    {
        private readonly IExpenseTypeRepository _ExpenseTypeRepository;
        public GetExpenseTypeListQueryValidator(IExpenseTypeRepository ExpenseTypeRepository)
        {

            _ExpenseTypeRepository = ExpenseTypeRepository;

            //RuleFor(r => r.CategoryID)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
