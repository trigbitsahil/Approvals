using FluentValidation;
using OOH.Application.Contracts.Persistence;

namespace OOH.Application.Features.Global.ApprovalHistories.Queries.GetApprovalHistoryList
{
    public class GetApprovalHistoryListQueryValidator : AbstractValidator<GetApprovalHistoryListQuery>
    {
        private readonly IApprovalHistoryRepository _historyRepository;

        public GetApprovalHistoryListQueryValidator(IApprovalHistoryRepository historyRepository)
        {
            _historyRepository = historyRepository;

            RuleFor(r => r.ApprovalId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull()
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
        }
    }
}
