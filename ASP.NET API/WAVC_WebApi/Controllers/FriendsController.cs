using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAVC_WebApi.Data;
using WAVC_WebApi.Hubs;
using WAVC_WebApi.Hubs.Interfaces;
using WAVC_WebApi.Models;
using WAVC_WebApi.Models.HelperModels;

namespace WAVC_WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FriendsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly FriendsManager _friendsManager;
        private readonly IHubContext<FriendRequestHub, IFriendRequestClient> _friendRequestHubContext;
        
        public FriendsController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager, IHubContext<FriendRequestHub, IFriendRequestClient> hubContext)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _friendRequestHubContext = hubContext;
            _friendsManager = new FriendsManager(dbContext);
        }

        [HttpGet]
        public async Task<List<ApplicationUserModel>> GetFriends()
        {
            var sender = await _userManager.GetUserAsync(HttpContext.User);

            return _friendsManager.GetFriends(sender).Select(u => new ApplicationUserModel(u)).ToList();
        }

        [HttpPost]
        [Route("Delete/{id}")]
        public async Task<ActionResult> DeleteFriend(string id)
        {
            var sender = await _userManager.GetUserAsync(HttpContext.User);
            var reciever = await _userManager.FindByIdAsync(id);

            var result = await _friendsManager.DeleteFriendAsync(sender, reciever);
            if (!result)
            {
                return BadRequest();
            }
            await _friendRequestHubContext.Clients.User(reciever.Id).FriendDeleted(sender.Id);
            return Ok();
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<List<ApplicationUserModel>> Search(string query)
        {
            var sender = await _userManager.GetUserAsync(HttpContext.User);
            
            var queryResult = _friendsManager.GetFriends(sender)
                .Select(u => new
                {
                    user = u,
                    lowerName = $"{u.FirstName} {u.LastName}".ToLower()
                })
                .Where(u => u.lowerName.Contains(query.ToLower(), StringComparison.Ordinal))
                .OrderBy(x => x.lowerName.IndexOf(query.ToLower(), StringComparison.Ordinal))
                .Take(5)
                .Select(x => new ApplicationUserModel(x.user)).ToList();

            return queryResult;
        }
    }
}
