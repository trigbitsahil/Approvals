 
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionDetail;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionList2;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListByVendor;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionListForApproval;
using OOH.Application.Features.Tenders.ExpenseTransactions.Queries.GetExpenseTransactionSearch;
using OOH.Domain.Entities.Tenders;

namespace OOH.Application.Contracts.Persistence.Tenders
{

    public interface IExpenseTransactionRepository : IAsyncRepository<ExpenseTransaction>
    {
        Task<List<ExpenseTransactionListVM>> ListAllExpenseTransactionsAsync(string category, string categoryID);

        Task<List<ExpenseTransactionList2VM>> ListAllExpenseTransactionsAsync2(string category, string categoryID);

        Task<List<ExpenseTransactionListByVendorVM>> ListAllExpenseTransactionsByVendorAsync(string mediaId, string vendorId);
        Task<List<ExpenseTransactionSearchVM>> ListAllExpenseTransactionsSearchAsync(string mediaId, string expenseId, string expenseTypeId , string vendorId);

        
        Task<List<ExpenseTransactionListForApprovalVM>> ListAllExpenseTransactionsForApprovalAsync( );

        Task<ExpenseTransactionDetailVM> GetExpenseTransactionDetailsAsync(string entityID);


    }

}
