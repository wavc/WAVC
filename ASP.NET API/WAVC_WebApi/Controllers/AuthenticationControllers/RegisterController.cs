using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Controllers.AuthenticationControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationSettings _applicationSettings;

        public RegisterController(UserManager<ApplicationUser> userManager, IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            _applicationSettings = appSettings.Value;
        }

        [HttpPost]
        //POST : /api/Register
        public async Task<IActionResult> PostApplicationUserAsync(RegistrationModel model)
        {
            var applicationUser = new ApplicationUser()
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                ProfilePictureUrl = "/images/profiles/default.jpg"
            };

            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);

                if (!result.Succeeded)
                {
                    return Ok(new { result });
                }

                var createdUser = await _userManager.FindByNameAsync(applicationUser.UserName);
                string token = new TokenGenerator(_applicationSettings.JWTSecret).GenerateToken(createdUser);

                string myId = createdUser.Id;
                return Ok(new { result, token, myId });
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}