using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using WAVC.Data;
using WAVC.Models;
using Newtonsoft.Json;

namespace WAVC.Hubs
{
    public class ConnectPeers : Hub
    {
        ApplicationDbContext context;
        UserManager<ApplicationUser> userManager;
        public ConnectPeers(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            this.context = context;
            this.userManager = userManager;
        }
        public async Task NewUser(string peerId)
        {
            string name;
            try
            {
                var user = await userManager.GetUserAsync(Context.User);
                name = user.UserName;
            }
            catch
            {
                name = "Guest";
            }
            
            await Clients.All.SendAsync("NewUserInfo", new { name, peerId});

        }
        public async Task Quit(string peerId)
        {
            await Clients.Others.SendAsync("UserQuit", peerId);
        }
    }
}
