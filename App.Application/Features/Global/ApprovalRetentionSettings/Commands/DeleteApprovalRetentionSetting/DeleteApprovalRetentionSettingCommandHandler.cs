using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalRetentionSettings.Commands.DeleteApprovalRetentionSetting
{
    public class DeleteApprovalRetentionSettingCommandHandler : IRequestHandler<DeleteApprovalRetentionSettingCommand, DeleteApprovalRetentionSettingCommandResponse>
    {
        private readonly IApprovalRetentionSettingRepository _repository;

        public DeleteApprovalRetentionSettingCommandHandler(IApprovalRetentionSettingRepository repository)
        {
            _repository = repository;
        }

        public async Task<DeleteApprovalRetentionSettingCommandResponse> Handle(DeleteApprovalRetentionSettingCommand request, CancellationToken cancellationToken)
        {
            var response = new DeleteApprovalRetentionSettingCommandResponse();
            var validator = new DeleteApprovalRetentionSettingCommandValidator();
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

            var entity = await _repository.GetByIdAsync(request.SettingId);
            if (entity == null)
            {
                response.Success = false;
                response.Message = "Record does not exist.";
                return response;
            }

            int result = await _repository.VoidAsync(entity);
            if (result == -1)
            {
                response.Success = false;
                response.Message = "Unable to delete record, unknown error.";
            }
            else
            {
                response.Success = true;
                response.Message = "Retention setting deleted successfully.";
            }

            return response;
        }
    }
}
