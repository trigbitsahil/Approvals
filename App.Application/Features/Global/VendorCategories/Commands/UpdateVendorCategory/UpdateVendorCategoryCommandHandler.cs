using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Exceptions;
using OOH.Domain.Entities.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.VendorCategories.Commands.UpdateVendorCategory
{
    public class UpdateVendorCategoryCommandHandler : IRequestHandler<UpdateVendorCategoryCommand, UpdateVendorCategoryCommandResponse>
    {
        private readonly IVendorCategoryRepository _vendorCategoryRepository;
        private readonly IMapper _mapper;
        private readonly ILoggedInUserService _loggedInUserService;

        public UpdateVendorCategoryCommandHandler(IMapper mapper, IVendorCategoryRepository vendorCategoryRepository, ILoggedInUserService loggedInUserService)
        {
            _mapper = mapper;
            _vendorCategoryRepository = vendorCategoryRepository;
            _loggedInUserService = loggedInUserService;
        }

        public async Task<UpdateVendorCategoryCommandResponse> Handle(UpdateVendorCategoryCommand request, CancellationToken cancellationToken)
        {
            var updateVendorCategoryCommandResponse = new UpdateVendorCategoryCommandResponse();
            var validator = new UpdateVendorCategoryCommandValidator();
            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {
                updateVendorCategoryCommandResponse.Success = false;
                updateVendorCategoryCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    updateVendorCategoryCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }
            }

            if (updateVendorCategoryCommandResponse.Success)
            {
                var vendorCategoryToUpdate = await _vendorCategoryRepository.GetByIdAsync(request.VendorCategoryId);
                if (vendorCategoryToUpdate == null)
                {
                    throw new NotFoundException(nameof(VendorCategory), request.VendorCategoryId);
                }

                _mapper.Map(request, vendorCategoryToUpdate, typeof(UpdateVendorCategoryCommand), typeof(VendorCategory));
                vendorCategoryToUpdate.LastModifiedBy = _loggedInUserService.UserEmail;
                vendorCategoryToUpdate.LastModifiedDate = DateTime.UtcNow;

                await _vendorCategoryRepository.UpdateAsync(vendorCategoryToUpdate);
            }

            return updateVendorCategoryCommandResponse;
        }
    }
}
