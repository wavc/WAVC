using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WAVC_WebApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string Surname { get; set; }

        [InverseProperty("User")]
        public virtual ICollection<Relationship> Friends { get; set; }

        [InverseProperty("RelatedUser")]
        public virtual ICollection<Relationship> RelatedFriends { get; set; }

        public ApplicationUserModel ToApplicationUserModel()
        {
            return new ApplicationUserModel
            {
                Id = Id,
                Name = Name,
                Surname = Surname
            };
        }
    }
}