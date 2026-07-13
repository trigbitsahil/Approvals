using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Expenses.Commands.CreateExpense
{
    public class CreateExpenseCommandValidator : AbstractValidator<CreateExpenseCommand>
    {
        private readonly IExpenseRepository _ExpenseRepository;
        public CreateExpenseCommandValidator(IExpenseRepository ExpenseRepository)
        {
            _ExpenseRepository = ExpenseRepository;

            //RuleFor(r => r.Name)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }

}
