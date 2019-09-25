using System.Threading.Tasks;

namespace WAVC_WebApi.Hubs.Interfaces
{
    public interface IFriendRequestClient
    {
        Task FriendDeleted(string id);

        Task RecieveFriendRequest(string id, string name, string surname);

        Task RecieveFriendRequestResponse(string id, string name, string surname);
    }
}