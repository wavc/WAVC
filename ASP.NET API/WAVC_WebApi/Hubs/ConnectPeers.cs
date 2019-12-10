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
        private ApplicationDbContext context;
        private UserManager<ApplicationUser> userManager;
        private FriendsManager friendsManager;

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
                var user = await userManager.FindByIdAsync(Context.User.Identity.Name);
                if (!context.ApplicationUserConversations
                    .Where(c => c.ConversationId == int.Parse(call))
                    .Any(uc => uc.UserId == userId))
                {
                    return false;
                }
                await Groups.AddToGroupAsync(Context.ConnectionId, call);
                var name = user.FirstName + " " + user.LastName;

                await Clients.Group(call).SendAsync("NewUserInfo", new { name, peerId });
            }
            catch
            {
                return false;
            }
            return true;
        }

        public async Task Quit(string peerId, string call)
        {
            await Clients.OthersInGroup(call).SendAsync("UserQuit", peerId);
        }
    }
}