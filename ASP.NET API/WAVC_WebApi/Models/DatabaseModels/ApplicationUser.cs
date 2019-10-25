using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WAVC_WebApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
            Friends = new HashSet<Relationship>();
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        [InverseProperty("User")]
        public virtual ICollection<Relationship> Friends { get; set; }

        [InverseProperty("RelatedUser")]
        public virtual ICollection<Relationship> RelatedFriends { get; set; }

        [InverseProperty("SenderUser")]
        public virtual ICollection<Message> MessagesSent { get; set; }

        [InverseProperty("RecieverUser")]
        public virtual ICollection<Message> MessagesRecieved { get; set; }
    }
}