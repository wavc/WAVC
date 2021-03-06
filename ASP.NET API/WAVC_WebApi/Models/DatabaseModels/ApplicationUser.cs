﻿using Microsoft.AspNetCore.Identity;
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
        public string ProfilePictureUrl { get; set; }
        [InverseProperty("User")]
        public  virtual ICollection<Relationship> Friends { get; set; }
        [InverseProperty("RelatedUser")]
        public  virtual ICollection<Relationship> RelatedFriends { get; set; }
        public virtual ICollection<ApplicationUserConversation> ApplicationUserConversation { get; set; }
    }
}
    