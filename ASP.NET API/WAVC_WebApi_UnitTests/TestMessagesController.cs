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
using System.Linq;

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
                Type = MessageType.Text,
                Content = messageContent
            };

            var messagesController = new MessagesController(dbContextMock, userManagerMock.Object);
            var baseController = (ControllerBase)messagesController;
            ControllerHelper.AddNewUserClaimToController(ref baseController, userA.Id);

            //send message to not a friend 
            var results = await messagesController.SendMessage(userB.Id, message);
            Assert.IsType<BadRequestObjectResult>(results);
            BadRequestObjectResult badRequest = (BadRequestObjectResult)results;
            Assert.Equal(badRequest.Value, MessagesController.Messages.NOT_A_FRIEND);

            //send message to a friend
            DbContextUtlils.SetFriendship(ref dbContextMock, userA, userB);
            results = await messagesController.SendMessage(userB.Id, message);

            Assert.IsType<OkResult>(results);
            Assert.Equal(dbContextMock.Messages.First().Content, messageContent);
            
            //try to send to non-existing user
            var nonExistingUser = DbContextUtlils.GenerateRandomUser();
            results = await messagesController.SendMessage(nonExistingUser.Id, new SendMessageModel());
            Assert.IsType<BadRequestObjectResult>(results);
            badRequest = (BadRequestObjectResult)results;
            Assert.Equal(badRequest.Value, MessagesController.Messages.USER_NOT_FOUND);
        }
    }
}
