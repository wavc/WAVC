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

            var dbContextInMemory = new DbContextInMemory().Build();
            var userManagerMock = new UserMangerMock.Builder().Build();

            var userA = DbContextUtlils.AddRandomUserToDbContext(ref dbContextInMemory);
            var userB = DbContextUtlils.AddRandomUserToDbContext(ref dbContextInMemory);

            var message = new SendMessageModel()
            {
                Type = MessageType.Text,
                Content = messageContent
            };

            var messagesController = new MessagesController(dbContextInMemory, userManagerMock.Object);
            var baseController = (ControllerBase)messagesController;
            ControllerHelper.AddNewUserClaimToController(ref baseController, userA.Id);

            //send message to not a friend 
            var results = await messagesController.SendMessage(userB.Id, message);
            Assert.IsType<BadRequestObjectResult>(results);
            BadRequestObjectResult badRequest = (BadRequestObjectResult)results;
            Assert.Equal(badRequest.Value, MessagesController.Messages.SEND_NOT_FRIEND);

            //send message to a friend
            DbContextUtlils.SetFriendship(ref dbContextInMemory, userA, userB);
            results = await messagesController.SendMessage(userB.Id, message);

            Assert.IsType<OkResult>(results);
            Assert.Equal(dbContextInMemory.Messages.First().Content, messageContent);

            //try to send to non-existing user
            var nonExistingUser = DbContextUtlils.GenerateRandomUser();
            results = await messagesController.SendMessage(nonExistingUser.Id, new SendMessageModel());
            Assert.IsType<BadRequestObjectResult>(results);
            badRequest = (BadRequestObjectResult)results;
            Assert.Equal(badRequest.Value, MessagesController.Messages.USER_NOT_FOUND);
        }

        [Fact]
        public async Task TestGetMesseges()
        {
            var dbContextInMemory = new DbContextInMemory().Build();
            var userManagerMock = new UserMangerMock.Builder().Build();

            var userA = DbContextUtlils.AddRandomUserToDbContext(ref dbContextInMemory);
            var userB = DbContextUtlils.AddRandomUserToDbContext(ref dbContextInMemory);
            DbContextUtlils.SetFriendship(ref dbContextInMemory, userA, userB);
            DbContextUtlils.AddRandomMessages(ref dbContextInMemory, userA, userB, 10);

            var messagesControllerA = new MessagesController(dbContextInMemory, userManagerMock.Object);
            var baseControllerA = (ControllerBase)messagesControllerA;
            ControllerHelper.AddNewUserClaimToController(ref baseControllerA, userA.Id);

            var messagesControllerB = new MessagesController(dbContextInMemory, userManagerMock.Object);
            var baseControllerB = (ControllerBase)messagesControllerB;
            ControllerHelper.AddNewUserClaimToController(ref baseControllerB, userB.Id);

            //check if userA and userB can access the same messages
            var userAResponse = await messagesControllerA.GetMessages(userB.Id);
            var userBResponse = await messagesControllerB.GetMessages(userA.Id);

            var messagesA = userAResponse.Value;
            var messagesB = userBResponse.Value;

            Assert.True(messagesA.Count() == 10);
            Assert.True(messagesB.Count() == 10);
            //order of messages is important
            Assert.Equal(messagesA, messagesB);

            //userA tries to get messages from not a friend 
            var notFriend = DbContextUtlils.AddRandomUserToDbContext(ref dbContextInMemory);
            var result = await messagesControllerA.GetMessages(notFriend.Id);
            Assert.IsType<BadRequestObjectResult>(result.Result);
            var badRequest = (BadRequestObjectResult)result.Result;
            Assert.Equal(badRequest.Value, MessagesController.Messages.RECIEVE_NOT_FRIEND);


            //userA tries to get message from notexistent friend
            var nonExistentFriend = DbContextUtlils.GenerateRandomUser();
            result = await messagesControllerA.GetMessages(nonExistentFriend.Id);
            Assert.IsType<BadRequestObjectResult>(result.Result);
            badRequest = (BadRequestObjectResult)result.Result;
            Assert.Equal(badRequest.Value, MessagesController.Messages.USER_NOT_FOUND);

            //TODO  Assert user can access only theirself conversations.

        }
    }
}