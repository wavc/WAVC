using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WAVC_WebApi.Data;
using WAVC_WebApi.Hubs.Interfaces;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Hubs
{
    [Authorize]
    class VirtualBoardHub : Hub<IVirtualBoardClient>
    {
        private static Dictionary<string, int> _onlineClientCounts = new Dictionary<string, int>();

        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;


        public VirtualBoardHub(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task SendOnMouseDragEvent(int conversationId, string id, object[] data)
        {
            await Clients.Groups(conversationId.ToString()).SendOnMouseDragEvent(conversationId, id, data);
        }

        public async Task SendOnMouseDownEvent(int conversationId, string userId, object[] data)
        {
            await Clients.Groups(conversationId.ToString()).SendOnMouseDownEvent(conversationId, userId, data);
        }

        public async Task SendOnMouseUpEvent(int conversationId, string userId, object[] data)
        {
            await Clients.Groups(conversationId.ToString()).SendOnMouseUpEvent(conversationId, userId, data);
        }

        public async Task SendEntireBoardToConnectionId(string connectionId, object board)
        {
            await Clients.Client(connectionId).SendEntireBoard(board);
        }

        public async Task JoinVirtualBoardSession(int conversationId)
        {
            var user = await _userManager.FindByIdAsync(Context.User.Identity.Name);
            var aucs = _dbContext.ApplicationUserConversations.Where(auc => auc.ConversationId == conversationId);
            if (aucs.Any(auc => auc.UserId == user.Id))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
                await Clients.OthersInGroup(conversationId.ToString()).RequestSendVirtualBoard(Context.ConnectionId);
            }
        }
    }
}