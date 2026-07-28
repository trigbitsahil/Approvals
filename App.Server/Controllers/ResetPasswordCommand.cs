namespace OOH.API.Controllers
{
    public class ResetPasswordCommand
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string Password { get; set; }
    }
}
