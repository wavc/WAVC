using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models
{
    public class Message
    {   
        public enum Type
        {
            Text,
            Photo,
            File,
            Gif
        }

        public long MessageId { get; set; }
        public string SenderUserId { get; set; }
        public ApplicationUser  SenderUser { get; set; }
        public int ConversationId { get; set; }
        public Conversation Conversation { get; set; }
        public string Content { get; set; }
        public Type MessageType { get; set; }
        public bool WasRead { get; set; }
        [Timestamp]
        public DateTime Timestamp { get; set; }
    }
}
