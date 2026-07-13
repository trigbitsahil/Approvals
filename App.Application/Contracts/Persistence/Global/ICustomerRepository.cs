using OOH.Application.Features.Global.Customers.Queries.GetCustomerList;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Contracts.Persistence.Global
{

    public interface ICustomerRepository : IAsyncRepository<Customer>
    {
        Task<List<CustomerListVM>> ListAllCustomersAsync(string category, string categoryID);
    }

} 
