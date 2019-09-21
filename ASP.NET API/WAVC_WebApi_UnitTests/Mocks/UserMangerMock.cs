using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using WAVC_WebApi.Models;

namespace WAVC_WebApi_UnitTests.Mocks
{
    public class UserMangerMock : UserManager<ApplicationUser>
    {
        public UserMangerMock()
        : base(new Mock<IUserStore<ApplicationUser>>().Object,
            new Mock<IOptions<IdentityOptions>>().Object,
            new Mock<IPasswordHasher<ApplicationUser>>().Object,
            new IUserValidator<ApplicationUser>[0],
            new IPasswordValidator<ApplicationUser>[0],
            new Mock<ILookupNormalizer>().Object,
            new Mock<IdentityErrorDescriber>().Object,
            new Mock<IServiceProvider>().Object,
            new Mock<ILogger<UserManager<ApplicationUser>>>().Object)
        {
        }
        public class Builder
        {
            private Mock<UserMangerMock> _mock = new Mock<UserMangerMock>();
            public Builder With(Action<Mock<UserMangerMock>> mock)
            {
                mock(_mock);
                return this;
            }
            public Mock<UserMangerMock> Build()
            {
                return _mock;
            }
        }
    }
}
