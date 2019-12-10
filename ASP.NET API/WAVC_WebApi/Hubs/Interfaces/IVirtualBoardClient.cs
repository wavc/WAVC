using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query.ExpressionVisitors.Internal;

namespace WAVC_WebApi.Hubs.Interfaces
{
    public interface IVirtualBoardClient
    {
//        Task SendBoardChange(string connectionId, string userId, object board, object boardEvent);

        Task SendOnMouseDragEvent(int conversation, string userId, object[] data);

        Task SendOnMouseDownEvent(int conversation, string userId, object[] data);

        Task SendOnMouseUpEvent(int conversation, string userId, object[] data);
        
        Task SendEntireBoardToConnectionId(string connectionId, object board);

        Task SendEntireBoard(object board);

        Task RequestSendVirtualBoard(string connectionId);

        Task JoinVirtualBoardSession(int conversationId);
    }
}