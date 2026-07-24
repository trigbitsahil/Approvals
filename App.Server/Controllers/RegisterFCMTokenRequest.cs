namespace OOH.API.Controllers
{
    public class RegisterFCMTokenRequest
    {
        public string Token { get; set; }
        public string? DeviceDetails { get; set; }
    }
}
