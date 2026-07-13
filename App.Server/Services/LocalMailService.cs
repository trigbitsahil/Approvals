namespace OOH.API.Services
{
    public class LocalMailService : IMailService
    {
        private string _emailTo = "";
        private string _emailFrom = "";


        public LocalMailService(IConfiguration configuration)
        {

            _emailTo = configuration["MailSettings:mailToAddress"];
            _emailFrom = configuration["MailSettings:mailFromAddress"];

        }

        public void Send(string subject, string message)
        {

            Console.WriteLine("LocalMailService-------Email Sending");

        }


    }
}
