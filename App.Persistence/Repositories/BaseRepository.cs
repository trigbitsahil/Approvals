using Dapper;
using Microsoft.Identity.Client;
using OOH.Application.Contracts.Persistence;
 
using OOH.Application.StaticResources;
using OOH.Domain.Entities.Global;
using OOH.Domain.Entities.Tenders;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Common;
using System.Linq;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace OOH.Persistence.Repositories
{
    public class BaseRepository<T> : IAsyncRepository<T> where T : class
    {
        protected readonly DapperDBContext _dbContext;

        public BaseRepository(DapperDBContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<T?> GetByIdAsync(string id)
        {
            T result;
            try
            {
                string tableName = GetTableName();
                string keyColumn = GetKeyColumnName();
                string query = $"SELECT {GetColumnsAsProperties()} FROM {tableName} WHERE {keyColumn} = '{id}'";

                query += $" and Tenant_ID = '{_dbContext.currentTenantID}'";

                query += $" and Is_Voided = false ";

                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryFirstOrDefaultAsync<T>(query);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching a record from db: ${ex.Message}");
                throw new Exception($"Unable to fetch data. Please contact the administrator. Inner: {ex.Message}");
            }

            return result;
        }

        public async Task<T?> GetByIdForUpdateAsync(string id)
        {
            T result;
            try
            {
                string tableName = GetTableName();
                string keyColumn = GetKeyColumnName();
                string query = $"SELECT {GetColumnsAsProperties()} FROM {tableName} WHERE {keyColumn} = @Id AND Tenant_ID = @TenantId AND Is_Voided = false FOR UPDATE";

                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryFirstOrDefaultAsync<T>(query, new { Id = id, TenantId = _dbContext.currentTenantID });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching a record FOR UPDATE from db: ${ex.Message}");
                throw new Exception($"Unable to fetch data for update. Please contact the administrator. Inner: {ex.Message}");
            }

            return result;
        }


        /// <summary>
        /// without tenant ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public async Task<T?> GetByIdAsync2(string id)
        {
            T result;
            try
            {
                string tableName = GetTableName();
                string keyColumn = GetKeyColumnName();
                string query = $"SELECT {GetColumnsAsProperties()} FROM {tableName} WHERE {keyColumn} = '{id}'";

           //     query += $" and Tenant_ID = '{_dbContext.currentTenantID}'";

                query += $" and Is_Voided = false ";



                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryFirstOrDefaultAsync<T>(query);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching a record from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result;
        }


        public async Task<List<T>> ListAllAsync()
        {
            IEnumerable<T> result;
            try
            {
                string tableName = GetTableName();
                string query = $"SELECT {GetColumnsAsProperties()} FROM {tableName}";

                query = query + $" where Tenant_ID =  '{_dbContext.currentTenantID}'";

                query = query + $" and Is_Voided = false ";


                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryAsync<T>(query);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching records from db: ${ex.Message}");
                throw new Exception("Unable to fetch data. Please contact the administrator.");
            }

            return result.ToList();
        }



        public async Task<int> AddAsync(T entity)
        {
            int rowsEffected = 0;
            try
            {

                SetTenantID(entity);
                SetCreatedByAndDate(entity);

                string tableName = GetTableName();
                string columns = GetColumns(excludeKey: false);//GetColumns(excludeKey: true);
                string properties = GetPropertyNames(excludeKey: false); //GetPropertyNames(excludeKey: true);
                string query = $"INSERT INTO {tableName} ({columns}) VALUES ({properties})";
                using (var dbConn = _dbContext.CreateConnection())
                {   
                    rowsEffected = await dbConn.ExecuteAsync(query, entity);
                }
            }
            catch (Exception ex)
            {
                //Console.WriteLine($"Error adding a record to db: ${ex.Message}");
                rowsEffected = -1;
            }


            return rowsEffected;
        }




        /// <summary>
        /// Function to use when setting entity's tenant id and created date explicitly
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public async Task<int> AddAsync2(T entity)
        {
            int rowsEffected = 0;
            try
            {


                //SetTenantID(entity);
                //SetCreatedByAndDate(entity);

                string tableName = GetTableName();
                string columns = GetColumns(excludeKey: false);//GetColumns(excludeKey: true);
                string properties = GetPropertyNames(excludeKey: false); //GetPropertyNames(excludeKey: true);
                string query = $"INSERT INTO {tableName} ({columns}) VALUES ({properties})";
                using (var dbConn = _dbContext.CreateConnection())
                {
                    rowsEffected = await dbConn.ExecuteAsync(query, entity);
                }
            }
            catch (Exception ex)
            {
                //Console.WriteLine($"Error adding a record to db: ${ex.Message}");
                rowsEffected = -1;
            }


            return rowsEffected;
        }



        public async Task<int> UpdateAsync(T entity)
        {
            int rowsEffected = 0;
            try
            {
               SetUpdatedByAndDate(entity);

                string? tableName = GetTableName();
                string? keyColumn = GetKeyColumnName();
                string? keyProperty = GetKeyPropertyName();

                StringBuilder query = new StringBuilder();
                query.Append($"UPDATE {tableName} SET ");

                foreach (var property in GetProperties(true))
                // foreach (var property in GetPropertiesForUpdate(  entity,true))
                {
                    var columnAttribute = property.GetCustomAttribute<ColumnAttribute>();

                    string propertyName = property.Name;
                    string columnName = columnAttribute?.Name ?? "";

                    query.Append($"{columnName} = @{propertyName},");
                }

                query.Remove(query.Length - 1, 1);

                query.Append($" WHERE {keyColumn} = @{keyProperty}");

                query.Append($" and Tenant_ID  = '{_dbContext.currentTenantID}'");

                using (var dbConn = _dbContext.CreateConnection())
                {
                    rowsEffected = await dbConn.ExecuteAsync(query.ToString(), entity);
                }
            }
            catch (Exception ex)
            {
                //   Console.WriteLine($"Error updating a record in db: ${ex.Message}");
                rowsEffected = -1;
            }


            return rowsEffected;
        }

        public async Task<int> DeleteAsync(T entity)
        {
            int rowsEffected = 0;
            try
            {
                //string? tableName = GetTableName();
                //string? keyColumn = GetKeyColumnName();
                //string? keyProperty = GetKeyPropertyName();
                //string query = $"DELETE FROM {tableName} WHERE {keyColumn} = @{keyProperty}";

                //query = query + $" and Tenant_ID  = '{_dbContext.currentTenantID}'";



                //using (var dbConn = _dbContext.CreateConnection())
                //{


                //    rowsEffected = await dbConn.ExecuteAsync(query, entity);
                //}

            }
            catch (Exception ex)
            {
                rowsEffected = -1;
                // throw ex;
                // Console.WriteLine($"Error deleting a record in db: ${ex.Message}");

            }


            return rowsEffected;
        }


        public async Task ClearTableAsync()
        {
            try
            {
                string? tableName = GetTableName();
                string query = $"TRUNCATE TABLE {tableName} CASCADE;";

                using (var dbConn = _dbContext.CreateConnection())
                {
                    await dbConn.ExecuteAsync(query);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error clearing table in db: {ex.Message}");
            }
        }

        public async Task<int> VoidAsync(T entity)
        {
            int rowsEffected = 0;
            try
            {
                string? tableName = GetTableName();
                string? keyColumn = GetKeyColumnName();
                string? keyProperty = GetKeyPropertyName();
                string query = $"Update  {tableName} set Is_Voided = true WHERE {keyColumn} = @{keyProperty}";

                query = query + $" and Tenant_ID  = '{_dbContext.currentTenantID}'";


                using (var dbConn = _dbContext.CreateConnection())
                {

                    rowsEffected = await dbConn.ExecuteAsync(query, entity);
                }

            }
            catch (Exception ex)
            {
                rowsEffected = -1;
                // throw ex;
                // Console.WriteLine($"Error deleting a record in db: ${ex.Message}");

            }


            return rowsEffected;
        }



        public async Task<int> CountAllAsync()
        {
            int result = -1;
            try
            {
                string tableName = GetTableName();
                // May need exact column names
                string query = $"SELECT COUNT(*) FROM {tableName}";

                query = query + $" and Is_Voided = false ";


                using (var dbConn = _dbContext.CreateConnection())
                {
                    result = await dbConn.QueryFirstOrDefaultAsync<int>(query);
                }
            }
            catch (Exception ex)
            {
                // Console.WriteLine($"Error counting records in db: ${ex.Message}");
                throw new Exception("Unable to count data. Please contact the administrator.");
            }


            return result;
        }

        public async Task<int> UpdateRelatedDocumentDate(string documentType, string documentTypeId, DateTime DocumentDate) {


            int rowsEffected = 0;
            try
            {

                string query = $"Update  document_url set document_date = @documentDate  , document_Type = @documentType" ;
                
                query = query + $" WHERE   Tenant_ID  = '{_dbContext.currentTenantID}'";

                query = query + $" and Is_Voided = false ";

                //query = query + $" and document_Type = @documentType ";

                query = query + $" and document_Type_id = @documentTypeId ";

                using (var dbConn = _dbContext.CreateConnection())
                {
                    rowsEffected = await dbConn.ExecuteAsync(query, new { tenantID = _dbContext.currentTenantID, documentType = documentType, documentTypeId = documentTypeId, documentDate = DocumentDate});
                   // rowsEffected = await dbConn.ExecuteAsync(query, new { tenantID = _dbContext.currentTenantID,  documentTypeId = documentTypeId, documentDate = DocumentDate });

                }




            }
            catch (Exception ex)
            {
                //   Console.WriteLine($"Error updating a record in db: ${ex.Message}");
                rowsEffected = -1;
            }


            return rowsEffected;




        }

        public async Task<string> GetUserDepartment()
        {
            string departmentId = string.Empty;

            try
            {

                string query2 = "  select \"DepartmentId\" from public.\"AspNetUsers\" \r\n  where \"Email\" = @userEmail ";

                query2 = query2 + $" and  \"TenantID\" = @tenantID ";

                query2 = query2 + $" and \"IsVoided\" = false ";


                using (var dbConn = _dbContext.CreateConnection())
                {
                    departmentId = await dbConn.QueryFirstOrDefaultAsync<string>(query2, new { tenantID = _dbContext.currentTenantID, userEmail = _dbContext.currentUserEmail });

                }
 
            }
            catch (Exception ex)
            {
                //Console.WriteLine($"Error adding a record to db: ${ex.Message}");
                departmentId = string.Empty;
            }

             
            return departmentId;
        }



        //public async Task<bool> IsNameUnique(T entity)
        //{
        //    string query = string.Empty;

        //    string? tableName = GetTableName();
        //    string? keyColumn = GetKeyColumnName();
        //    string? keyProperty = GetKeyPropertyName();

        //    if (keyProperty == null)
        //    {
        //        query = $"Select count(*) From  {tableName} where name=@Name and Is_Voided = 0";

        //    }
        //    else
        //    {

        //        query = $"Select count(*) From  {tableName} where name=@Name and {keyColumn} != @{keyProperty} and Is_Voided = 0";

        //    }
        //    query = query + $" and Tenant_ID = '{_dbContext.currentTenantID}'";

        //    int result;

        //    Type t = entity.GetType();

        //    PropertyInfo prop = t.GetProperty("Name");

        //    var name = prop.GetValue(entity);
        //    using (var db = _dbContext.CreateConnection())
        //    {

        //        result = await db.QueryFirstOrDefaultAsync<int>(query, new { Name = name });


        //        // [TO-DO] add the right logic
        //        if (result > 0)
        //        {
        //            return true;

        //        }
        //        return false;
        //    }


        //}


        //public async Task<IReadOnlyList<T>> ListAllAsync()
        //{
        //    // string tableName = GetTableName();
        //    // string query = $"SELECT COUNT(*) FROM {tableName}";
        //    string query = $"Select * From {GetTableName()}";

        //    using (var db = _dbContext.CreateConnection())
        //    {

        //        var objList = await db.QueryAsync<T>(query);

        //        //[TO-DO] add the right logic
        //        //if (sameCityCount > 1)
        //        //{
        //        //    return false;

        //        //}
        //        return objList.ToList();
        //    }
        //}


        #region Private Methods



        private void SetTenantID(T entity)
        {
            PropertyInfo piShared = entity.GetType().GetProperty("TenantId");
            if (piShared != null)
            {
                var existingValue = piShared.GetValue(entity);
                if (existingValue == null || (existingValue is string str && string.IsNullOrEmpty(str)))
                {
                    piShared.SetValue(entity, _dbContext.currentTenantID);
                }
            }
        }

        private void SetCreatedByAndDate(T entity)
        {
            PropertyInfo piShared = entity.GetType().GetProperty("CreatedBy");
            piShared.SetValue(entity, _dbContext.currentUserEmail);

            PropertyInfo piShared2 = entity.GetType().GetProperty("CreatedDate");
            piShared2.SetValue(entity, DateTime.UtcNow);

             
        }

        private void SetUpdatedByAndDate(T entity)
        {
            PropertyInfo piShared = entity.GetType().GetProperty("LastModifiedBy");
            piShared.SetValue(entity, _dbContext.currentUserEmail);

            PropertyInfo piShared2 = entity.GetType().GetProperty("LastModifiedDate");
            piShared2.SetValue(entity, DateTime.UtcNow);


        }


        private string GetTableName()
        {
            var type = typeof(T);
            var tableAttribute = type.GetCustomAttribute<TableAttribute>();
            if (tableAttribute != null)
                return tableAttribute.Name;

            return type.Name;
        }

        private static string? GetKeyColumnName()
        {
            PropertyInfo[] properties = typeof(T).GetProperties();

            foreach (PropertyInfo property in properties)
            {
                object[] keyAttributes = property.GetCustomAttributes(typeof(KeyAttribute), true);

                if (keyAttributes != null && keyAttributes.Length > 0)
                {
                    object[] columnAttributes = property.GetCustomAttributes(typeof(ColumnAttribute), true);

                    if (columnAttributes != null && columnAttributes.Length > 0)
                    {
                        ColumnAttribute columnAttribute = (ColumnAttribute)columnAttributes[0];
                        return columnAttribute?.Name ?? "";
                    }
                    else
                    {
                        return property.Name;
                    }
                }
            }

            return null;
        }


        private string GetColumns(bool excludeKey = false)
        {
            var type = typeof(T);
            var columns = string.Join(", ", type.GetProperties()
                .Where(p => !excludeKey || !p.IsDefined(typeof(KeyAttribute)))
                .Select(p =>
                {
                    var columnAttribute = p.GetCustomAttribute<ColumnAttribute>();
                    return columnAttribute != null ? columnAttribute.Name : p.Name;
                }));

            return columns;
        }

        private string GetColumnsAsProperties(bool excludeKey = false)
        {
            var type = typeof(T);
            var columnsAsProperties = string.Join(", ", type.GetProperties()
                .Where(p => !excludeKey || !p.IsDefined(typeof(KeyAttribute)))
                .Select(p =>
                {
                    var columnAttribute = p.GetCustomAttribute<ColumnAttribute>();
                    return columnAttribute != null ? $"{columnAttribute.Name} AS {p.Name}" : p.Name;
                }));

            return columnsAsProperties;
        }

        public string GetColumnsAsPropertiesWithTableName(bool excludeKey = false)
        {
            var type = typeof(T);
            var columnsAsProperties = string.Join(", ", type.GetProperties()
                .Where(p => !excludeKey || !p.IsDefined(typeof(KeyAttribute)))
                .Select(p =>
                {
                    var columnAttribute = p.GetCustomAttribute<ColumnAttribute>();
                    return columnAttribute != null ? $"{GetTableName()}.{columnAttribute.Name} AS {p.Name}" : p.Name;
                }));

            return columnsAsProperties;
        }
        private string GetPropertyNames(bool excludeKey = false)
        {
            var properties = typeof(T).GetProperties()
                .Where(p => !excludeKey || p.GetCustomAttribute<KeyAttribute>() == null);

            var values = string.Join(", ", properties.Select(p => $"@{p.Name}"));

            return values;
        }

        private IEnumerable<PropertyInfo> GetProperties(bool excludeKey = false)
        {
            var properties = typeof(T).GetProperties()
                .Where(p => !excludeKey || p.GetCustomAttribute<KeyAttribute>() == null);

            return properties;
        }

        private string? GetKeyPropertyName()
        {
            var properties = typeof(T).GetProperties()
                .Where(p => p.GetCustomAttribute<KeyAttribute>() != null).ToList();

            if (properties.Any())
                return properties?.FirstOrDefault()?.Name ?? null;

            return null;
        }



        private IEnumerable<PropertyInfo> GetPropertiesForUpdate(T entity, bool excludeKey = false)
        {
            var properties = typeof(T).GetProperties()
                .Where(p => !excludeKey || p.GetCustomAttribute<KeyAttribute>() == null);

            List<PropertyInfo> updatableProperties = new List<PropertyInfo>();

            foreach (var property in properties)
            {
                //  var columnAttribute = property.GetCustomAttribute<ColumnAttribute>();

                string propertyName = property.Name;

                var value11 = property.GetValue(entity, null);

                if (value11 != null)
                {
                    updatableProperties.Add(property);


                }
                //    string columnName = columnAttribute?.Name ?? "";

                //   query.Append($"{columnName} = @{propertyName},");
            }


            //  var value = (string)GetType().GetProperty("SomeProperty").GetValue(this, null);

            return updatableProperties;
        }




        //private string GetTableName()
        //{
        //    string tableName = "";
        //    var type = typeof(T);
        //    var tableAttr = type.GetCustomAttribute<TableAttribute>();
        //    if (tableAttr != null)
        //    {
        //        tableName = tableAttr.Name;
        //        return tableName;
        //    }

        //    return type.Name ;

        //    //return type.Name + "s";
        //}


        #endregion






    }
}
