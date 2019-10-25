using System.Threading.Tasks;
using WAVC_WebApi.Models.HelperModels;

namespace WAVC_WebApi.Hubs.Interfaces
{
    public interface IFriendRequestClient
    {
        Task FriendDeleted(string id);

        Task SendFreiendRequestResponse(string id, string name, string surname);

        Task FriendRequestSent(ApplicationUserModel model);
    }
}