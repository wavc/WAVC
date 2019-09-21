using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
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
    public class SignInManagerMock:SignInManager<ApplicationUser>
    {
        public SignInManagerMock()
        : base(new Mock<UserMangerMock>().Object,
            new HttpContextAccessor(),
            new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
            new Mock<IOptions<IdentityOptions>>().Object,
            new Mock<ILogger<SignInManager<ApplicationUser>>>().Object,
            new Mock<IAuthenticationSchemeProvider>().Object)
        { 
        }

        public class Builder
        {
            private Mock<SignInManagerMock> _mock = new Mock<SignInManagerMock>();

            public Builder With(Action<Mock<SignInManagerMock>> mock)
            {
                mock(_mock);
                return this;
            }
            public Mock<SignInManagerMock> Build()
            {
                return _mock;
            }

        }
    }
}
