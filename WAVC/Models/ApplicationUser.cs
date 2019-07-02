using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC.Models
{
    public class ApplicationUser : IdentityUser
    {
        [InverseProperty("Who")]
        public virtual ICollection<Friend> Friends { get; set; }
        [InverseProperty("Whose")]
        public virtual ICollection<Friend> WhoseFriend { get; set; }
        
    }
}
