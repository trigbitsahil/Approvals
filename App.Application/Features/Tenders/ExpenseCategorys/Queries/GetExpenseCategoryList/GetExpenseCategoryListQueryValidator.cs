using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Queries.GetExpenseCategoryList
{
    public class GetExpenseCategoryListQueryValidator : AbstractValidator<GetExpenseCategoryListQuery>
    {
        private readonly IExpenseCategoryRepository _ExpenseCategoryRepository;
        public GetExpenseCategoryListQueryValidator(IExpenseCategoryRepository ExpenseCategoryRepository)
        {

            _ExpenseCategoryRepository = ExpenseCategoryRepository;

            //RuleFor(r => r.CategoryID)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }
}
