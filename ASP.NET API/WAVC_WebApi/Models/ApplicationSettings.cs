using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models
{
    public class ApplicationSettings
    {
        public string JWTSecret { get; set; }
        public string ClientUrl { get; set; }
    }
}
