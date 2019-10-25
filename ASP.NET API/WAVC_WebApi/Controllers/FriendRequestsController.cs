using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
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
    public class FriendRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly FriendsManager _friendsManager;
        private readonly IHubContext<FriendRequestHub, IFriendRequestClient> _friendRequestHubContext;
        private readonly int _searchResults = 10;

        public FriendRequestsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IHubContext<FriendRequestHub, IFriendRequestClient> hubContext)
        {
            _dbContext = context;
            _userManager = userManager;
            _friendRequestHubContext = hubContext;
            _friendsManager = new FriendsManager(context);
        }

        // GET: api/FriendRequests
        [HttpGet]
        public async Task<IEnumerable<ApplicationUserModel>> GetFriendRequests()
        {
            var sender = await _userManager.GetUserAsync(HttpContext.User);

            return _friendsManager.GetRequestsForUser(sender).Select(u => new ApplicationUserModel(u)).ToList();
        }

        [HttpPost]
        [Route("{id}")]
        //POST api/FriendRequest/{id}
        public async Task<IActionResult> SendFriendRequest(string id)
        {
            var sender = await _userManager.GetUserAsync(HttpContext.User);
            var reciever = await _userManager.FindByIdAsync(id);

            if (reciever == null)
            {
                //TODO handle if reciver does not exist
                //how to handle it? It shouldn't happen, so I guess returning BadRequest is enough
                return BadRequest();
            }

            if (sender.Id == reciever.Id)
            {
                //TODO handle if sender wants to send FR to oneself
                //how to handle it? It shouldn't happen, so I guess returning BadRequest is enough
                return BadRequest();
            }

            if (_friendsManager.GetRequestsForUser(sender).Contains(reciever))
            {
                // selected already sent request - treat it as accept
                await SendFriendRequestResponse(reciever.Id, true);
                return Ok();
            }

            if (_friendsManager.GetUserRequests(sender).Contains(reciever))
            {
                // user already sent request - do nothing
                return Ok();
            }

            await _dbContext.Relationships.AddAsync(new Relationship()
            {
                User = sender,
                RelatedUser = reciever,
                Status = Relationship.StatusType.New
            });

            await _dbContext.SaveChangesAsync();
            await _friendRequestHubContext.Clients.User(id).FriendRequestSent(new ApplicationUserModel(sender));

            return Ok();
        }

        [HttpPost]
        [Route("Response/{id}/{accept}")]
        public async Task<IActionResult> SendFriendRequestResponse(string id, bool accept)
        {
            var sender = await _userManager.GetUserAsync(HttpContext.User);
            var reciever = await _userManager.FindByIdAsync(id);
            try
            {
                if (accept)
                {
                    await _friendsManager.AcceptRequestAsync(sender, reciever);
                    await _friendRequestHubContext.Clients.User(reciever.Id).SendFreiendRequestResponse(new ApplicationUserModel(sender));
                }
                else
                {
                    await _friendsManager.RejectRequestAsync(sender, reciever);
                }
            }
            catch (ArgumentNullException)
            {
                // there is no such user
                return BadRequest();
            }
            catch (NullReferenceException)
            {
                // there is no request to be accepted/rejected
                return BadRequest();
            }
            return Ok();
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
                    comparisonResult = (u.FirstName + " " + u.LastName).IndexOf(query)
                }).
                OrderBy(x => x.comparisonResult).
                Take(_searchResults).
                Where(x => x.comparisonResult >= 0).
                Select(x => new ApplicationUserModel(x.user)).ToList();

            return queryResult;
        }
    }
}