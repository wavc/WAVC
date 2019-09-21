using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models.HelperModels
{
    public class SendMessageModel
    {
        public string Content { get; set; }
        public MessageType Type { get; set; }
    }
}
