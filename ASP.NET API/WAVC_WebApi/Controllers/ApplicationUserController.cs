using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        UserManager<ApplicationUser> userManager;
        ApplicationDbContext dBContext;
        FriendsManager friendsManager;
        int searchResults = 10;

        public ApplicationUserController(UserManager<ApplicationUser> userManager, ApplicationDbContext dBContext)
        {
            this.userManager = userManager;
            this.dBContext = dBContext;
            friendsManager = new FriendsManager(dBContext);
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<ApplicationUserModel>> GetFriends()
        {
            var user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null)
            {
                return friendsManager.GetFriends(user).Select(u => u.ToApplicationUserModel()).ToList();
            }
            else
            {
                return new List<ApplicationUserModel>();
            }
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<ApplicationUserModel>> GetRequestsForUser()
        {
            var user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null)
            {
                return friendsManager.GetRequestsForUser(user).Select(u => u.ToApplicationUserModel()).ToList();
            }
            else
            {
                return new List<ApplicationUserModel>();
            }
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<ApplicationUserModel> GetCurrentFriend(string name, string surname)
        {
            var thisUser = await userManager.GetUserAsync(HttpContext.User);
            return friendsManager.GetFriends(thisUser).FirstOrDefault(x => x.Surname == x.Surname && x.Name == name).ToApplicationUserModel();
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<ApplicationUserModel>> Search(string query)
        {
            var user = await userManager.GetUserAsync(HttpContext.User);

            var users = dBContext.Users.ToList();
            var queryResult = friendsManager.GetOthers(user, users).
                Select(u => new
                {
                    user = u,
                    comparisonResult = (u.Name + " " + u.Surname).IndexOf(query)
                }).
                OrderBy(x => x.comparisonResult).
                Take(searchResults).
                Where(x => x.comparisonResult >= 0).
                Select(x => x.user.ToApplicationUserModel()).ToList();

            return queryResult;
        }
    }
}