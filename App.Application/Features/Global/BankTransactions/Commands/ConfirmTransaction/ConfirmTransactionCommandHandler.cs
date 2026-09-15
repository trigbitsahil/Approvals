using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.BankTransactions.Commands.ConfirmTransaction
{
    public class ConfirmTransactionCommandHandler : IRequestHandler<ConfirmTransactionCommand, ConfirmTransactionCommandResponse>
    {
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly ILoggedInUserService _loggedInUserService;
        private readonly IApprovalHistoryRepository _historyRepository;

        private static readonly List<string> AuthorizedConfirmationEmails = new List<string>
        {
            "sanny.panesar@gmail.com",
            "shahid.hakim@gmail.com",
            "summaiya.shaikh@gmail.com",
            "summaiya.shaikh@wallop.in"
        };


        public ConfirmTransactionCommandHandler(
            IBankTransactionRepository bankTransactionRepository,
            ILoggedInUserService loggedInUserService,
            IApprovalHistoryRepository historyRepository = null)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _loggedInUserService = loggedInUserService;
            _historyRepository = historyRepository;
        }

        public async Task<ConfirmTransactionCommandResponse> Handle(ConfirmTransactionCommand request, CancellationToken cancellationToken)
        {
            var response = new ConfirmTransactionCommandResponse();

            string userEmail = (_loggedInUserService.UserEmail ?? "").ToLower();
            bool isAuthorized = AuthorizedConfirmationEmails.Any(e => e.ToLower() == userEmail);

            if (!isAuthorized && _loggedInUserService.UserRole != "SuperAdmin")
            {
                response.Success = false;
                response.Message = "Only authorized approvers can confirm this transaction.";
                return response;
            }

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

            foreach (var tx in matchingTxs)
            {
                tx.IsConfirm = true;
                tx.Remarks = request.Remarks;
                tx.LastModifiedBy = _loggedInUserService.UserEmail ?? "System";
                tx.LastModifiedDate = DateTime.UtcNow;

                if (!string.IsNullOrEmpty(tx.FromBankId))
                {
                    tx.Withdrawal = tx.Amount;
                    tx.Deposit = 0;

                    if (tx.RunningBalance == 0)
                    {
                        var fromBankTxs = allTxs.Where(t => t.TransactionId != tx.TransactionId && !t.IsVoided && (
                            (t.FromBankId == tx.FromBankId && (t.IsPaidToDistributor || t.IsConfirm)) ||
                            (t.ToBankId == tx.FromBankId && t.IsConfirm)
                        )).ToList();

                        decimal prevBal = fromBankTxs.Sum(t => (t.ToBankId == tx.FromBankId ? t.Deposit : 0) - (t.FromBankId == tx.FromBankId ? t.Withdrawal : 0));
                        tx.RunningBalance = prevBal - tx.Amount;
                    }
                }
                
                if (!string.IsNullOrEmpty(tx.ToBankId))
                {
                    tx.Deposit = tx.Amount;
                    tx.Withdrawal = 0;

                    var toBankTxs = allTxs.Where(t => t.TransactionId != tx.TransactionId && !t.IsVoided && (
                        (t.FromBankId == tx.ToBankId && (t.IsPaidToDistributor || t.IsConfirm)) ||
                        (t.ToBankId == tx.ToBankId && t.IsConfirm)
                    )).ToList();

                    decimal prevBal = toBankTxs.Sum(t => (t.ToBankId == tx.ToBankId ? t.Deposit : 0) - (t.FromBankId == tx.ToBankId ? t.Withdrawal : 0));
                    tx.RunningBalance = prevBal + tx.Amount;
                }

                await _bankTransactionRepository.UpdateAsync(tx);
            }

            if (_historyRepository != null && !string.IsNullOrEmpty(transaction.ApprovalId))
            {
                var confirmedTx = matchingTxs.FirstOrDefault() ?? transaction;
                var desc = $"Bank settlement transaction of ₹{confirmedTx.Amount} fully confirmed.";
                await _historyRepository.LogHistoryAsync(
                    confirmedTx.ApprovalId,
                    "Transaction Confirmed",
                    desc,
                    _loggedInUserService?.UserEmail ?? "Authorized Approver",
                    (_loggedInUserService?.UserEmail ?? "Authorized Approver").Split('@')[0],
                    confirmedTx.Remarks
                );
            }

            response.Success = true;
            response.Message = "Transaction confirmed successfully.";
            return response;
        }
    }
}
