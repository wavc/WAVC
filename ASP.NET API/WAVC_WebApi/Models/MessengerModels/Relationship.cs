using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models
{
    public class Relationship
    { 
        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }
        public string RelatedUserId { get; set; }
        public virtual ApplicationUser RelatedUser { get; set; }
    }
}
