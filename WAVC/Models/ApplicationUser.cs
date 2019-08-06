using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WAVC.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string Surname { get; set; }

        [InverseProperty("Who")]
        public virtual ICollection<Friend> Friends { get; set; }
        [InverseProperty("Whose")]
        public virtual ICollection<Friend> WhoseFriend { get; set; }


    }
    public static class ManagerExt
    {
        public static new string GetUserFirstName(this UserManager<ApplicationUser> userManager, ClaimsPrincipal principal)
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
