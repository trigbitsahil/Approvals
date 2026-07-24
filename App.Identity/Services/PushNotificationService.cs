using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OOH.Application.Contracts.Infrastructure;
using FirebaseAdmin.Messaging;

namespace OOH.Identity.Services
{
    public class PushNotificationService : IPushNotificationService
    {
        private readonly OOHIdentityDBContext _dbContext;

        public PushNotificationService(OOHIdentityDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task SendNotificationAsync(string userEmail, string title, string body)
        {
            try 
            {
                Console.WriteLine($"[PushNotificationService] Looking up user by email: {userEmail}");
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null)
                {
                    Console.WriteLine($"[PushNotificationService] User not found for email: {userEmail}");
                    return;
                }
                
                Console.WriteLine($"[PushNotificationService] Found user {user.Id}, looking up tokens...");

                var tokens = await _dbContext.UserFCMTokens
                    .Where(t => t.UserId == user.Id)
                    .Select(t => t.Token)
                    .Distinct()
                    .ToListAsync();

                if (tokens == null || !tokens.Any())
                {
                    Console.WriteLine($"[PushNotificationService] No FCM tokens found for user Id: {user.Id} (email: {userEmail})");
                    return;
                }

                var message = new MulticastMessage()
                {
                    Tokens = tokens,
                    Notification = new Notification()
                    {
                        Title = title,
                        Body = body
                    },
                    Data = new Dictionary<string, string>()
                    {
                        { "title", title },
                        { "body", body },
                        { "click_action", "/" }
                    }
                };

                Console.WriteLine($"[PushNotificationService] Sending notification to {tokens.Count} tokens for user {userEmail}");
                var response = await FirebaseMessaging.DefaultInstance.SendEachForMulticastAsync(message);
                Console.WriteLine($"[PushNotificationService] Successfully sent: {response.SuccessCount}, Failed: {response.FailureCount}");
                
                var deadTokens = new List<string>();
                for (int i = 0; i < response.Responses.Count; i++)
                {
                    var res = response.Responses[i];
                    if (!res.IsSuccess)
                    {
                        Console.WriteLine($"[PushNotificationService] FCM Error: {res.Exception?.Message}");
                        // If the token is no longer valid, we should mark it for deletion
                        if (res.Exception?.MessagingErrorCode == MessagingErrorCode.Unregistered || 
                            res.Exception?.MessagingErrorCode == MessagingErrorCode.InvalidArgument)
                        {
                            deadTokens.Add(tokens[i]);
                        }
                    }
                }

                if (deadTokens.Any())
                {
                    Console.WriteLine($"[PushNotificationService] Removing {deadTokens.Count} dead tokens from database...");
                    var tokensToDelete = await _dbContext.UserFCMTokens
                        .Where(t => t.UserId == user.Id && deadTokens.Contains(t.Token))
                        .ToListAsync();
                    
                    _dbContext.UserFCMTokens.RemoveRange(tokensToDelete);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PushNotificationService] Exception in SendNotificationAsync: {ex.Message}\n{ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[PushNotificationService] Inner Exception: {ex.InnerException.Message}");
                }
            }
        }
    }
}
