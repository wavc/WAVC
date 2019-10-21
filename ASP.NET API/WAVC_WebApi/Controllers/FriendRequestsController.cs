using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
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
        private readonly IHubContext<FriendRequestHub, IFriendRequestClient> _friendRequestHubContext;

        public FriendRequestsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IHubContext<FriendRequestHub, IFriendRequestClient> hubContext)
        {
            _dbContext = context;
            _userManager = userManager;
            _friendRequestHubContext = hubContext;
        }


        // GET: api/FriendRequests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Object>>> GetFriendRequests()
        {
            var user = await _userManager.FindByIdAsync(User.Identity.Name);
            //TODO return a list of user's friends' requests

            return Ok();
        }

        [HttpPost]
        [Route("{id}")]
        //POST api/FriendRequest/{id}
        public async Task<IActionResult> SendFriendRequest(string id)
        {
            var sender = await _userManager.FindByIdAsync(User.Identity.Name);

            var reciever = await _userManager.FindByIdAsync(id);
            if (reciever == null)
            {
                //TODO handle if reciver does not exist
                return BadRequest();
            }

            if (sender.Id == reciever.Id)
            {
                //TODO handle if sender wants to send FR to oneself
                return BadRequest();
            }

            //TODO check if there is already a Relationship in a database
            //Code bellow will throw an exception but only if there is a relationship
            //with this particual key order. Check if relationship(reciver.id, sender.id)
            //exists.

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
    }
}
