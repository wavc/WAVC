using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using WAVC_WebApi.Hubs.Interfaces;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Hubs
{
    public class ConversationHub : Hub<IConversationClient>
    {
       
    }
}
