using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models
{
    public class Conversation
    {
        [Key]
        public int ConversationId { get; set; }
        public List<Message> Messages { get; set; }
        public virtual ICollection<ApplicationUserConversation> ApplicationUserConversation { get; set; }
    }
} 
