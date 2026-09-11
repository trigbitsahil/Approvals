using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.BankTransactions.Commands.PayDistributor
{
    public class PayDistributorCommandHandler : IRequestHandler<PayDistributorCommand, PayDistributorCommandResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IBankRepository _bankRepository;
        private readonly ILoggedInUserService _loggedInUserService;
        private readonly IApprovalHistoryRepository _historyRepository;

        public PayDistributorCommandHandler(
            IBankTransactionRepository bankTransactionRepository,
            IBankRepository bankRepository,
            ILoggedInUserService loggedInUserService,
            IApprovalHistoryRepository historyRepository = null)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _loggedInUserService = loggedInUserService;
            _historyRepository = historyRepository;
        }

        public async Task<PayDistributorCommandResponse> Handle(PayDistributorCommand request, CancellationToken cancellationToken)
        {
            var response = new PayDistributorCommandResponse();

            var transaction = await _bankTransactionRepository.GetByIdAsync(request.TransactionId);
            if (transaction == null)
            {
                response.Success = false;
                response.Message = "Transaction not found.";
                return response;
            }

            var allTxs = await _bankTransactionRepository.ListAllAsync();
            var matchingTxs = !string.IsNullOrEmpty(transaction.ApprovalId)
                ? allTxs.Where(t => t.ApprovalId == transaction.ApprovalId && !t.IsVoided).ToList()
                : new List<BankTransaction> { transaction };

            string fromBankId = matchingTxs.FirstOrDefault(t => !string.IsNullOrEmpty(t.FromBankId))?.FromBankId ?? transaction.FromBankId;

            if (!string.IsNullOrEmpty(fromBankId))
            {
                var bank = await _bankRepository.GetByIdAsync(fromBankId);
                if (bank != null && !string.IsNullOrEmpty(bank.UserId))
                {
                    // Check if current user is the assigned bank user
                    bool isAssignedUser = string.Equals(bank.UserId, _loggedInUserService.UserId, StringComparison.OrdinalIgnoreCase) ||
                                          string.Equals(bank.UserId, _loggedInUserService.UserEmail, StringComparison.OrdinalIgnoreCase);

                    if (!isAssignedUser && _loggedInUserService.UserRole != "SuperAdmin")
                    {
                        response.Success = false;
                        response.Message = "Only the assigned user of this From Bank can process Paid to Distributor.";
                        return response;
                    }
                }
            }

            foreach (var tx in matchingTxs)
            {
                tx.IsPaidToDistributor = true;
                tx.LastModifiedBy = _loggedInUserService.UserEmail ?? "System";
                tx.LastModifiedDate = DateTime.UtcNow;

                if (!string.IsNullOrEmpty(tx.FromBankId))
                {
                    tx.Withdrawal = tx.Amount;
                    tx.Deposit = 0;

                    var bankTxs = allTxs.Where(t => t.TransactionId != tx.TransactionId && !t.IsVoided && (
                        (t.FromBankId == tx.FromBankId && (t.IsPaidToDistributor || t.IsConfirm)) ||
                        (t.ToBankId == tx.FromBankId && t.IsConfirm)
                    )).ToList();

                    decimal prevBal = bankTxs.Sum(t => (t.ToBankId == tx.FromBankId ? t.Deposit : 0) - (t.FromBankId == tx.FromBankId ? t.Withdrawal : 0));
                    tx.RunningBalance = prevBal - tx.Amount;
                }

                await _bankTransactionRepository.UpdateAsync(tx);
            }

            if (_historyRepository != null && !string.IsNullOrEmpty(transaction.ApprovalId))
            {
                await _historyRepository.LogHistoryAsync(
                    transaction.ApprovalId,
                    "Paid to Distributor",
                    $"Bank settlement of ₹{transaction.Amount} marked as Paid to Distributor.",
                    _loggedInUserService?.UserEmail ?? "Bank Manager",
                    (_loggedInUserService?.UserEmail ?? "Bank Manager").Split('@')[0]
                );
            }

            response.Success = true;
            response.Message = "Marked as Paid to Distributor successfully.";
            return response;
        }
    }
}
