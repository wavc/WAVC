using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class FriendsManagerController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ApplicationDbContext dbContext;
        private readonly FriendsManager friendsManager;
        private readonly int searchResults = 10;

        public FriendsManagerController(UserManager<ApplicationUser> userManager, ApplicationDbContext dBContext)
        {
            this.userManager = userManager;
            this.dbContext = dBContext;
            friendsManager = new FriendsManager(dBContext);
        }

        [HttpGet]
        [Route("Friends")]
        public async Task<List<ApplicationUserModel>> GetFriends()
        {
            var sender = await userManager.GetUserAsync(HttpContext.User);
            if (sender != null)
            {
                return friendsManager.GetFriends(sender).Select(u => u.ToApplicationUserModel()).ToList();
            }
            else
            {
                return new List<ApplicationUserModel>();
            }
        }

        [HttpGet]
        [Route("RequestsForUser")]
        public async Task<List<ApplicationUserModel>> GetRequestsForUser()
        {
            var sender = await userManager.GetUserAsync(HttpContext.User);
            if (sender != null)
            {
                return friendsManager.GetRequestsForUser(sender).Select(u => u.ToApplicationUserModel()).ToList();
            }
            else
            {
                return new List<ApplicationUserModel>();
            }
        }

        [HttpGet]
        [Route("CurrentFriend")]
        public async Task<ApplicationUserModel> GetCurrentFriend(string name, string surname)
        {
            var sender = await userManager.GetUserAsync(HttpContext.User);
            return friendsManager.GetFriends(sender).FirstOrDefault(x => x.Surname == x.Surname && x.Name == name).ToApplicationUserModel();
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<ApplicationUserModel>> Search(string query)
        {
            var sender = await userManager.GetUserAsync(HttpContext.User);

            var users = dbContext.Users.ToList();
            var queryResult = friendsManager.GetOthers(sender, users).
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