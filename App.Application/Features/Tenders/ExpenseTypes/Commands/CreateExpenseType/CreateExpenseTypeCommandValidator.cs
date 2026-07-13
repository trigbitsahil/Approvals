using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.ExpenseTypes.Commands.CreateExpenseType
{
    public class CreateExpenseTypeCommandValidator : AbstractValidator<CreateExpenseTypeCommand>
    {
        private readonly IExpenseTypeRepository _ExpenseTypeRepository;
        public CreateExpenseTypeCommandValidator(IExpenseTypeRepository ExpenseTypeRepository)
        {
            _ExpenseTypeRepository = ExpenseTypeRepository;

            //RuleFor(r => r.Name)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }

}
