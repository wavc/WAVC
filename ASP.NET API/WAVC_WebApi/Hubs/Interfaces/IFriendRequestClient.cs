using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Hubs.Interfaces
{
    public interface IFriendRequestClient
    {
        Task FriendDeleted(string id);
        Task SendFreiendRequestResponse(ApplicationUserModel model);
        Task FriendRequestSent(ApplicationUserModel model);
    }
}
