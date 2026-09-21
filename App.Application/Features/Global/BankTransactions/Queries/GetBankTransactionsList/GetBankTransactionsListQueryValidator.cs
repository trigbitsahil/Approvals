using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.BankTransactions.Queries.GetBankTransactionsList
{
    public class GetBankTransactionsListQueryValidator : AbstractValidator<GetBankTransactionsListQuery>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;

        public GetBankTransactionsListQueryValidator(IBankTransactionRepository bankTransactionRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;
        }
    }
}
