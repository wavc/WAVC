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
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly FriendsManager _friendsManager;
        private readonly int _searchResults = 10;

        public FriendsManagerController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _friendsManager = new FriendsManager(dbContext);
        }

        [HttpGet]
        [Route("Friends")]
        public async Task<List<ApplicationUserModel>> GetFriends()
        {
            var sender = await _userManager.GetUserAsync(HttpContext.User);
            if (sender != null)
            {
                return _friendsManager.GetFriends(sender).Select(u => u.ToApplicationUserModel()).ToList();
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
            var sender = await _userManager.GetUserAsync(HttpContext.User);
            if (sender != null)
            {
                return _friendsManager.GetRequestsForUser(sender).Select(u => u.ToApplicationUserModel()).ToList();
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
            var sender = await _userManager.GetUserAsync(HttpContext.User);
            return _friendsManager.GetFriends(sender).FirstOrDefault(x => x.Surname == x.Surname && x.Name == name).ToApplicationUserModel();
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<ApplicationUserModel>> Search(string query)
        {
            var sender = await _userManager.GetUserAsync(HttpContext.User);

            var users = _dbContext.Users.ToList();
            var queryResult = _friendsManager.GetOthers(sender, users).
                Select(u => new
                {
                    user = u,
                    comparisonResult = (u.Name + " " + u.Surname).IndexOf(query)
                }).
                OrderBy(x => x.comparisonResult).
                Take(_searchResults).
                Where(x => x.comparisonResult >= 0).
                Select(x => x.user.ToApplicationUserModel()).ToList();

            return queryResult;
        }
    }
}