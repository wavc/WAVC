using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WAVC_WebApi.Controllers.Common;
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
           public const string USER_NOT_FOUND = "Following user does not exist in a database.";
           public const string SEND_NOT_FRIEND = "You cannot send message to this user. Please send a friend request first.";
           public const string RECIEVE_NOT_FRIEND = "You cannot get message from conversation with this user. Please send a friend request first.";
        }

        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly PredefinedQueries  _queries;

        public MessagesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _dbContext = context;
            _userManager = userManager;
            _queries = new PredefinedQueries(ref _dbContext);
        }

        // POST: api/Messages
        [HttpPost]
        [Authorize]
        [Route("{recieverId}")]
        public async Task<ActionResult> SendMessage([FromRoute] string recieverId, [FromBody] SendMessageModel messageModel)
        {
            string userId = User.Claims.First(c => c.Type == "UserId").Value;

            var recieverUser = await _queries.FindUserAsync(recieverId);
            if (recieverUser == null)
                return BadRequest(Messages.USER_NOT_FOUND);

            var relationship = await _queries.FindRelationshipAsync(userId, recieverId);
            if (relationship == null)
                return BadRequest(Messages.SEND_NOT_FRIEND);

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

        [HttpGet]
        [Authorize]
        [Route("{otherUserId}")]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessages(string otherUserId)
        {
            string userId = User.Claims.First(c => c.Type == "UserId").Value;

            var otherUser = await _queries.FindUserAsync(otherUserId);
            if (otherUser == null)
                return BadRequest(Messages.USER_NOT_FOUND);

            var relationship = await _queries.FindRelationshipAsync(userId, otherUserId);
            if (relationship == null)
                return BadRequest(Messages.RECIEVE_NOT_FRIEND);

            return await _queries.FindMessagesAsync(userId, otherUserId);
        }
    }
}
