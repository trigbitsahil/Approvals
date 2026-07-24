using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Domain
{

    public class EntityPrefixes
    {


        #region Tenders

        public static string City = "City";
        public static string GovtBody = "GvtBd";

        public static string DocumentType = "DocType";
        public static string DocUrl = "DocUrl";
        public static string DocUrlText = "DocUrlTxt";

        public static string Media = "Med";
        public static string MediaType = "MedType";
        public static string MediaTypeCategory = "MedTypeCat";

        public static string Proposal = "Prop";
        public static string ProposalStatus = "PropStatus";
        public static string ProposalType = "PropType";

        public static string ProposalMedia = "PropMed";
        public static string ProposalMediaUnit = "PropMedUnt";

        public static string Noc = "Noc";
        public static string NocType = "NocType";


        public static string MediaCategory = "MedCat";



        public static string Contact = "Cntct";

        public static string CompetitorBid = "ComptrBid";

        public static string Competitor = "Comptr";


        public static string EAuction = "EAuct";

        public static string Tender = "Tndr";

        public static string EAuctionStatus = "EAuctStatus";

        public static string EAuctionMediaUnit = "EAuctMedUnt";

        public static string EAuctionMedia = "EAuctMed";

        public static string TenderStatus = "TndrStatus";

        public static string TenderMedia = "TndrMed";

        public static string TenderMediaUnit = "TndrMedUnt";

        public static string Contract = "Contrct";

        public static string ContractMedia = "ContrctMed";

        public static string ContractMediaUnit = "ContrctMedUnt";

        public static string ContractStatus = "ContrctStatus";


        public static string Stability = "Stblty";

        public static string StabilityType = "StbltyType";

        public static string Note = "Note";

        public static string Letter = "Lttr";

        public static string LetterType = "LttrType";

        public static string Insurance = "Insrnc";

        public static string InsuranceType = "InsrncType";

        public static string Expense = "Expns";

        public static string ExpenseType = "ExpenseType";

        public static string ExpenseTransaction = "ExpnsTrans";

        public static string ObstructionTenure = "ObstrcTenr";

        public static string Vendor = "Vndr";
        public static string VendorCategory = "VndCat";

        public static string ShareLink = "ShrLnk";

        public static string TagIntermediate = "TagIntrmdt";



        public static string Tag = "Tag";

        public static string Email = "Email";

        public static string LetterTemplateType = "LttrTmpltType";

        public static string LetterTemplate = "LttrTmplt";

        public static string LetterDraft = "LttrDrft";

        public static string TechnicalBid = "TechnclBid";

        public static string FinancialBid = "FinclBid";

        public static string LegalDocument = "LegalDoc";

        public static string Milestone = "Milstn";

        public static string OtherDocument = "OthrDoc";

        public static string Sop = "Sop";

        public static string OfficeNote = "OfcNote";

        public static string LetterSignature = "LttrSign";


        public static string ExpenseCategory = "ExpnsCat";

        public static string Income = "Incm";

        public static string IncomeType = "IncomeType";

        public static string IncomeCategory = "IncmCat";

        public static string IncomeTransaction = "IncmTrans";


        



        #endregion


        #region Global

        public static string Approval = "Apprvl";

        public static string ApprovalType = "ApprvlType";

        public static string ApprovalStatus = "ApprvlStatus";

        public static string ApprovalApprover = "ApprvlApprvr";

        public static string DepartmentUser = "DepUser";

        public static string Department = "Dep";

        public static string User = "User";

        public static string Company = "Cmpny";

        public static string CompanySite = "CmpnySite";

        public static string Ticket = "Tckt";
        public static string TicketType = "TcktType";
        public static string TicketStatus = "TcktStatus";
        public static string TicketPriority = "TcktPrity";
        public static string TicketComment = "TicketCmnt";
        public static string FollowUp = "FollowUp";

        public static string CompanyCalendarWorkingDay = "CompnyCalWorkDay";
        public static string CompanyCalendarSpecialWorkday = "CompnyCalSpecDay";
        public static string CompanyCalendarHoliday = "CompnyCalHolDay";
        public static string CompanyCalendar = "CompnyCal";

        public static string TicketContractMediaUnit = "TcktContrctMedUnt";

        public static string ApprovalComment = "ApprvlCmnt";

        public static string Notification = "Notif";

        public static string Customer = "Cust";

        public static string Employee = "Emp";

        public static string Link = "link";

        public static string Project = "Prjct";

        public static string Reminder = "Rmndr";

        public static string ReminderException = "RmndrExcptn";

        public static string ReminderNotificationSetting = "RmndrNotficSet";

        public static string ReminderRecurrenceRule = "RmndrRecRule";

        public static string Task = "Task";

        public static string TaskType = "TaskType";

        public static string TaskStatus = "TaskStatus";
 
        public static string Team = "Team";

        public static string TeamMember = "TeamMember";

        public static string TimeZone = "TimeZone";

        public static string TimeZoneCountry = "TimeZoneCountry";

        public static string WorkFlow = "WorkFlow";

        public static string WorkFlowRow = "WorkFlowRow";

        public static string EmailType = "EmailType";

        public static string EmailTemplateCategory = "EmailTempCat";

        public static string EmailTemplate = "EmailTemplate";

        public static string EmailLogDetail = "EmailLogDetail";

        public static string TaskTimeLog = "TaskTimeLog";

        public static string TaskRecurrenceTransaction = "TaskRecurrenceTransaction";

        public static string TaskRecurrenceRule = "TaskRecurrenceRule";

        public static string TaskRecurrenceException = "TaskRecurrenceException";

        public static string ProjectStatus = "PrjctStatus";

        public static string Budget = "Bdgt";

        public static string BudgetType = "BdgtType";

        public static string OrderUser = "OdrUsr";

        public static string InventoryItem = "InvItem";

        public static string OrderHeader = "OdrHdr";

        public static string OrderLine = "OdrLine";

        public static string OrderType = "OdrType";

        public static string Warehouse = "War";

        public static string WarehouseLocation = "WarLoc";

        public static string WarehouseTransaction = "WarTrans";

        public static string WarehouseUser = "WarUsr";

        public static string InventoryItemType = "InvItemType";

        public static string FolderIntermediate = "FldrIntrmdt";
        
        public static string Folder = "Fldr";

        public static string TaskPriority = "TaskPrity";

        public static string Event = "Evnt";

        public static string EventUser = "EvntUsr";

        public static string EventType = "EvntType";
        
        public static string RecurrenceException = "RcrExcptn";

        public static string RecurrenceRule = "RcrRule";

        public static string RecurrenceTransaction = "RcrTransac";

        public static string UserIntermediate = "UsrIntrmdt";

        public static string FormData = "FrmData";

        public static string FormSubmission = "FrmSub";

        public static string ApprovalMedia = "ApprlMedia";

        public static string ExpenseTransactionMedia = "ExpTransMedia";

        public static string CustomerQuoteLine = "CustQteLine";

        public static string CustomerQuote = "CustQte";

        public static string CustomerShippingAddress = "CustShipAddr";

        public static string Address = "Adrs";

        public static string BillingItem = "BillItm";

        public static string Invoice = "Invc";

        public static string InvoiceLine = "InvcLine";
        public static string Survey = "Srvy";



        #endregion

    }


    public class EntityColumn
    {

        public static string KeyFormat = "{0}_{1:yyyy_MM_dd}{2}";

        public static string ProposalNumFormat = "P/{0}/{1}";
        public static string TenderNumFormat = "T/{0}/{1}";
        public static string EAuctionNumFormat = "E/{0}/{1}";
        public static string ContractNumFormat = "C/{0}/{1}";

        public static string LetterNumFormat = "{0}/{1}/{2}";

        public static string TicketNumFormat = "{0}-{1}";



    }



}


