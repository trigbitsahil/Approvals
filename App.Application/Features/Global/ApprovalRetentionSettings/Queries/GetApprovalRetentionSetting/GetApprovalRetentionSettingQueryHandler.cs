using System.Threading;
using System.Threading.Tasks;
using MediatR;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Queries.GetApprovalRetentionSetting
{
    public class GetApprovalRetentionSettingQueryHandler : IRequestHandler<GetApprovalRetentionSettingQuery, GetApprovalRetentionSettingQueryResponse>
    {
        private readonly IApprovalRetentionSettingRepository _repository;

        public GetApprovalRetentionSettingQueryHandler(IApprovalRetentionSettingRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetApprovalRetentionSettingQueryResponse> Handle(GetApprovalRetentionSettingQuery request, CancellationToken cancellationToken)
        {
            var response = new GetApprovalRetentionSettingQueryResponse();

            var setting = await _repository.GetActiveSettingAsync();

            if (setting == null)
            {
                response.Success = false;
                response.Message = "No active retention setting found in database.";
                return response;
            }

            response.Data = new ApprovalRetentionSettingVM
            {
                SettingId = setting.SettingId,
                RetentionDays = setting.RetentionDays,
                IsActive = setting.IsActive,
                TenantId = setting.TenantId,
                CreatedBy = setting.CreatedBy,
                CreatedDate = setting.CreatedDate,
                LastModifiedBy = setting.LastModifiedBy,
                LastModifiedDate = setting.LastModifiedDate
            };

            return response;
        }
    }
}
