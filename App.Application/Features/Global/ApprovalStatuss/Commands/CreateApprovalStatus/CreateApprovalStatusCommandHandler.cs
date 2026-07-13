using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalStatuss.Commands.CreateApprovalStatus
{
    public class CreateApprovalStatusCommandHandler : IRequestHandler<CreateApprovalStatusCommand, CreateApprovalStatusCommandResponse>
    {
        private readonly IApprovalStatusRepository _ApprovalStatusRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateApprovalStatusCommandHandler(IMapper mapper, IApprovalStatusRepository ApprovalStatusRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _ApprovalStatusRepository = ApprovalStatusRepository;
            _emailService = emailService;
        }




        public async Task<CreateApprovalStatusCommandResponse> Handle(CreateApprovalStatusCommand request, CancellationToken cancellationToken)
        {

            var createApprovalStatusCommandResponse = new CreateApprovalStatusCommandResponse();

            var validator = new CreateApprovalStatusCommandValidator(_ApprovalStatusRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createApprovalStatusCommandResponse.Success = false;
                createApprovalStatusCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createApprovalStatusCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createApprovalStatusCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.ApprovalStatus, DateTime.Now, System.Guid.NewGuid().ToString());




                ApprovalStatus entity = _mapper.Map<ApprovalStatus>(request);


                entity.ApprovalStatusId = entityKeyColumnValue;
 


                int i = await _ApprovalStatusRepository.AddAsync(entity);

                if (i == -1)
                {
                    createApprovalStatusCommandResponse.Success = false;

                }
                else
                {
                    createApprovalStatusCommandResponse.Data = _mapper.Map<CreateApprovalStatusDto>(entity);

                }

            }


            return createApprovalStatusCommandResponse;



        }


    }
}
