using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAVC_WebApi.Data;
using WAVC_WebApi.Hubs.Interfaces;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Hubs
{   
    [Authorize]
    public class MessagesHub : Hub<IMessagesClient>
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public MessagesHub(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public override async Task OnConnectedAsync()
        {
            var user = await _userManager.FindByIdAsync(Context.User.Identity.Name);

            var conversationIds = _dbContext.ApplicationUserConversations
                .Where(auc => auc.UserId == user.Id)
                .Select(auc => auc.ConversationId)
                .ToList();
            
            foreach(var id in conversationIds)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, id.ToString());
            }

            await base.OnConnectedAsync();
        }

        public async Task JoinConversation(int conversationId)
        {
            var user = await _userManager.FindByIdAsync(Context.User.Identity.Name);


            if (!_dbContext.ApplicationUserConversations
                .Where(auc => auc.ConversationId == conversationId)
                .Any(auc => auc.UserId == user.Id))
            {
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
        }
    }
}
