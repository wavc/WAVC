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

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly FriendsManager _friendsManager;
        private readonly IHubContext<FriendRequestHub, IFriendRequestClient> _friendRequestHubContext;
        
        public FriendsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IHubContext<FriendRequestHub, IFriendRequestClient> hubContext)
        {
            _userManager = userManager;
            _friendRequestHubContext = hubContext;
            _friendsManager = new FriendsManager(context);
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
    }
}
