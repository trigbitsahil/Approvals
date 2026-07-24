


using AutoMapper;
using OOH.Application.Features.Global.ApprovalApprovers.Commands.CreateApprovalApprover;
using OOH.Application.Features.Global.ApprovalApprovers.Commands.DeleteApprovalApprover;
using OOH.Application.Features.Global.ApprovalApprovers.Commands.UpdateApprovalApprover;
using OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverDetail;
using OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverList;
using OOH.Application.Features.Global.Approvals.Commands.CreateApproval;
using OOH.Application.Features.Global.Approvals.Commands.DeleteApproval;
using OOH.Application.Features.Global.Approvals.Commands.UpdateApproval;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalDetail;
using OOH.Application.Features.Global.Approvals.Queries.GetApprovalList;
using OOH.Application.Features.Global.ApprovalStatuss.Commands.CreateApprovalStatus;
using OOH.Application.Features.Global.ApprovalStatuss.Commands.DeleteApprovalStatus;
using OOH.Application.Features.Global.ApprovalStatuss.Commands.UpdateApprovalStatus;
using OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusDetail;
using OOH.Application.Features.Global.ApprovalStatuss.Queries.GetApprovalStatusList;
using OOH.Application.Features.Global.ApprovalTypes.Commands.CreateApprovalType;
using OOH.Application.Features.Global.ApprovalTypes.Commands.DeleteApprovalType;
using OOH.Application.Features.Global.ApprovalTypes.Commands.UpdateApprovalType;
using OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeDetail;
using OOH.Application.Features.Global.ApprovalTypes.Queries.GetApprovalTypeList;
using OOH.Application.Features.Global.Customers.Commands.CreateCustomer;
using OOH.Application.Features.Global.Customers.Commands.DeleteCustomer;
using OOH.Application.Features.Global.Customers.Commands.UpdateCustomer;
using OOH.Application.Features.Global.Customers.Queries.GetCustomerDetail;
using OOH.Application.Features.Global.Customers.Queries.GetCustomerList;
 
using OOH.Application.Features.Tenders.Cities.Commands.CreateCity;
using OOH.Application.Features.Tenders.Cities.Commands.DeleteCity;
using OOH.Application.Features.Tenders.Cities.Commands.UpdateCity;
using OOH.Application.Features.Tenders.Cities.Queries.GetCityDetail;
using OOH.Application.Features.Tenders.Cities.Queries.GetCityList;
using OOH.Application.Features.Tenders.ExpenseCategorys.Commands.CreateExpenseCategory;
using OOH.Application.Features.Tenders.ExpenseCategorys.Commands.DeleteExpenseCategory;
using OOH.Application.Features.Tenders.ExpenseCategorys.Commands.UpdateExpenseCategory;
using OOH.Application.Features.Tenders.ExpenseCategorys.Queries.GetExpenseCategoryDetail;
using OOH.Application.Features.Tenders.ExpenseCategorys.Queries.GetExpenseCategoryList;
using OOH.Application.Features.Tenders.Expenses.Commands.CreateExpense;
using OOH.Application.Features.Tenders.Expenses.Commands.DeleteExpense;
using OOH.Application.Features.Tenders.Expenses.Commands.UpdateExpense;
using OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseDetail;
using OOH.Application.Features.Tenders.Expenses.Queries.GetExpenseList;
using OOH.Application.Features.Tenders.ExpenseTransactions.Commands.CreateExpenseTransaction;
using OOH.Application.Features.Tenders.ExpenseTransactions.Commands.UpdateExpenseTransaction;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList;
using OOH.Application.Features.Tenders.ExpenseTypes.Commands.CreateExpenseType;
using OOH.Application.Features.Tenders.ExpenseTypes.Commands.DeleteExpenseType;
using OOH.Application.Features.Tenders.ExpenseTypes.Commands.UpdateExpenseType;
using OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeDetail;
using OOH.Application.Features.Tenders.ExpenseTypes.Queries.GetExpenseTypeList;
using OOH.Application.Features.Tenders.Vendors.Commands.CreateVendor;
using OOH.Application.Features.Tenders.Vendors.Commands.DeleteVendor;
using OOH.Application.Features.Tenders.Vendors.Commands.UpdateVendor;
using OOH.Application.Features.Tenders.Vendors.Queries.GetVendorDetail;
using OOH.Application.Features.Tenders.Vendors.Queries.GetVendorList;
using OOH.Domain.Entities;
using OOH.Domain.Entities.Global;
using OOH.Application.Features.Global.VendorCategories.Commands.CreateVendorCategory;
using OOH.Application.Features.Global.VendorCategories.Commands.UpdateVendorCategory;
using OOH.Application.Features.Global.VendorCategories.Commands.DeleteVendorCategory;
using OOH.Application.Features.Global.VendorCategories.Queries.GetVendorCategoryList;
using OOH.Application.Features.Global.VendorCategories.Queries.GetVendorCategoryDetail;
using OOH.Domain.Entities.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
 

namespace OOH.Application.Profiles
{
    public class MappingProfile : Profile
    {

        public MappingProfile()
        {



            #region City

            CreateMap<City, CityListVM>().ReverseMap();
            CreateMap<City, CityDetailVM>().ReverseMap();

            CreateMap<City, CreateCityCommand>().ReverseMap();
            CreateMap<City, CreateCityDto>().ReverseMap();

            CreateMap<City, UpdateCityCommand>().ReverseMap();
            CreateMap<City, UpdateCityDto>().ReverseMap();

            CreateMap<City, DeleteCityCommand>().ReverseMap();

            #endregion


            #region VendorCategory

            CreateMap<VendorCategory, VendorCategoryListVM>().ReverseMap();
            CreateMap<VendorCategory, VendorCategoryDetailVM>().ReverseMap();

            CreateMap<VendorCategory, CreateVendorCategoryCommand>().ReverseMap();
            CreateMap<VendorCategory, CreateVendorCategoryDto>().ReverseMap();

            CreateMap<VendorCategory, UpdateVendorCategoryCommand>().ReverseMap();

            CreateMap<VendorCategory, DeleteVendorCategoryCommand>().ReverseMap();

            #endregion


            #region GovtBody

            //CreateMap<GovtBody, GovtBodyListVM>().ReverseMap();
            //CreateMap<GovtBody, GovtBodyDetailVM>().ReverseMap();

            //CreateMap<GovtBody, CreateGovtBodyCommand>().ReverseMap();
            //CreateMap<GovtBody, CreateGovtBodyDto>().ReverseMap();

            //CreateMap<GovtBody, UpdateGovtBodyCommand>().ReverseMap();
            //CreateMap<GovtBody, UpdateGovtBodyDto>().ReverseMap();

            //CreateMap<GovtBody, DeleteGovtBodyCommand>().ReverseMap();

            #endregion

    



       


        




 
 

             



            #region Vendor 

            CreateMap<Vendor, VendorListVM>().ReverseMap();
            CreateMap<Vendor, VendorDetailVM>().ReverseMap();


            CreateMap<Vendor, CreateVendorCommand>().ReverseMap();
            CreateMap<Vendor, CreateVendorDto>().ReverseMap();

            CreateMap<Vendor, UpdateVendorCommand>().ReverseMap();
            CreateMap<Vendor, UpdateVendorDto>().ReverseMap();

            CreateMap<Vendor, DeleteVendorCommand>().ReverseMap();

            #endregion


        


             


            #region Account 

            //CreateMap<Account, AccountListVM>().ReverseMap();
            //CreateMap<Account, AccountDetailVM>().ReverseMap();


            //CreateMap<Account, CreateAccountCommand>().ReverseMap();
            //CreateMap<Account, CreateAccountDto>().ReverseMap();

            //CreateMap<Account, UpdateAccountCommand>().ReverseMap();
            //CreateMap<Account, UpdateAccountDto>().ReverseMap();

            //CreateMap<Account, DeleteAccountCommand>().ReverseMap();



            #endregion


            #region User 

            //CreateMap<AspNetUsers, UserListVM>().ReverseMap();
            //CreateMap<AspNetUsers, UserDetailVM>().ReverseMap();


            //CreateMap<AspNetUsers, CreateUserCommand>().ReverseMap();
            //CreateMap<AspNetUsers, CreateUserDto>().ReverseMap();

            //CreateMap<AspNetUsers, UpdateUserCommand>().ReverseMap();
            //CreateMap<AspNetUsers, UpdateUserDto>().ReverseMap();

            //CreateMap<AspNetUsers, DeleteUserCommand>().ReverseMap();





            #endregion


              

            #region Customer 

            CreateMap<Customer, CustomerListVM>().ReverseMap();
            CreateMap<Customer, CustomerDetailVM>().ReverseMap();


            CreateMap<Customer, CreateCustomerCommand>().ReverseMap();
            CreateMap<Customer, CreateCustomerDto>().ReverseMap();

            CreateMap<Customer, UpdateCustomerCommand>().ReverseMap();
            CreateMap<Customer, UpdateCustomerDto>().ReverseMap();

            CreateMap<Customer, DeleteCustomerCommand>().ReverseMap();

            #endregion







            #region TimeZone 

            //CreateMap<TimeZone, TimeZoneListVM>().ReverseMap();
            //CreateMap<TimeZone, TimeZoneDetailVM>().ReverseMap();


            //CreateMap<TimeZone, CreateTimeZoneCommand>().ReverseMap();
            //CreateMap<TimeZone, CreateTimeZoneDto>().ReverseMap();

            //CreateMap<TimeZone, UpdateTimeZoneCommand>().ReverseMap();
            //CreateMap<TimeZone, UpdateTimeZoneDto>().ReverseMap();

            //CreateMap<TimeZone, DeleteTimeZoneCommand>().ReverseMap();

            #endregion






            #region TimeZoneCountry 

            //CreateMap<TimeZoneCountry, TimeZoneCountryListVM>().ReverseMap();
            //CreateMap<TimeZoneCountry, TimeZoneCountryDetailVM>().ReverseMap();


            //CreateMap<TimeZoneCountry, CreateTimeZoneCountryCommand>().ReverseMap();
            //CreateMap<TimeZoneCountry, CreateTimeZoneCountryDto>().ReverseMap();

            //CreateMap<TimeZoneCountry, UpdateTimeZoneCountryCommand>().ReverseMap();
            //CreateMap<TimeZoneCountry, UpdateTimeZoneCountryDto>().ReverseMap();

            //CreateMap<TimeZoneCountry, DeleteTimeZoneCountryCommand>().ReverseMap();

            #endregion



            #region ApprovalType 

            CreateMap<ApprovalType, ApprovalTypeListVM>().ReverseMap();
            CreateMap<ApprovalType, ApprovalTypeDetailVM>().ReverseMap();


            CreateMap<ApprovalType, CreateApprovalTypeCommand>().ReverseMap();
            CreateMap<ApprovalType, CreateApprovalTypeDto>().ReverseMap();

            CreateMap<ApprovalType, UpdateApprovalTypeCommand>().ReverseMap();
            CreateMap<ApprovalType, UpdateApprovalTypeDto>().ReverseMap();

            CreateMap<ApprovalType, DeleteApprovalTypeCommand>().ReverseMap();

            #endregion



            #region Approval 

            CreateMap<Approval, ApprovalListVM>().ReverseMap();
            CreateMap<Approval, ApprovalDetailVM>().ReverseMap();


            CreateMap<Approval, CreateApprovalCommand>().ReverseMap();
            CreateMap<Approval, CreateApprovalDto>().ReverseMap();

            CreateMap<Approval, UpdateApprovalCommand>().ReverseMap();
            CreateMap<Approval, UpdateApprovalDto>().ReverseMap();

            CreateMap<Approval, DeleteApprovalCommand>().ReverseMap();

            #endregion


            #region ApprovalStatus 

            CreateMap<ApprovalStatus, ApprovalStatusListVM>().ReverseMap();
            CreateMap<ApprovalStatus, ApprovalStatusDetailVM>().ReverseMap();


            CreateMap<ApprovalStatus, CreateApprovalStatusCommand>().ReverseMap();
            CreateMap<ApprovalStatus, CreateApprovalStatusDto>().ReverseMap();

            CreateMap<ApprovalStatus, UpdateApprovalStatusCommand>().ReverseMap();
            CreateMap<ApprovalStatus, UpdateApprovalStatusDto>().ReverseMap();

            CreateMap<ApprovalStatus, DeleteApprovalStatusCommand>().ReverseMap();

            #endregion





            #region ApprovalApprover 

            CreateMap<ApprovalApprover, ApprovalApproverListVM>().ReverseMap();
            CreateMap<ApprovalApprover, ApprovalApproverDetailVM>().ReverseMap();

            CreateMap<ApprovalApprover, CreateApprovalApproverCommand>().ReverseMap();
            CreateMap<ApprovalApprover, CreateApprovalApproverDto>().ReverseMap();

            CreateMap<ApprovalApprover, UpdateApprovalApproverCommand>().ReverseMap();
            CreateMap<ApprovalApprover, UpdateApprovalApproverDto>().ReverseMap();

            CreateMap<ApprovalApprover, DeleteApprovalApproverCommand>().ReverseMap();

            #endregion

            #region ApprovalComment
            
            CreateMap<OOH.Domain.Entities.Global.ApprovalComment, OOH.Application.Features.Global.ApprovalComments.Commands.CreateApprovalComment.CreateApprovalCommentCommand>().ReverseMap();
            CreateMap<OOH.Domain.Entities.Global.ApprovalComment, OOH.Application.Features.Global.ApprovalComments.Commands.CreateApprovalComment.CreateApprovalCommentDto>().ReverseMap();

            #endregion


            #region ExpenseCategory 

            CreateMap<ExpenseCategory, ExpenseCategoryListVM>().ReverseMap();
            CreateMap<ExpenseCategory, ExpenseCategoryDetailVM>().ReverseMap();


            CreateMap<ExpenseCategory, CreateExpenseCategoryCommand>().ReverseMap();
            CreateMap<ExpenseCategory, CreateExpenseCategoryDto>().ReverseMap();

            CreateMap<ExpenseCategory, UpdateExpenseCategoryCommand>().ReverseMap();
            CreateMap<ExpenseCategory, UpdateExpenseCategoryDto>().ReverseMap();

            CreateMap<ExpenseCategory, DeleteExpenseCategoryCommand>().ReverseMap();

            #endregion


            #region ExpenseType 

            CreateMap<ExpenseType, ExpenseTypeListVM>().ReverseMap();
            CreateMap<ExpenseType, ExpenseTypeDetailVM>().ReverseMap();


            CreateMap<ExpenseType, CreateExpenseTypeCommand>().ReverseMap();
            CreateMap<ExpenseType, CreateExpenseTypeDto>().ReverseMap();

            CreateMap<ExpenseType, UpdateExpenseTypeCommand>().ReverseMap();
            CreateMap<ExpenseType, UpdateExpenseTypeDto>().ReverseMap();

            CreateMap<ExpenseType, DeleteExpenseTypeCommand>().ReverseMap();

            #endregion




            #region ExpenseTransaction 

            CreateMap<ExpenseTransaction, ExpenseTransactionListVM>().ReverseMap();
            CreateMap<ExpenseTransaction, ExpenseTransactionDetailVM>().ReverseMap();


            CreateMap<ExpenseTransaction, CreateExpenseTransactionCommand>().ReverseMap();
            CreateMap<ExpenseTransaction, CreateExpenseTransactionDto>().ReverseMap();

            CreateMap<ExpenseTransaction, UpdateExpenseTransactionCommand>().ReverseMap();
            CreateMap<ExpenseTransaction, UpdateExpenseTransactionDto>().ReverseMap();

            #endregion
 



            #region Expense 

            CreateMap<Expense, ExpenseListVM>().ReverseMap();
            CreateMap<Expense, ExpenseDetailVM>().ReverseMap();


            CreateMap<Expense, CreateExpenseCommand>().ReverseMap();
            CreateMap<Expense, CreateExpenseDto>().ReverseMap();

            CreateMap<Expense, UpdateExpenseCommand>().ReverseMap();
            CreateMap<Expense, UpdateExpenseDto>().ReverseMap();

            CreateMap<Expense, DeleteExpenseCommand>().ReverseMap();

            #endregion

        }
    }
}
