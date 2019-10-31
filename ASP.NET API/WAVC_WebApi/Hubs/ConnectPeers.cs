using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Hubs
{
    public class ConnectPeers : Hub
    {
        ApplicationDbContext context;
        UserManager<ApplicationUser> userManager;
        FriendsManager friendsManager;

        public ConnectPeers(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            this.context = context;
            this.userManager = userManager;
            friendsManager = new FriendsManager(context);
        }
        public async Task<bool> NewUser(string userId, string peerId, int call)
        {
            try
            {
                var user = await userManager.FindByIdAsync(userId);
                var recepient = friendsManager.GetFriends(user)[call];
                var name = user.UserName;
                await Clients.All.SendAsync("NewUserInfo", new { name, peerId, recepient.Id });
                return true;

            } catch
            {
                return false;
            }
        }
        public async Task Quit(string peerId)
        {
            await Clients.Others.SendAsync("UserQuit", peerId);
        }
    }
}
