using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Npgsql;
using OOH.Application.Contracts.Infrastructure;
using OOH.Domain.Entities.Tenders;
using System;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

public class ActivityLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ActivityLoggingMiddleware> _logger;
    private readonly string _connectionString;

    public string currentTenantID;
    public string currentUserEmail;
    public ActivityLoggingMiddleware(RequestDelegate next, ILogger<ActivityLoggingMiddleware> logger, IConfiguration configuration)
    {
        _next = next;
        _logger = logger;
        _connectionString = configuration.GetConnectionString("DefaultConnection"); // Fetch PostgreSQL connection string
 
    }

    public async Task Invoke(HttpContext context)
    {
       // var user = await userManager.GetUserAsync(context.User);
       // var userId = user?.Id ?? "Anonymous";

        string controller = context.GetRouteValue("controller")?.ToString() ?? "Unknown";
        string actionMethod = context.GetRouteValue("action")?.ToString() ?? "Unknown";
        string friendlyName = ActivityFriendlyNames.GetFriendlyName(controller, actionMethod);
        string UserEmail = string.Empty;
        string tenantID = string.Empty;
        string UserID = string.Empty;

        if (context.User.Identities.FirstOrDefault().IsAuthenticated) {
 
              tenantID = context.Request.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type.Equals("tenant")).Value;// FindFirstValue("tenant");

              UserID = context.Request.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.NameIdentifier)).Value;// FindFirstValue("tenant");

              UserEmail = context.Request.HttpContext?.User?.Claims.FirstOrDefault(x => x.Type.Equals(ClaimTypes.Email)).Value;// FindFirstValue("tenant");

        }
        else if (context.Request.Path.ToString().ToLower().Contains("login"))
        {
            actionMethod = "login";
   
        }


        var logEntry = new
        {
            user_activity_log_id = Guid.NewGuid().ToString(),
            user_email = UserEmail,
            user_id = UserID,
            access_type = context.Request.Method,
            controller = controller,
            action_method = actionMethod,
            friendly_action_name = friendlyName,
            request_url = context.Request.Path.ToString(),
            ip_address = context.Connection.RemoteIpAddress?.ToString(),
            user_agent = context.Request.Headers["User-Agent"].ToString(),
            is_voided = false,
            created_by = "system@system.com",
            created_date = DateTime.UtcNow,
            last_modified_by = "system@system.com",
            last_modified_date = DateTime.UtcNow,
            tenant_id = tenantID
        };

        try
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                string sql = @"
                    INSERT INTO user_activity_log(
	user_activity_log_id, user_id, user_email, access_type, controller, 
	action_method, friendly_action_name, request_url, ip_address, 
	user_agent, is_voided, created_by, created_date, last_modified_by, 
	last_modified_date, tenant_id)

                    VALUES (@user_activity_log_id,@user_id, @user_email, @access_type, @controller, @action_method, 
                            @friendly_action_name, @request_url, @ip_address, @user_agent, @is_voided, @created_by, @created_date , @last_modified_by, @last_modified_date, @tenant_id )";

                await connection.ExecuteAsync(sql, logEntry);

                string sql2 = @"delete from  user_activity_log  WHERE created_date < (NOW() AT TIME ZONE 'UTC') - INTERVAL '7 days'";

                await connection.ExecuteAsync(sql2, logEntry);


            }
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error logging activity: {ex.Message}");
        }

        await _next(context);
    }
}


public static class ActivityFriendlyNames
{
    public static readonly Dictionary<string, string> ActionNames = new()
    {
        { "Home/Index", "Visited Home Page" },
        { "Account/Login", "User Logged In" },
        { "Account/Logout", "User Logged Out" },
        { "Profile/Edit", "Updated Profile" },
        { "Products/Details", "Viewed Product Details" },
        { "Cart/Add", "Added Item to Cart" },
        { "Order/Checkout", "Completed Checkout" },
    };

    public static string GetFriendlyName(string controller, string action)
    {
        string key = $"{controller}/{action}";
        return ActionNames.ContainsKey(key) ? ActionNames[key] : $"{controller} → {action}";
    }
}
