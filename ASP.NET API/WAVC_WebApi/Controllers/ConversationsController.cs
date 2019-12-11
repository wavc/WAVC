using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
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
    public class ConversationsController:ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly IHubContext<ConversationHub, IConversationClient> _conversationHubContext;
        private readonly MessagesController _messagesController;

        public ConversationsController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext, IHubContext<MessagesHub, IMessagesClient> messagesHubContext, IHubContext<ConversationHub, IConversationClient> conversationHubContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _conversationHubContext = conversationHubContext;
            _messagesController = new MessagesController(messagesHubContext, userManager, dbContext);
        }

        [HttpGet]
        public async Task<IActionResult> GetConversations()
        {
            var user = await _userManager.FindByIdAsync(User.Identity.Name);

            var conversations = _dbContext.ApplicationUserConversations
                .Where(auc => auc.UserId == user.Id)
                .Select(auc => auc.Conversation)
                .ToList();

            List<ConversationModel> conversationModels = new List<ConversationModel>();

            foreach (var conv in conversations)
            {
                conversationModels.Add(new ConversationModel()
                {
                    ConversationId = conv.ConversationId,
                    WasRead = true,
                    Users = _dbContext.ApplicationUserConversations
                    .Where(auc => auc.ConversationId == conv.ConversationId
                            && auc.UserId != user.Id)
                    .Select(auc => new ApplicationUserModel(auc.User))
                    .ToList()
                });
            };

            return Ok(conversationModels);
        }

        [HttpPost]
        [Route("group")]
        public async Task<IActionResult> CreateConversationForUsersWithInitialMessage([FromBody] GroupMessageModel messageModel)
        {
            var invoker = await _userManager.FindByIdAsync(User.Identity.Name);
            var allIds = new List<string>(messageModel.UserIds) {invoker.Id};
        
            var convId = FindConversationThatContainsAllIds(allIds);
            if (convId == null)
            {
                var users = new List<ApplicationUser> {invoker};
        
                foreach (var id in messageModel.UserIds)
                {
                    var us = await _userManager.FindByIdAsync(id);
                    if (us == null) 
                        return BadRequest();
                    users.Add(us);
                }
        
                await CreateConversationForUsers(users);
                convId = FindConversationThatContainsAllIds(allIds);

                await FriendRequestsController.NotifyUsersAboutNewConversation(_conversationHubContext, convId ?? default, 
                    users.Select(u =>new ApplicationUserModel(u)).ToList());

            }

            await _messagesController.SaveMessageAsync(new MessageModel()
                {
                    Content = messageModel.InitialMessage,
                    ConversationId = convId ?? default,
                    senderId = invoker.Id,
                    Type = Message.Type.Text
                },
                invoker, 
                Message.Type.Text);
          
        
            return Ok();
        }
        
        private int? FindConversationThatContainsAllIds(List<string> userIds)
        {
            var conversations = _dbContext.ApplicationUserConversations
                .GroupBy(auc => auc.ConversationId).Select(g => g.ToList());
        
            foreach (var conf in conversations)
            {
                if (conf.All(auc => userIds.Contains(auc.UserId)) && conf.Count == userIds.Count)
                {
                    return conf.First().ConversationId;
                };
            }
            return null;
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateConversation(string[] inviteeIds)
        {
            var inviter = await _userManager.FindByIdAsync(User.Identity.Name);

            var users = new List<ApplicationUser>() { inviter };

            foreach (var inviteeId in inviteeIds)
            { 
                var user = await _userManager.FindByIdAsync(inviteeId);
                if (user != null)
                    users.Add(user);
            }

            if(users.Count != inviteeIds.Count()+1)
            {
                //TODO something went wrong
                return BadRequest();
            }
            await CreateConversationForUsers(users);
            
            return Ok();
        }

        public async Task<Conversation> CreateConversationForUsers(List<ApplicationUser> users)
        {
            var conversation = new Conversation();
            foreach (var user in users)
                await _dbContext.ApplicationUserConversations
                    .AddAsync(new ApplicationUserConversation()
                    {
                        Conversation = conversation,
                        User = user
                    });

            await _dbContext.Conversations.AddAsync(conversation);
            await _dbContext.SaveChangesAsync();

            return conversation;
        }

        [HttpPost]
        [Route("{conversationId}/Add/{inviteeId}")]
        public async Task<IActionResult> AddUserToConversation(int conversationId, string inviteeId)
        {
            var inviter = await _userManager.FindByIdAsync(User.Identity.Name);

            var invitee = await _userManager.FindByIdAsync(inviteeId);
            if (invitee == null)
            {
                //TODO invitiee doesn't exist
                return NotFound();
            }

            var conversation = await _dbContext.Conversations.FindAsync(conversationId);
            if (conversation == null)
            {
                //TODO conversation doesn't exist
                return NotFound();
            }

            var conversationMembers = _dbContext.ApplicationUserConversations
                .Where(auc => auc.ConversationId == conversationId)
                .Select(auc => auc.User)
                .ToList();
            if (conversationMembers.Find(u => u.Id == inviter.Id) == null)
            {
                //TODO inviter not a member of conversation
                return BadRequest();
            }

            _dbContext.ApplicationUserConversations.Add(new ApplicationUserConversation()
            {
                UserId = inviteeId,
                ConversationId = conversationId
            });

            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
