using Microsoft.Extensions.Options;
using Moq;
using WAVC_WebApi.Models;

namespace WAVC_WebApi_UnitTests.Mocks
{
    public class ApplicationSettingsMock
    {
        private ApplicationSettings applicationSettings = new ApplicationSettings()
        {
            JWTSecret = "1234567890123456",
            ClientUrl = "https://localhost:4200"
        };

        private Mock<IOptions<ApplicationSettings>> _mock = new Mock<IOptions<ApplicationSettings>>();

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