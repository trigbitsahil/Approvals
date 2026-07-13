using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Models.Mail;
using PostmarkDotNet.Model;
using PostmarkDotNet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using MediatR;
using System.Dynamic;
using Newtonsoft.Json;

namespace OOH.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        public EmailSettings _emailSettings { get; }


        public EmailService(IOptions<EmailSettings> mailSettings)
        {
            _emailSettings = mailSettings.Value;

        }
        //private bool Send(EmailInfo mailInfo )
        //{
        //    try
        //    {
        //        string companyName = string.Empty;
        //        //if (isThreadRequest)
        //        //{
        //        //    companyName = firmName;
        //        //}
        //        //else
        //        //    companyName = _httpContextAccessor.HttpContext.Session.GetString("CompanyName");// HttpContext.Session.GetString("CompanyName");

        //        //companyName = !string.IsNullOrEmpty(companyName) ? Regex.Replace(companyName, @"[^0-9a-zA-Z]+", " ") : "";

        //        companyName = "OOH";

        //        IDictionary<string, string> Headers = new Dictionary<string, string>();
        //        IDictionary<string, string> MetaData = new Dictionary<string, string>();
        //        Headers.Add("X-CUSTOM-HEADER", "Header content");
        //        string fromName = _emailSettings.FromName;// configuration.GetValue<string>("FromName");
        //        MetaData.Add("C_Key", fromName);

        //        //if (_httpContextAccessor.HttpContext.Request == null)
        //        //{
        //          MetaData.Add("C_User", "-");

        //        //}
        //        //else
        //        //{
        //            //if (!isThreadRequest)
        //            //    MetaData.Add("C_User", _emailSettings.FromAddress);

        //          ///  MetaData.Add("C_User", _httpContextAccessor.HttpContext.User.Identity.Name);

        //        //}


        //        var postmarkMessage = new PostmarkMessage()
        //        {


        //            To = mailInfo.ToMail,

        //            //From = mailInfo.FromMail,
        //            //From = configuration.GetValue<string>("FromName").ToString() + "<" + mailInfo.FromMail + ">",
        //            From = "dev@wallop.in", //!string.IsNullOrEmpty(companyName) ? companyName  : fromName + "<" + mailInfo.FromMail + ">",
        //            TrackLinks = LinkTrackingOptions.HtmlAndText,
        //            TrackOpens = true,
        //            Subject = mailInfo.Subject,
        //            TextBody = !string.IsNullOrEmpty(mailInfo.EmailBody) ? mailInfo.EmailBody : " ",
        //            HtmlBody = !string.IsNullOrEmpty(mailInfo.EmailBody) ? mailInfo.EmailBody : " ",
        //            MessageStream = "outbound",
        //            Tag = mailInfo.Subject,
        //            Headers = new HeaderCollection(Headers),
        //            Metadata = MetaData,

        //            ReplyTo = string.IsNullOrEmpty(mailInfo.ReplyTo) ? mailInfo.FromMail : mailInfo.ReplyTo
        //        };
        //        if (!String.IsNullOrEmpty(mailInfo.ToBCC))
        //        {
        //            postmarkMessage.Bcc = mailInfo.ToBCC;
        //        }
        //        if (!String.IsNullOrEmpty(mailInfo.ToCC))
        //        {
        //            postmarkMessage.Cc = mailInfo.ToCC;
        //        }
        //        if (mailInfo.FilesToSend != null)
        //        {
        //            foreach (string file in mailInfo.FilesToSend)
        //            {
        //                string FileName = file;
        //                byte[] FileContent = null;
        //                if (file.StartsWith("http"))
        //                {
        //                    var webClient = new WebClient();
        //                    FileContent = webClient.DownloadData(file);
        //                    FileName = file.Substring(file.LastIndexOf("/") + 1, file.Length - file.LastIndexOf("/") - 1);
        //                }
        //                else
        //                {
        //                    FileName = file.Substring(file.LastIndexOf("\\") + 1, file.Length - file.LastIndexOf("\\") - 1);
        //                    FileContent = File.ReadAllBytes(file);
        //                }
        //                // string MIMEType = MimeMapping.GetMimeMapping(FileName);
        //                string filestring = Convert.ToBase64String(FileContent);
        //                string ContentId = "cid:" + FileName;
        //                postmarkMessage.AddAttachment(FileContent, FileName, contentId: ContentId);
        //            }
        //        }
        //        //string apiKey = ConfigurationManager.AppSettings["PostMarkAPIKey"].ToString();
        //        string apiKey = _emailSettings.ApiKey;

        //        var jsonData = JsonConvert.SerializeObject(postmarkMessage);
        //        var request = (HttpWebRequest)WebRequest.Create("https://api.postmarkapp.com/email");
        //        var data = Encoding.ASCII.GetBytes(jsonData);
        //        request.Method = "POST";
        //        request.ContentType = "application/json";
        //        request.ContentLength = data.Length;
        //        request.Headers.Add("X-Postmark-Server-Token", apiKey);
        //        request.Accept = "application/json";
        //        using (var stream = request.GetRequestStream())
        //        {
        //            stream.Write(data, 0, data.Length);
        //        }
        //        var response = (System.Net.HttpWebResponse)request.GetResponse();
        //        var responseStringGlobal = new StreamReader(response.GetResponseStream()).ReadToEnd();
        //        var postmarkResponse = JsonConvert.DeserializeObject<PostmarkResponse>(responseStringGlobal);
        //        var guid = postmarkResponse.MessageID;
        //        return true;
        //    }

        //    catch (Exception ex)
        //    {
        //        return false;
        //    }
        //}



        private async Task<bool> Send(EmailInfo mailInfo)
        {

            IDictionary<string, string> Headers = new Dictionary<string, string>();
            IDictionary<string, string> MetaData = new Dictionary<string, string>();
            Headers.Add("X-CUSTOM-HEADER", "Header content");
        
            // Send an email asynchronously:
            var message = new PostmarkMessage()
            {
                To = mailInfo.ToMail,
                From = _emailSettings.FromAddress,
                TrackOpens = true,
                Subject = mailInfo.Subject,
                TextBody = mailInfo.EmailBody,
                HtmlBody = mailInfo.EmailBody,
                MessageStream = "outbound",
                Tag = "Wallop Transactional",
                Headers = new HeaderCollection(Headers),
                Cc = mailInfo.ToCC
            };


            if (mailInfo.FilesToSend != null)
            {
                foreach (string file in mailInfo.FilesToSend)
                {
                    string FileName = file;
                    byte[] FileContent = null;
                    if (file.StartsWith("http"))
                    {
                        var webClient = new WebClient();
                        FileContent = webClient.DownloadData(file);
                        FileName = file.Substring(file.LastIndexOf("/") + 1, file.Length - file.LastIndexOf("/") - 1);
                    }
                    else
                    {
                        FileName = file.Substring(file.LastIndexOf("\\") + 1, file.Length - file.LastIndexOf("\\") - 1);
                        FileContent = File.ReadAllBytes(file);
                    }
                    // string MIMEType = MimeMapping.GetMimeMapping(FileName);
                    string filestring = Convert.ToBase64String(FileContent);
                    string ContentId = "cid:" + FileName;
                    message.AddAttachment(FileContent, FileName, contentId: ContentId);
                }
            }

            var client = new PostmarkClient(_emailSettings.ApiKey);

            var sendResult = await client.SendMessageAsync(message);

            if (sendResult.Status == PostmarkStatus.Success) { /* Handle success */


                return true;
            }
            else { /* Resolve issue.*/ 
            
                return false;

            }
        }
        public async Task<bool> SendEmail(EmailInfo email)
        {

            try
            {
                bool returnValue = false;

                //Call the Send function of this class
                returnValue = await this.Send(email);

                return returnValue;
            }
            catch (Exception ex)
            {
                return false;

            }

        }
    }
}
