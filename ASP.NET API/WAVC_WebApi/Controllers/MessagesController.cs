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

        public MessagesController(IHubContext<MessagesHub, IMessagesClient> messagesHubContex, UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            _messagesHubContext = messagesHubContex;
            _userManager = userManager;
            _dbContext = dbContext;
        }


        [HttpGet]
        [Route("{conversationId}")]
        public async Task<IActionResult> GetAllMessagesForConversationAsync(int conversationId)
        {
            var user = await _userManager.FindByIdAsync(User.Identity.Name);
            //var conversation = await _dbContext.Conversations.FindAsync(conversationId);

            var messages = _dbContext.Messages.Where(m => m.ConversationId == conversationId);

            var messageModels = messages.Select(m => new MessageModel(m));

            return Ok(messageModels);
        }


        [HttpPost]
        public async Task<IActionResult> SendMessageAsync([FromBody] MessageModel messageModel)
        {
            var conversation = await _dbContext.Conversations.FindAsync(messageModel.ConversationId);
            var senderUser = await _userManager.FindByIdAsync(User.Identity.Name);

            if (conversation == null)
            {
                return BadRequest();
            }

            var msg = new Message()
            {
                ConversationId = messageModel.ConversationId,
                MessageType = Message.Type.Text,
                SenderUserId = senderUser.Id,
                Content = messageModel.Content
            };

            await _dbContext.Messages.AddAsync(msg);
            await _dbContext.SaveChangesAsync();

            messageModel.Type = Message.Type.Text;
            messageModel.senderId = senderUser.Id;

            await _messagesHubContext.Clients
                .Group(conversation.ConversationId.ToString())
                .MessageSent(conversation.ConversationId, messageModel);

            return Ok();
        }
    }
}
