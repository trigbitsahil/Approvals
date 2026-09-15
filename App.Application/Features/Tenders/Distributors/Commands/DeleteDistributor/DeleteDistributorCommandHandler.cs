using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Distributors.Commands.DeleteDistributor
{
    public class DeleteDistributorCommandHandler : IRequestHandler<DeleteDistributorCommand, DeleteDistributorCommandResponse>
    {
        private readonly IDistributorRepository _distributorRepository;
        private readonly IMapper _mapper;

        public DeleteDistributorCommandHandler(IMapper mapper, IDistributorRepository distributorRepository)
        {
            _mapper = mapper;
            _distributorRepository = distributorRepository;
        }

        public async Task<DeleteDistributorCommandResponse> Handle(DeleteDistributorCommand request, CancellationToken cancellationToken)
        {
            DeleteDistributorCommandResponse response = new DeleteDistributorCommandResponse();
            var validator = new DeleteDistributorCommandValidator(_distributorRepository);
            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                response.Success = false;
                response.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    response.ValidationErrors.Add(error.ErrorMessage);
                }
            }

            if (response.Success)
            {
                Distributor entity = await _distributorRepository.GetByIdAsync(request.DistributorId);
                int result;

                if (entity == null)
                {
                    response.Success = false;
                    response.Message = "Unable to delete the record, Record Does not exist";
                }
                else
                {
                    result = await _distributorRepository.VoidAsync(entity);

                    if (result == -1)
                    {
                        response.Success = false;
                        response.Message = "Unable to delete the record, Unknown Error";
                    }
                    else
                    {
                        response.Data = "Record Deleted";
                    }
                }
            }

            return response;
        }
    }
}
