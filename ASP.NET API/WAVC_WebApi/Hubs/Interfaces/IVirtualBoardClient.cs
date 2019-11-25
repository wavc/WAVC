using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query.ExpressionVisitors.Internal;

namespace WAVC_WebApi.Hubs.Interfaces
{
    public interface IVirtualBoardClient
    {
        Task SendBoardChange(string userId, object board, object boardEvent);

        Task SendOnMouseDragEvent(string userId, object[] data);

        Task SendOnMouseDownEvent(string userId, object[] data);

        Task SendOnMouseUpEvent(string userId, object[] data);

        Task NotifyUsersAboutBoardChange(string userId, object board, object boardEventType);
    }
}