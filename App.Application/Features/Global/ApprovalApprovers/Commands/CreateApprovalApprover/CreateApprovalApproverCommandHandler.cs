using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalApprovers.Commands.CreateApprovalApprover
{
    public class CreateApprovalApproverCommandHandler : IRequestHandler<CreateApprovalApproverCommand, CreateApprovalApproverCommandResponse>
    {
        private readonly IApprovalApproverRepository _ApprovalApproverRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateApprovalApproverCommandHandler(IMapper mapper, IApprovalApproverRepository ApprovalApproverRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _ApprovalApproverRepository = ApprovalApproverRepository;
            _emailService = emailService;
        }




        public async Task<CreateApprovalApproverCommandResponse> Handle(CreateApprovalApproverCommand request, CancellationToken cancellationToken)
        {

            var createApprovalApproverCommandResponse = new CreateApprovalApproverCommandResponse();

            var validator = new CreateApprovalApproverCommandValidator(_ApprovalApproverRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createApprovalApproverCommandResponse.Success = false;
                createApprovalApproverCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createApprovalApproverCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createApprovalApproverCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.ApprovalApprover, DateTime.Now, System.Guid.NewGuid().ToString());




                ApprovalApprover entity = _mapper.Map<ApprovalApprover>(request);


                entity.ApprovalApproverId = entityKeyColumnValue;
 


                int i = await _ApprovalApproverRepository.AddAsync(entity);

                if (i == -1)
                {
                    createApprovalApproverCommandResponse.Success = false;

                }
                else
                {
                    createApprovalApproverCommandResponse.Data = _mapper.Map<CreateApprovalApproverDto>(entity);

                }

            }


            return createApprovalApproverCommandResponse;



        }


    }
}
