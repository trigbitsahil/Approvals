using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Vendors.Commands.UpdateVendor
{
    public class UpdateVendorCommandHandler : IRequestHandler<UpdateVendorCommand, UpdateVendorCommandResponse>
    {
        private readonly IVendorRepository _VendorRepository;

        private readonly IMapper _mapper;

        //   private readonly IEmailService _emailService;

        public UpdateVendorCommandHandler(IMapper mapper, IVendorRepository VendorRepository)
        {
            _mapper = mapper;
            _VendorRepository = VendorRepository;
            // _emailService = emailService;
        }




        public async Task<UpdateVendorCommandResponse> Handle(UpdateVendorCommand request, CancellationToken cancellationToken)
        {

            var recordToUpdate = await _VendorRepository.GetByIdAsync(request.VendorID);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(Vendor), request.VendorID);
            }



            var updateVendorCommandResponse = new UpdateVendorCommandResponse();

            var validator = new UpdateVendorCommandValidator(_VendorRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                // throw new Exceptions.ValidationException(validationResult);
                updateVendorCommandResponse.Success = false;
                updateVendorCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateVendorCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (updateVendorCommandResponse.Success)
            {

                _mapper.Map(request, recordToUpdate, typeof(UpdateVendorCommand), typeof(Vendor));

           
                // await _eventRepository.UpdateAsync(eventToUpdate);


                int i = await _VendorRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    updateVendorCommandResponse.Success = false;

                    // createGovtBodyCommandResponse.GovtBody = new CreateGovtBodyDto();
                }
                else
                {
                    updateVendorCommandResponse.Data = _mapper.Map<UpdateVendorDto>(recordToUpdate);

                }

            }


            return updateVendorCommandResponse;



        }

    }
}
