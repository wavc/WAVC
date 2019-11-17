using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Hubs.Interfaces
{
    public interface IMessagesClient
    {
        Task MessageSent(int conversationId, MessageModel message);
        Task SendNewConversation(Conversation conversation);
        Task MessageRead(int messageId);
        Task NotifyMessageRead(int messageId);
    }
}
