using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Distributors.Commands.UpdateDistributor
{
    public class UpdateDistributorCommandHandler : IRequestHandler<UpdateDistributorCommand, UpdateDistributorCommandResponse>
    {
        private readonly IDistributorRepository _distributorRepository;
        private readonly IMapper _mapper;

        public UpdateDistributorCommandHandler(IMapper mapper, IDistributorRepository distributorRepository)
        {
            _mapper = mapper;
            _distributorRepository = distributorRepository;
        }

        public async Task<UpdateDistributorCommandResponse> Handle(UpdateDistributorCommand request, CancellationToken cancellationToken)
        {
            var recordToUpdate = await _distributorRepository.GetByIdAsync(request.DistributorId);

            if (recordToUpdate == null)
            {
                throw new NotFoundException(nameof(Distributor), request.DistributorId);
            }

            var response = new UpdateDistributorCommandResponse();
            var validator = new UpdateDistributorCommandValidator(_distributorRepository);
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
                _mapper.Map(request, recordToUpdate, typeof(UpdateDistributorCommand), typeof(Distributor));
                recordToUpdate.LastModifiedDate = DateTime.Now;
                int i = await _distributorRepository.UpdateAsync(recordToUpdate);

                if (i == -1)
                {
                    response.Success = false;
                }
                else
                {
                    response.Data = _mapper.Map<UpdateDistributorDto>(recordToUpdate);
                }
            }

            return response;
        }
    }
}
