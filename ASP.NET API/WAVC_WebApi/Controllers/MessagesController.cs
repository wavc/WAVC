using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;
using WAVC_WebApi.Models.HelperModels;

namespace WAVC_WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        public static class Messages
        {
           public static readonly string USER_NOT_FOUND = "Following user does not exist in database.";
           public static readonly string NOT_A_FRIEND = "You cannot send message to this user. Please send a friend request first.";
        }

        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public MessagesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _dbContext = context;
            _userManager = userManager;
        }

        // POST: api/Messages
        [HttpPost]
        [Authorize]
        [Route("{recieverId}")]
        public async Task<ActionResult> SendMessage([FromRoute] string recieverId, [FromBody] SendMessageModel messageModel)
        {
            string userId = User.Claims.First(c => c.Type == "UserId").Value;

            var recieverUser = await _dbContext.Users.FindAsync(recieverId);
            if (recieverUser == null)
                return BadRequest(Messages.USER_NOT_FOUND);

            var relationship = await _dbContext.Relationships.FindAsync(userId, recieverId);
            if (relationship == null)
                return BadRequest(Messages.NOT_A_FRIEND);

            var message = new Message()
            {
                SenderUserId = userId,
                RecieverUserId = recieverId,
                Type = messageModel.Type,
                Content = messageModel.Content
            };

            await _dbContext.Messages.AddAsync(message);
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
