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

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.CreateApprovalRetentionSetting
{
    public class CreateApprovalRetentionSettingCommandHandler : IRequestHandler<CreateApprovalRetentionSettingCommand, CreateApprovalRetentionSettingCommandResponse>
    {
        private readonly IApprovalRetentionSettingRepository _repository;
        private readonly ILoggedInUserService _loggedInUserService;

        public CreateApprovalRetentionSettingCommandHandler(
            IApprovalRetentionSettingRepository repository,
            ILoggedInUserService loggedInUserService)
        {
            _repository = repository;
            _loggedInUserService = loggedInUserService;
        }

        public async Task<CreateApprovalRetentionSettingCommandResponse> Handle(CreateApprovalRetentionSettingCommand request, CancellationToken cancellationToken)
        {
            var response = new CreateApprovalRetentionSettingCommandResponse();
            var validator = new CreateApprovalRetentionSettingCommandValidator();
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

            string entityKeyColumnValue = string.Format(EntityColumn.KeyFormat, EntityPrefixes.ApprovalRetentionSetting, DateTime.Now, Guid.NewGuid().ToString());

            var setting = new ApprovalRetentionSetting
            {
                SettingId = entityKeyColumnValue,
                RetentionDays = request.RetentionDays,
                IsActive = request.IsActive,
                TenantId = _loggedInUserService.TenantId,
                IsVoided = false,
                CreatedBy = _loggedInUserService.UserEmail,
                CreatedDate = DateTime.UtcNow
            };

            await _repository.AddAsync(setting);

            response.Success = true;
            response.Message = $"Retention setting created successfully with {setting.RetentionDays} days.";
            response.Data = new CreateApprovalRetentionSettingDto
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
