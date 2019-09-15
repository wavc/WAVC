using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models
{
    public class ApplicationUser:IdentityUser
    {
        public ApplicationUser()
        {
            Friends = new HashSet<Relationship>();
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public  virtual ICollection<Relationship> Friends { get; set; }
        public  virtual ICollection<Relationship> RelatedFriends { get; set; }

        public virtual ICollection<FriendRequest> FriendRequests { get; set; }
        public virtual ICollection<FriendRequest> RelatedFriendRequests { get; set; }

        public virtual ICollection<Message> MessagesSent { get; set; }
        public virtual ICollection<Message> MessagesRecieved { get; set; }
    }
}
