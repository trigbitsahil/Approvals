using System.Threading.Tasks;

namespace OOH.Application.Contracts.Infrastructure
{
    public interface IPushNotificationService
    {
        Task SendNotificationAsync(string userEmail, string title, string body);
    }
}
