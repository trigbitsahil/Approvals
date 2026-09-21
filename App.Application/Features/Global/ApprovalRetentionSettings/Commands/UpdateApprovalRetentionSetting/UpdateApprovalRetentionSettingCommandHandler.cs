using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Application.Features.Global.ApprovalRetentionSettings.Queries.GetApprovalRetentionSetting;
using OOH.Domain.Entities.Global;
using OOH.Domain;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.UpdateApprovalRetentionSetting
{
    public class UpdateApprovalRetentionSettingCommandHandler : IRequestHandler<UpdateApprovalRetentionSettingCommand, UpdateApprovalRetentionSettingCommandResponse>
    {
        private readonly IApprovalRetentionSettingRepository _repository;
        private readonly ILoggedInUserService _loggedInUserService;

        public UpdateApprovalRetentionSettingCommandHandler(
            IApprovalRetentionSettingRepository repository,
            ILoggedInUserService loggedInUserService)
        {
            _repository = repository;
            _loggedInUserService = loggedInUserService;
        }

        public async Task<UpdateApprovalRetentionSettingCommandResponse> Handle(UpdateApprovalRetentionSettingCommand request, CancellationToken cancellationToken)
        {
            var response = new UpdateApprovalRetentionSettingCommandResponse();
            var validator = new UpdateApprovalRetentionSettingCommandValidator(_repository);
            var validationResult = await validator.ValidateAsync(request, cancellationToken);

            if (!validationResult.IsValid)
            {
                response.Success = false;
                response.ValidationErrors = new List<string>();
                foreach (var err in validationResult.Errors)
                {
                    response.ValidationErrors.Add(err.ErrorMessage);
                }
                return response;
            }

            var setting = await _repository.GetByIdAsync(request.SettingId);
            if (setting == null)
            {
                response.Success = false;
                response.Message = $"Unable to update, record with ID '{request.SettingId}' does not exist.";
                return response;
            }

            setting.RetentionDays = request.RetentionDays;
            setting.IsActive = request.IsActive;
            setting.LastModifiedBy = _loggedInUserService.UserEmail ?? "System";
            setting.LastModifiedDate = DateTime.UtcNow;
            await _repository.UpdateAsync(setting);

            response.Success = true;
            response.Message = $"Retention setting updated successfully to {setting.RetentionDays} days.";
            response.Data = new UpdateApprovalRetentionSettingDto
            {
                SettingId = setting.SettingId,
                RetentionDays = setting.RetentionDays,
                IsActive = setting.IsActive,
                TenantId = setting.TenantId,
                IsVoided = setting.IsVoided,
                CreatedBy = setting.CreatedBy,
                CreatedDate = setting.CreatedDate,
                LastModifiedBy = setting.LastModifiedBy,
                LastModifiedDate = setting.LastModifiedDate
            };

            return response;
        }
    }
}
