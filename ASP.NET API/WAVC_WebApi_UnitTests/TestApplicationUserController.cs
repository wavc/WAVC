using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WAVC_WebApi.Controllers;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;
using WAVC_WebApi_UnitTests.Mocks;
using Xunit;
using Xunit.Abstractions;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using WAVC_WebApi_UnitTests.Helpers;

namespace WAVC_WebApi_UnitTests { 

    public class TestApplicationUserController
    {

        [Fact]
        public async Task GetUsersAsync()
        {

            var correctUser = new ApplicationUser() { FirstName = "Zenek", LastName = "Martuniuk" };
            var password = "password";
            var email = "test@test.com";
            var username = "zdichu123";

            var userManagerMock = UserManagerMockHelper.VerifyUserByEmailOrUsernameSuccessful(correctUser, email, username, password);
            var signInManagerMock = new SignInManagerMock.Builder().Build();
            var applicationSettingsMock = new ApplicationSettingsMock().Build();
            var contextMock = new DbContextInMemory().Build();

            var applicationUserController = new ApplicationUserController(userManagerMock.Object, signInManagerMock.Object, contextMock, applicationSettingsMock.Object);

            Assert.IsType<OkObjectResult>(await applicationUserController.Login(new LoginModel() { UserNameOrEmail = "test@test.com", Password = "password" }));
            Assert.IsType<BadRequestObjectResult>(await applicationUserController.Login(new LoginModel() { UserNameOrEmail = "test@test.com", Password = "wrongpass" }));
            Assert.IsType<OkObjectResult>(await applicationUserController.Login(new LoginModel() { UserNameOrEmail = "zdichu123", Password = "password" }));
            Assert.IsType<BadRequestObjectResult>(await applicationUserController.Login(new LoginModel() { UserNameOrEmail = "randomUser", Password = "password" }));

        }

        [Fact]
        public void TestIsValidEmail()
        {
            Assert.True(ApplicationUserController.IsValidEmail("test@test.com"));
            Assert.False(ApplicationUserController.IsValidEmail("justRandomString"));
        }
    }
}