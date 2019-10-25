using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using WAVC_WebApi.Hubs.Interfaces;

namespace WAVC_WebApi.Hubs
{
    [Authorize]
    public class FriendRequestHub : Hub<IFriendRequestClient>
    {
    }
}