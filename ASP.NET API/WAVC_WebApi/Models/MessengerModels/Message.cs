using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models
{
    public class Message
    {
        public long MessageId { get; set; }
        public string SenderUserId { get; set; }
        public ApplicationUser  SenderUser { get; set; }
        public string RecieverUserId { get; set; }
        public ApplicationUser  RecieverUser{ get; set; }
        public MessageType Type { get; set; }
        public string Content { get; set; }
        [Timestamp]
        public byte[] Timestamp { get; set; }
    }
}

