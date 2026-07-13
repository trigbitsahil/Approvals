using Dapper;
using OOH.Application.Contracts.Persistence.Tenders;
using OOH.Domain.Entities.Tenders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Persistence.Repositories.Tenders
{
    public class GovtBodyRepository : BaseRepository<GovtBody>, IGovtBodyRepository
    {

        public GovtBodyRepository(DapperDBContext dbContext) : base(dbContext)
        {

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="name"></param>
        /// <param name="id">Pass it to check for update operation</param>
        /// <returns></returns>
        public async Task<bool> IsNameUnique(string name, string id = null)
        {
            string query = string.Empty;
            if (id == null)
            {
                query = "Select count(*) From govt_body where name=@Name and Is_Voided = false";

            }
            else
            {

                query = "Select count(*) From govt_body where name=@Name and Govt_Body_ID != @Id and  Is_Voided = false";

            }

            int result;

            using (var db = _dbContext.CreateConnection())
            {
                /// var sameGovtBody =   db.QueryAsync(query ,new { Name = name});
                if (id == null)
                {
                    result = await db.QueryFirstOrDefaultAsync<int>(query, new { Name = name });

                }
                else
                {
                    result = await db.QueryFirstOrDefaultAsync<int>(query, new { Name = name, Id = id });


                }
                // [TO-DO] add the right logic
                if (result > 0)
                {
                    return true;

                }
                return false;
            }


        }


    }
}
