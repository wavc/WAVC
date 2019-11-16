using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models
{
    public class MessageModel
    {
        public int ConversationId { get; set; }
        public string Content { get; set; }
        public string senderId { get; set; }
        public Message.Type Type { get; set; }
        public byte[] Timestamp { get; set; }

        public MessageModel(Message fullMessage)
        {
            ConversationId = fullMessage.ConversationId;
            Content = fullMessage.Content;
            senderId = fullMessage.SenderUserId;
            Type = fullMessage.MessageType;
        }
        public MessageModel()
        {

        }
    }
}
