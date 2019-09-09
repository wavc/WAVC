using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;

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
    }

    public static class ManagerExt
    {
        public static string GetUserFirstName(this UserManager<ApplicationUser> userManager, ClaimsPrincipal principal)
        {
            var user = userManager.GetUserAsync(principal).GetAwaiter().GetResult();
            return user.Name;
        }
        public static string GetUserSurname(this UserManager<ApplicationUser> userManager, ClaimsPrincipal principal)
        {
            var user = userManager.GetUserAsync(principal).GetAwaiter().GetResult();
            return user.Surname;
        }
    }
}
