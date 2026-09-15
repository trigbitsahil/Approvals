namespace OOH.Application.Features.Global.DocumentUrls.Commands.UpdateDocumentUrl
{
    public class UpdateDocumentUrlCommandResponse
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }
    }
}
