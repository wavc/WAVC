using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ConversationsController:ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _dbContext;

        public ConversationsController(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
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
                    LastMessage = "example last message",
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

            var conversation = new Conversation();
            foreach (var user in users)
            {
                await _dbContext.ApplicationUserConversations
                    .AddAsync(new ApplicationUserConversation()
                    {
                        Conversation = conversation,
                        User = user
                    });
            }

            await _dbContext.Conversations.AddAsync(conversation);
            await _dbContext.SaveChangesAsync();

            return Ok();
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
