using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models
{
    public class ConversationModel
    {
        public int ConversationId { get; set; }
        public string LastMessage { get; set; }
        public List<ApplicationUserModel> Users { get; set; }
    }
}
