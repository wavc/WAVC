using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC.Hubs
{
    public class ChatHub: Hub
    {
        public async Task SendMessage(string user, string message)
        {
            //await Clients.All.SendAsync("RecieveMessage", user, message);
            await Clients.AllExcept(Context.ConnectionId).SendAsync("RecieveMessage", user, message);
        }
    }
}
