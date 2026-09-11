using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain;
using OOH.Domain.Entities.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Distributors.Commands.CreateDistributor
{
    public class CreateDistributorCommandHandler : IRequestHandler<CreateDistributorCommand, CreateDistributorCommandResponse>
    {
        private readonly IDistributorRepository _distributorRepository;
        private readonly IMapper _mapper;

        public CreateDistributorCommandHandler(IMapper mapper, IDistributorRepository distributorRepository)
        {
            _mapper = mapper;
            _distributorRepository = distributorRepository;
        }

        public async Task<CreateDistributorCommandResponse> Handle(CreateDistributorCommand request, CancellationToken cancellationToken)
        {
            var response = new CreateDistributorCommandResponse();
            var validator = new CreateDistributorCommandValidator(_distributorRepository);
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
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.Distributor, DateTime.Now, Guid.NewGuid().ToString());
                Distributor entity = _mapper.Map<Distributor>(request);
                entity.DistributorId = entityKeyColumnValue;

                int i = await _distributorRepository.AddAsync(entity);

                if (i == -1)
                {
                    response.Success = false;
                }
                else
                {
                    response.Data = _mapper.Map<CreateDistributorDto>(entity);
                }
            }

            return response;
        }
    }
}
