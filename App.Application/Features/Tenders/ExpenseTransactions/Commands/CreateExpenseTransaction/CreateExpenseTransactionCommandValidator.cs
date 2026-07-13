using FluentValidation;
using OOH.Application.Contracts.Persistence.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.ExpenseTransactions.Commands.CreateExpenseTransaction
{
    public class CreateExpenseTransactionCommandValidator : AbstractValidator<CreateExpenseTransactionCommand>
    {
        private readonly IExpenseTransactionRepository _ExpenseTransactionRepository;
        public CreateExpenseTransactionCommandValidator(IExpenseTransactionRepository ExpenseTransactionRepository)
        {
            _ExpenseTransactionRepository = ExpenseTransactionRepository;

            //RuleFor(r => r.Name)
            //.NotEmpty()
            //.WithMessage("{PropertyName} is required")
            //.NotNull()
            //.MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");



        }


    }

}
