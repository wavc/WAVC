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
        public async Task<bool> NewUser(string userId, string peerId, string call)
        {
            try
            {
                var user = await userManager.FindByIdAsync(userId);
                var name = user.FirstName + " " + user.LastName;

                foreach(var recepient in getRecepients(user, call))
                {
                    await Clients.All.SendAsync("NewUserInfo", new { name, peerId, recepient.Id });
                }

            } catch
            {
                return false;
            }
            return true;
        }
        public async Task Quit(string peerId)
        {
            await Clients.Others.SendAsync("UserQuit", peerId);
        }

        IEnumerable<ApplicationUser> getRecepients(ApplicationUser sender, string id)
        {
            //temp
            return friendsManager.GetFriends(sender).Where(f => f.Id == id);
        }
    }
}
