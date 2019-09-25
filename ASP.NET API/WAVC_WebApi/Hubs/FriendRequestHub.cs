using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using WAVC_WebApi.Data;
using WAVC_WebApi.Hubs.Interfaces;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Hubs
{
    [Authorize]
    public class FriendRequestHub : Hub<IFriendRequestClient>
    {
        private readonly ApplicationDbContext dbContext;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly FriendsManager friendsManager;

        public FriendRequestHub(UserManager<ApplicationUser> userManager, ApplicationDbContext dBContext)
        {
            this.dbContext = dBContext;
            this.userManager = userManager;
            friendsManager = new FriendsManager(dBContext);
        }

        public async Task<bool> DeleteFriend(string id)
        {
            var sender = await userManager.GetUserAsync(Context.User);
            var reciever = dbContext.Users.Find(id);

            var result = await friendsManager.DeleteFriendAsync(sender, reciever);
            if (!result)
            {
                return false;
            }
            await Clients.User(reciever.Id).FriendDeleted(sender.Id);
            return true;
        }

        public async Task SendFriendRequest(string id)
        {
            var sender = await userManager.GetUserAsync(Context.User);
            var reciever = dbContext.Users.Find(id);

            if (reciever == null || sender == null)
            {
                // error
                return;
            }

            if (friendsManager.GetRequestsForUser(sender).Contains(reciever))
            {
                // selected already sent request - treat it as accept
                await SendFriendRequestResponse(reciever.Id, true);
                return;
            }

            if (friendsManager.GetUserRequests(sender).Contains(reciever))
            {
                // user already sent request - do nothing
                return;
            }

            await friendsManager.CreateRequestAsync(sender, reciever);

            await Clients.User(reciever.Id).RecieveFriendRequest(sender.Id, sender.Name, sender.Surname);
        }

        public async Task SendFriendRequestResponse(string id, bool accept)
        {
            var sender = await userManager.GetUserAsync(Context.User);
            var reciever = dbContext.Users.Find(id);
            try
            {
                if (accept)
                {
                    await friendsManager.AcceptRequestAsync(sender, reciever);
                    await Clients.User(reciever.Id).RecieveFriendRequestResponse(sender.Id, sender.Name, sender.Surname);
                }
                else
                {
                    await friendsManager.RejectRequestAsync(sender, reciever);
                }
            }
            catch (ArgumentNullException)
            {
                // there is no such user
                return;
            }
            catch (NullReferenceException)
            {
                // there is no request to be accepted/rejected
                return;
            }
        }
    }
}