namespace OOH.Application.Features.Global.DocumentUrls.Commands.CreateDocumentUrl
{
    public class CreateDocumentUrlCommandResponse
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }
    }
}
