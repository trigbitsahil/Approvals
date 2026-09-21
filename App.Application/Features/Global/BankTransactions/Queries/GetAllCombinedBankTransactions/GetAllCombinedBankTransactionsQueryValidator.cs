using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetAllCombinedBankTransactions
{
    public class GetAllCombinedBankTransactionsQueryValidator : AbstractValidator<GetAllCombinedBankTransactionsQuery>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;

        public GetAllCombinedBankTransactionsQueryValidator(IBankTransactionRepository bankTransactionRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;
        }
    }
}
