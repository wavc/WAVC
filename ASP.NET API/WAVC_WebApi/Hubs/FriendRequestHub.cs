using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Hubs
{
    public class FriendRequestHub : Hub
    {
        ApplicationDbContext dBContext;
        UserManager<ApplicationUser> userManager;
        FriendsManager friendsManager;
        public FriendRequestHub(UserManager<ApplicationUser> userManager, ApplicationDbContext dBContext)
        {
            this.dBContext = dBContext;
            this.userManager = userManager;
            friendsManager = new FriendsManager(dBContext);
        }

        public async Task<bool> DeleteFriend(string id)
        {

            var user = await userManager.GetUserAsync(Context.User);
            var other = dBContext.Users.Find(id);

            var result = await friendsManager.DeleteFriendAsync(user, other);
            if (!result)
            {
                return false;
            }
            await Clients.User(other.Id).SendAsync("FriendDeleted", user.Id);
            return true;
        }

        public async Task SendFriendRequest(string id)
        {
            var user = await userManager.GetUserAsync(Context.User);
            var selected = dBContext.Users.Find(id);

            if (selected == null || user == null)
            {
                //error
                return;
            }

            if (friendsManager.GetRequestsForUser(user).Contains(selected))
            {
                //selected already sent request - treat it as accept
                await SendFriendRequestResponse(selected.Id, true);
                return;
            }

            if (friendsManager.GetUserRequests(user).Contains(selected))
            {
                //user already sent request - do nothing
                return;
            }

            await friendsManager.CreateRequestAsync(user, selected);

            await Clients.User(selected.Id).SendAsync("RecieveFriendRequest", user.Id, user.Name, user.Surname);
        }

        public async Task SendFriendRequestResponse(string id, bool accept)
        {
            var user = await userManager.GetUserAsync(Context.User);
            var other = dBContext.Users.Find(id);
            try
            {

                if (accept)
                {
                    await friendsManager.AcceptRequestAsync(user, other);
                    await Clients.User(other.Id).SendAsync("RecieveFriendRequestResponse", user.Id, user.Name, user.Surname);
                }
                else
                {
                    await friendsManager.RejectRequestAsync(user, other);
                }
            }
            catch (ArgumentNullException)
            {
                //there is no such user
                return;
            }
            catch (NullReferenceException)
            {
                //there is no request to be accepted/rejected
                return;
            }

        }
    }
}
