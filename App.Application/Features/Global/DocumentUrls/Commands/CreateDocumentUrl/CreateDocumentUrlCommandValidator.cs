using FluentValidation;

namespace OOH.Application.Features.Global.DocumentUrls.Commands.CreateDocumentUrl
{
    public class CreateDocumentUrlCommandValidator : AbstractValidator<CreateDocumentUrlCommand>
    {
        public CreateDocumentUrlCommandValidator()
        {
            RuleFor(r => r.Name)
                .NotEmpty().WithMessage("{PropertyName} is required");

            RuleFor(r => r.Content)
                .NotEmpty().WithMessage("{PropertyName} is required");

            RuleFor(r => r.Category)
                .NotEmpty().WithMessage("{PropertyName} is required");

            RuleFor(r => r.CategoryID)
                .NotEmpty().WithMessage("{PropertyName} is required");

            RuleFor(r => r.Extension)
                .NotEmpty().WithMessage("{PropertyName} is required");

            RuleFor(r => r.ContentType)
                .NotEmpty().WithMessage("{PropertyName} is required");

            RuleFor(r => r.DocumentFileName)
                .NotEmpty().WithMessage("{PropertyName} is required");
        }
    }
}
