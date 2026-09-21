using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetPendingBankTransactions
{
    public class GetPendingBankTransactionsQueryValidator : AbstractValidator<GetPendingBankTransactionsQuery>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;

        public GetPendingBankTransactionsQueryValidator(IBankTransactionRepository bankTransactionRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;
        }
    }
}
