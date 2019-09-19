using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using WAVC_WebApi.Models;

namespace WAVC_WebApi_UnitTests.Mocks
{
    public class ApplicationSettingsMock
    {
        ApplicationSettings applicationSettings = new ApplicationSettings() {
            JWTSecret= "1234567890123456",
            ClientUrl="https://localhost:4200"
        };
        Mock<IOptions<ApplicationSettings>> _mock = new Mock<IOptions<ApplicationSettings>>();

        public ApplicationSettingsMock()
        {
            _mock.Setup(appSet => appSet.Value).Returns(applicationSettings);
        }

        public Mock<IOptions<ApplicationSettings>> Build()
        {
            return _mock;
        }
    }
}
