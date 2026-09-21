using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Persistence.Global;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.ApprovalHistories.Queries.GetApprovalHistoryList
{
    public class GetApprovalHistoryListQueryHandler : IRequestHandler<GetApprovalHistoryListQuery, GetApprovalHistoryListQueryResponse>
    {
        private readonly IApprovalHistoryRepository _historyRepository;
        private readonly IApprovalRepository _approvalRepository;
        private readonly IApprovalApproverRepository _approverRepository;
        private readonly IBankTransactionRepository _bankTransactionRepository;
        private readonly IApprovalCommentRepository _commentRepository;
        private readonly IEncryptionService _encryptionService;

        public GetApprovalHistoryListQueryHandler(
            IApprovalHistoryRepository historyRepository,
            IApprovalRepository approvalRepository,
            IApprovalApproverRepository approverRepository,
            IBankTransactionRepository bankTransactionRepository,
            IApprovalCommentRepository commentRepository,
            IEncryptionService encryptionService = null)
        {
            _historyRepository = historyRepository;
            _approvalRepository = approvalRepository;
            _approverRepository = approverRepository;
            _bankTransactionRepository = bankTransactionRepository;
            _commentRepository = commentRepository;
            _encryptionService = encryptionService;
        }

        private string DecryptText(string text)
        {
            if (string.IsNullOrEmpty(text) || _encryptionService == null) return text;
            try
            {
                return _encryptionService.Decrypt(text);
            }
            catch
            {
                return text;
            }
        }

        public async Task<GetApprovalHistoryListQueryResponse> Handle(GetApprovalHistoryListQuery request, CancellationToken cancellationToken)
        {
            var histories = await _historyRepository.GetByApprovalIdAsync(request.ApprovalId);
            
            var result = histories.Select(h => new ApprovalHistoryListVM
            {
                HistoryId = h.HistoryId,
                ApprovalId = h.ApprovalId,
                Action = h.Action,
                Description = DecryptText(h.Description),
                PerformedBy = h.PerformedBy,
                PerformedByName = h.PerformedByName ?? h.PerformedBy,
                Remarks = DecryptText(h.Remarks),
                CreatedDate = h.CreatedDate
            }).ToList();

            // Fallback / Synthesis for legacy approvals or incomplete histories
            if (!result.Any())
            {
                var approval = await _approvalRepository.GetByIdAsync(request.ApprovalId);
                if (approval != null)
                {
                    var approvalName = DecryptText(approval.Name ?? approval.Reference ?? "Request");

                    // 1. Created Event
                    result.Add(new ApprovalHistoryListVM
                    {
                        HistoryId = System.Guid.NewGuid().ToString(),
                        ApprovalId = approval.ApprovalId,
                        Action = "Approval Created",
                        Description = $"Approval request '{approvalName}' submitted.",
                        PerformedBy = approval.RequestedBy,
                        PerformedByName = approval.RequestedBy,
                        CreatedDate = approval.RequestedDate
                    });

                    // 2. Approver Responses
                    var approvers = await _approverRepository.ListAllApprovalApproversAsync(request.ApprovalId);
                    if (approvers != null)
                    {
                        foreach (var appr in approvers.Where(a => a.IsResponded))
                        {
                            result.Add(new ApprovalHistoryListVM
                            {
                                HistoryId = System.Guid.NewGuid().ToString(),
                                ApprovalId = approval.ApprovalId,
                                Action = appr.IsApproved ? "Approved" : "Rejected",
                                Description = appr.IsApproved 
                                    ? $"Approval request approved by {appr.ApprovalApproverEmail}." 
                                    : $"Approval request rejected by {appr.ApprovalApproverEmail}.",
                                PerformedBy = appr.ApprovalApproverEmail,
                                PerformedByName = appr.ApprovalApproverEmail?.Split('@')[0],
                                Remarks = appr.Remarks,
                                CreatedDate = appr.RespondedDate ?? approval.RequestedDate.AddMinutes(5)
                            });
                        }
                    }

                    // 3. Bank Transactions
                    var allTxs = await _bankTransactionRepository.ListAllAsync();
                    var pendingTx = allTxs?.FirstOrDefault(t => t.ApprovalId == request.ApprovalId);
                    if (pendingTx != null)
                    {
                        if (pendingTx.IsPaidToDistributor)
                        {
                            result.Add(new ApprovalHistoryListVM
                            {
                                HistoryId = System.Guid.NewGuid().ToString(),
                                ApprovalId = approval.ApprovalId,
                                Action = "Paid to Distributor",
                                Description = $"Amount ₹{pendingTx.Amount} marked as paid to distributor.",
                                PerformedBy = "Bank Manager",
                                PerformedByName = "Bank Manager",
                                CreatedDate = pendingTx.CreatedDate.AddMinutes(10)
                            });
                        }

                        if (pendingTx.IsConfirm)
                        {
                            result.Add(new ApprovalHistoryListVM
                            {
                                HistoryId = System.Guid.NewGuid().ToString(),
                                ApprovalId = approval.ApprovalId,
                                Action = "Transaction Confirmed",
                                Description = "Bank settlement transaction fully confirmed.",
                                PerformedBy = "Bank Manager",
                                PerformedByName = "Bank Manager",
                                CreatedDate = pendingTx.CreatedDate.AddMinutes(20)
                            });
                        }
                    }

                    // 4. Comments
                    var comments = await _commentRepository.ListAllApprovalCommentsAsync(request.ApprovalId);
                    if (comments != null)
                    {
                        foreach (var c in comments)
                        {
                            result.Add(new ApprovalHistoryListVM
                            {
                                HistoryId = System.Guid.NewGuid().ToString(),
                                ApprovalId = approval.ApprovalId,
                                Action = "Comment Added",
                                Description = $"Comment added: \"{c.CommentText}\"",
                                PerformedBy = c.CreatedBy,
                                PerformedByName = c.CreatedBy?.Split('@')[0],
                                CreatedDate = c.CreatedDate
                            });
                        }
                    }
                }
            }

            return new GetApprovalHistoryListQueryResponse
            {
                Success = true,
                Data = result.OrderBy(x => x.CreatedDate).ToList()
            };
        }
    }
}
