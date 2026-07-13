using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Vendors.Commands.CreateVendor
{
    public class CreateVendorCommandHandler : IRequestHandler<CreateVendorCommand, CreateVendorCommandResponse>
    {
        private readonly IVendorRepository _VendorRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        public CreateVendorCommandHandler(IMapper mapper, IVendorRepository VendorRepository, IEmailService emailService)
        {
            _mapper = mapper;
            _VendorRepository = VendorRepository;
            _emailService = emailService;
        }




        public async Task<CreateVendorCommandResponse> Handle(CreateVendorCommand request, CancellationToken cancellationToken)
        {

            var createVendorCommandResponse = new CreateVendorCommandResponse();

            var validator = new CreateVendorCommandValidator(_VendorRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createVendorCommandResponse.Success = false;
                createVendorCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createVendorCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createVendorCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.Vendor, DateTime.Now, System.Guid.NewGuid().ToString());




                Vendor entity = _mapper.Map<Vendor>(request);


                entity.VendorId = entityKeyColumnValue;
 


                int i = await _VendorRepository.AddAsync(entity);

                if (i == -1)
                {
                    createVendorCommandResponse.Success = false;

                }
                else
                {
                    createVendorCommandResponse.Data = _mapper.Map<CreateVendorDto>(entity);

                }

            }


            return createVendorCommandResponse;



        }


    }
}
