using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;
using WAVC_WebApi.Models.MiscellaneousModels;

namespace WAVC_WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private UserManager<ApplicationUser> _userManager;

        public FriendRequestsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        // GET: api/FriendRequests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FriendRequest>>> GetFriendRequests()
        {
            return await _context.FriendRequests.ToListAsync();
        }

        // GET: api/FriendRequests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FriendRequest>> GetFriendRequest(int id)
        {
            var friendRequest = await _context.FriendRequests.FindAsync(id);

            if (friendRequest == null)
            {
                return NotFound();
            }

            return friendRequest;
        }

        // POST: api/FriendRequests
        //[HttpPost]
        //[Authorize]
        //public async Task<ActionResult<FriendRequest>> PostFriendRequest(FriendRequest friendRequest)
        //{
        //    friendRequest.Status = FriendRequest.StatusType.New;
        //    _context.FriendRequests.Add(friendRequest);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetFriendRequest", new { id = friendRequest.FriendRequestId }, friendRequest);
        //}

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<FriendRequest>> SendFriendRequest(InvitationModel model)
        {
            string userId = User.Claims.First(c => c.Type == "UserId").Value;
            var user = await _userManager.FindByIdAsync(userId);

            if (userId == model.UserId)
                return BadRequest("User cannot send friend request to oneself");

            await _context.FriendRequests.AddAsync(new FriendRequest
            {
                UserId = userId,
                FriendId = model.UserId,
                Status = FriendRequest.StatusType.New
            });

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("{id}/accept")]
        public async Task<ActionResult<FriendRequest>> AcceptFriendRequest(int id)
        {
            try
            {
                var friendRequest = await _context.FriendRequests.FindAsync(id);

                if (friendRequest == null)
                    return NotFound();

                friendRequest.Status = FriendRequest.StatusType.Accepted;

                await _context.Relationships.AddAsync(new Relationship
                {
                    UserId = friendRequest.UserId,
                    RelatedUserId = friendRequest.FriendId,
                });

                _context.FriendRequests.Update(friendRequest);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest();
            }

            return Ok();
        }

        // DELETE: api/FriendRequests/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FriendRequest>> DeleteFriendRequest(int id)
        {
            var friendRequest = await _context.FriendRequests.FindAsync(id);
            if (friendRequest == null)
            {
                return NotFound();
            }

            _context.FriendRequests.Remove(friendRequest);
            await _context.SaveChangesAsync();

            return friendRequest;
        }

        private bool FriendRequestExists(int id)
        {
            return _context.FriendRequests.Any(e => e.FriendRequestId == id);
        }
    }
}
