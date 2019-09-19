using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WAVC_WebApi.Models;
using WAVC_WebApi_UnitTests.Mocks;

namespace WAVC_WebApi_UnitTests.Helpers
{
    class UserManagerMockHelper
    {
        public static Mock<UserMangerMock> VerifyUserByEmailOrUsernameSuccessful(ApplicationUser correctUser, string email, string username, string password)
        {
            return new UserMangerMock.Builder()
                .With(x =>
                {
                    x.Setup(foo => foo.FindByEmailAsync(email))
                    .Returns(Task.FromResult(correctUser));

                    x.Setup(foo => foo.FindByNameAsync(username))
                    .Returns(Task.FromResult(correctUser));

                    x.Setup(foo => foo.CheckPasswordAsync(It.IsAny<ApplicationUser>(), password))
                    .Returns(Task.FromResult(true));
                })
                .Build();
        }
    }
}
