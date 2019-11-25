using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using WAVC_WebApi.Data;
using WAVC_WebApi.Hubs.Interfaces;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Hubs
{
    [Authorize]
    class VirtualBoardHub : Hub<IVirtualBoardClient>
    {

        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public VirtualBoardHub(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task SendBoardChange(string id, object board, object boardEvent)
        {
//            var user = await _userManager.FindByIdAsync(Context.User.Identity.Name);
            await Clients.All.SendBoardChange(id, board, boardEvent);
        }

        public async Task SendOnMouseDragEvent(string id, object[] data)
        {
            await Clients.All.SendOnMouseDragEvent(id, data);
        }
        public async Task SendOnMouseDownEvent(string id, object[] data)
        {
            await Clients.All.SendOnMouseDownEvent(id, data);
        }
        public async Task SendOnMouseUpEvent(string id, object[] data)
        {
            await Clients.All.SendOnMouseUpEvent(id, data);
        }
    }
}
