using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WAVC_WebApi.Data;
using WAVC_WebApi.Hubs;
using WAVC_WebApi.Hubs.Interfaces;
using WAVC_WebApi.Models;
using Microsoft.AspNetCore.Http;

namespace WAVC_WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IHubContext<MessagesHub, IMessagesClient> _messagesHubContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _dbContext;

        public MessagesController(IHubContext<MessagesHub, IMessagesClient> messagesHubContext, UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            _messagesHubContext = messagesHubContext;
            _userManager = userManager;
            _dbContext = dbContext;
        }


        [HttpGet]
        [Route("{conversationId}")]
        public async Task<IActionResult> GetAllMessagesForConversationAsync(int conversationId)
        {
            var user = await _userManager.FindByIdAsync(User.Identity.Name);

            if (!_dbContext.ApplicationUserConversations
                .Where(auc => auc.ConversationId == conversationId)
                .Any(auc => auc.UserId == user.Id))
            {
                return BadRequest();
            }

            var messages = _dbContext.Messages.Where(m => m.ConversationId == conversationId);
            var messageModels = messages.Select(m => new MessageModel(m));

            return Ok(messageModels);
        }


        [HttpPost]
        public async Task<IActionResult> SendMessageAsync([FromBody] MessageModel messageModel)
        {
            var senderUser = await _userManager.FindByIdAsync(User.Identity.Name);

            var result = await SaveMessageAsync(messageModel, senderUser, Message.Type.Text);
            if (!result)
                return BadRequest();

            return Ok();
        }


        [HttpPost]
        [Route("Files/{id:int}")]
        public async Task<IActionResult> SendFileMessageAsync([FromForm]IEnumerable<IFormFile> files, [FromRoute] int id)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            //I chose separator as "|"  because it can't be used in a filename
            var fileNamesAsString = files.Aggregate("", (s, f) => s + (string.IsNullOrEmpty(s) ? "" : "|") + f.FileName);
            var message = new MessageModel() { 
                ConversationId = id, 
                Content= fileNamesAsString
            };

            var result = await SaveMessageAsync(message, user, Message.Type.File);
            if (!result)
                return BadRequest();

            foreach (var file in files)
            {
                await file.SaveFileAsync("conversations/" + id + "/" + file.FileName);
            }
            return Ok();
        }
        [NonAction]
        public async Task<bool> SaveMessageAsync(MessageModel messageModel, ApplicationUser user, Message.Type type)
        {
            var conversation = await _dbContext.Conversations.FindAsync(messageModel.ConversationId);

            if (conversation == null)
            {
                return false;
            }
            if (!_dbContext.ApplicationUserConversations
                .Where(auc => auc.ConversationId == conversation.ConversationId)
                .Any(auc => auc.UserId == user.Id))
            {
                return false;
            }
            var msg = new Message()
            {
                ConversationId = messageModel.ConversationId,
                MessageType = type,
                SenderUserId = user.Id,
                Content = messageModel.Content
            };
            await _dbContext.Messages.AddAsync(msg);
            await _dbContext.SaveChangesAsync();

            messageModel.Type = type;
            messageModel.senderId = user.Id;

            await _messagesHubContext.Clients
                .Group(conversation.ConversationId.ToString())
                .MessageSent(conversation.ConversationId, messageModel);
            return true;
        }
    }
}
