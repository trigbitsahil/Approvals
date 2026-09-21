using FluentValidation;
using OOH.Application.Contracts.Persistence.Global;

namespace OOH.Application.Features.Global.DocumentUrls.Queries.GetDocumentUrlList
{
    public class GetDocumentUrlListQueryValidator : AbstractValidator<GetDocumentUrlListQuery>
    {
        private readonly IDocumentUrlRepository _documentUrlRepository;

        public GetDocumentUrlListQueryValidator(IDocumentUrlRepository documentUrlRepository)
        {
            _documentUrlRepository = documentUrlRepository;

            RuleFor(r => r.Category)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .NotNull()
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");

            RuleFor(r => r.CategoryId)
                .NotEmpty()
                .WithMessage("{PropertyName} is required.")
                .NotNull()
                .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters.");
        }
    }
}
