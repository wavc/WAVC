using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using WAVC_WebApi.Controllers;
using WAVC_WebApi.Models;
using WAVC_WebApi.Models.HelperModels;
using WAVC_WebApi_UnitTests.Helpers;
using WAVC_WebApi_UnitTests.Mocks;
using Xunit;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Xunit.Abstractions;

namespace WAVC_WebApi_UnitTests
{
    public class TestMessagesController
    {
        private readonly ITestOutputHelper Output;

        public TestMessagesController(ITestOutputHelper output)
        {
            this.Output = output;
        }

        [Fact]
        public async Task TestSendMessage()
        {
            const string messageContent = "Does it work?";

            var dbContextMock = new DbContextInMemory().Build();
            var userManagerMock = new UserMangerMock.Builder().Build();

            var userA = DbContextUtlils.AddRandomUserToDbContext(ref dbContextMock);
            var userB = DbContextUtlils.AddRandomUserToDbContext(ref dbContextMock);

            var message = new SendMessageModel()
            {
                recieverId = userB.Id,
                Type = MessageType.Text,
                Content = messageContent
            };

            var messagesController = new MessagesController(dbContextMock, userManagerMock.Object);
            var baseController = (ControllerBase)messagesController;
            ControllerHelper.AddNewUserClaimToController(ref baseController, userA.Id);

            //send message to not a friend 
            var results = await messagesController.SendMessage(message);
            Assert.IsType<BadRequestObjectResult>(results);
            BadRequestObjectResult obj = (BadRequestObjectResult)results;
            Assert.Equal(obj.Value, MessagesController.Messages.NOT_A_FRIEND);

            //send message to a friend
            DbContextUtlils.SetFriendship(ref dbContextMock, userA, userB);
            results = await messagesController.SendMessage(message);
            Assert.IsType<OkResult>(results);
        }
    }
}
