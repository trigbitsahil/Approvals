using FluentValidation;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlDetail
{
    public class GetDocumentUrlDetailQueryValidator : AbstractValidator<GetDocumentUrlDetailQuery>
    {
        private readonly IDocumentUrlRepository _documentUrlRepository;

        public GetDocumentUrlDetailQueryValidator(IDocumentUrlRepository documentUrlRepository)
        {
            _documentUrlRepository = documentUrlRepository;

            RuleFor(r => r.DocumentUrlId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .NotNull()
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
        }
    }
}
