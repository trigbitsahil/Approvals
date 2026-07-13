using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.ExpenseCategorys.Commands.CreateExpenseCategory
{
    public class CreateExpenseCategoryCommandValidator : AbstractValidator<CreateExpenseCategoryCommand>
    {
        private readonly IExpenseCategoryRepository _ExpenseCategoryRepository;
        public CreateExpenseCategoryCommandValidator(IExpenseCategoryRepository ExpenseCategoryRepository)
        {
            _ExpenseCategoryRepository = ExpenseCategoryRepository;

            //RuleFor(r => r.Name)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }

}
