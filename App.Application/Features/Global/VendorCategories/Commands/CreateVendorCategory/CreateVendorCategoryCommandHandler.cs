using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Domain;
using OOH.Domain.Entities.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.VendorCategories.Commands.CreateVendorCategory
{
    public class CreateVendorCategoryCommandHandler : IRequestHandler<CreateVendorCategoryCommand, CreateVendorCategoryCommandResponse>
    {
        private readonly IVendorCategoryRepository _vendorCategoryRepository;
        private readonly IMapper _mapper;
        private readonly ILoggedInUserService _loggedInUserService;

        public CreateVendorCategoryCommandHandler(IMapper mapper, IVendorCategoryRepository vendorCategoryRepository, ILoggedInUserService loggedInUserService)
        {
            _mapper = mapper;
            _vendorCategoryRepository = vendorCategoryRepository;
            _loggedInUserService = loggedInUserService;
        }

        public async Task<CreateVendorCategoryCommandResponse> Handle(CreateVendorCategoryCommand request, CancellationToken cancellationToken)
        {
            var createVendorCategoryCommandResponse = new CreateVendorCategoryCommandResponse();
            var validator = new CreateVendorCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                createVendorCategoryCommandResponse.Success = false;
                createVendorCategoryCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createVendorCategoryCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }
            }

            if (createVendorCategoryCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.VendorCategory, DateTime.Now, System.Guid.NewGuid().ToString());
                VendorCategory entity = _mapper.Map<VendorCategory>(request);

                entity.VendorCategoryId = entityKeyColumnValue;
                entity.CreatedBy = _loggedInUserService.UserEmail;
                entity.CreatedDate = DateTime.UtcNow;
                entity.IsVoided = false;

                int i = await _vendorCategoryRepository.AddAsync(entity);

                if (i == -1)
                {
                    createVendorCategoryCommandResponse.Success = false;
                }
                else
                {
                    createVendorCategoryCommandResponse.Data = _mapper.Map<CreateVendorCategoryDto>(entity);
                }
            }

            return createVendorCategoryCommandResponse;
        }
    }
}
