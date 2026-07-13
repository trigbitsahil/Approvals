using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalTypes.Commands.CreateApprovalType
{
    public class CreateApprovalTypeCommandHandler : IRequestHandler<CreateApprovalTypeCommand, CreateApprovalTypeCommandResponse>
    {
        private readonly IApprovalTypeRepository _ApprovalTypeRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateApprovalTypeCommandHandler(IMapper mapper, IApprovalTypeRepository ApprovalTypeRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _ApprovalTypeRepository = ApprovalTypeRepository;
            _emailService = emailService;
        }




        public async Task<CreateApprovalTypeCommandResponse> Handle(CreateApprovalTypeCommand request, CancellationToken cancellationToken)
        {

            var createApprovalTypeCommandResponse = new CreateApprovalTypeCommandResponse();

            var validator = new CreateApprovalTypeCommandValidator(_ApprovalTypeRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createApprovalTypeCommandResponse.Success = false;
                createApprovalTypeCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createApprovalTypeCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createApprovalTypeCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.ApprovalType, DateTime.Now, System.Guid.NewGuid().ToString());




                ApprovalType entity = _mapper.Map<ApprovalType>(request);


                entity.ApprovalTypeId = entityKeyColumnValue;
 


                int i = await _ApprovalTypeRepository.AddAsync(entity);

                if (i == -1)
                {
                    createApprovalTypeCommandResponse.Success = false;

                }
                else
                {
                    createApprovalTypeCommandResponse.Data = _mapper.Map<CreateApprovalTypeDto>(entity);

                }

            }


            return createApprovalTypeCommandResponse;



        }


    }
}
