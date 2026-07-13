using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Features.Tenders.Vendors.Commands.DeleteVendor
{
    public class DeleteVendorCommandHandler :
       IRequestHandler<DeleteVendorCommand, DeleteVendorCommandResponse>
    {
        private readonly IVendorRepository _VendorRepository;


        private readonly IMapper _mapper;
        public DeleteVendorCommandHandler(IMapper mapper, IVendorRepository VendorRepository)
        {
            _mapper = mapper;
            _VendorRepository = VendorRepository;
        }



        public async Task<DeleteVendorCommandResponse> Handle(DeleteVendorCommand request, CancellationToken cancellationToken)
        {

            DeleteVendorCommandResponse deleteVendorCommandResponse = new DeleteVendorCommandResponse();

            var validator = new DeleteVendorCommandValidator(_VendorRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                deleteVendorCommandResponse.Success = false;
                deleteVendorCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    deleteVendorCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }

            if (deleteVendorCommandResponse.Success)
            {

                Vendor entity = await _VendorRepository.GetByIdAsync(request.VendorID);

                int result;


                if (entity == null)
                {
                    deleteVendorCommandResponse.Success = false;

                    deleteVendorCommandResponse.Message = "Unable to delete the record, Record Does not exist";


                }
                else
                {
                    // result =await _govtBodyRepository.DeleteAsync(entity);
                    result = await _VendorRepository.VoidAsync(entity);


                    if (result == -1)
                    {
                        deleteVendorCommandResponse.Success = false;

                        deleteVendorCommandResponse.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        deleteVendorCommandResponse.Data = "Record Deleted";

                    }


                }

            }


            return deleteVendorCommandResponse;



        }


    }
}
