namespace OOH.API.Services
{
    public class CloudMailService : IMailService
    {
        private string _emailTo = "";
        private string _emailFrom = "";


        public CloudMailService(IConfiguration configuration)
        {

            _emailTo = configuration["MailSettings:mailToAddress"];
            _emailFrom = configuration["MailSettings:mailFromAddress"];

        }

        public void Send(string subject, string message)
        {

            Console.WriteLine("CloudMailService-------Email Sending");

        }


    }
}
