using Dapper;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Application.Features.Tenders.Vendors.Queries.GetVendorList;
using OOH.Domain.Entities.Tenders;

namespace OOH.Persistence.Repositories.Tenders
{
    public class VendorRepository : BaseRepository<Vendor>, IVendorRepository
    {
        public VendorRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }



        public async Task<List<VendorListVM>> ListAllVendorsAsync(string category, string categoryID)
        {
            IEnumerable<VendorListVM> result;
            try
            {


                string query = $"SELECT   {GetColumnsAsPropertiesWithTableName()}  FROM Vendor";

                query = query + $" where Tenant_ID = @tenantID ";

                query = query + $" and Is_Voided = false ";

                query = query + $" and Category = @category ";

                query = query + $" and Category_ID = @categoryID ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<VendorListVM>(query, new { tenantID = _dbContext.currentTenantID, category, categoryID });

                }



            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result.ToList();
        }



    }
}