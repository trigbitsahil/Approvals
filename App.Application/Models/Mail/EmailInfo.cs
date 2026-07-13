using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OOH.Application.Models.Mail
{
    public class EmailInfo
    {

        public EmailInfo(String emailBody, String toMail, String toBCC, String subject, String fromMail, List<String> filesToSend, String toCC = null, string replyTo = null, string senderFullName =null)
        {
            ToMail = toMail;
            ToBCC = toBCC;
            Subject = subject;
            FilesToSend = filesToSend;
            FromMail = fromMail;
            SenderFullName= senderFullName;
            ReplyTo = replyTo;
            ToCC = toCC;
            EmailBody = emailBody;  
        }

        #region Fields

        /// <summary>
        /// Email Body
        /// </summary>
        public String EmailBody
        {
            get;
            private set;
        }

        /// <summary>
        /// From address.
        /// </summary>
        public String FromMail
        {
            get;
            private set;
        }



        /// <summary>
        /// To address.
        /// </summary>
        public String ToMail
        {
            get;
            private set;
        }

        /// <summary>
        /// To address cc.
        /// </summary>
        public String ToBCC
        {
            get;
            private set;
        }

        /// <summary>
        /// Subject mail.
        /// </summary>
        public String Subject
        {
            get;
            private set;
        }

        /// <summary>
        /// Path for mail template.
        /// </summary>
        //public String PathForMailTemplait
        //{
        //    get;
        //    private set;
        //}

        public List<String> FilesToSend
        {
            get;
            private set;
        }
        public string CC
        {
            get;
            private set;
        }

        public string ReplyTo
        {
            get;
            private set;
        }
        public string SenderFullName
        {
            get;
            private set;
        }

        /// <summary>
        /// To address cc.
        /// </summary>
        public String ToCC
        {
            get;
            private set;
        }
        #endregion Fields
    }
}