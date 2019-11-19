using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Hubs.Interfaces
{
    public interface IConversationClient
    {
        Task SendNewConversation(ConversationModel conversation);
    }
}
