using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Localization.Internal;

namespace WAVC_WebApi.Models.HelperModels
{
    public class GroupMessageModel
    {
        public string[] UserIds { get; set; }
        public string InitialMessage { get; set; }
    }
}
