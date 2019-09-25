using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WAVC_WebApi.Models;
using WAVC_WebApi.Models.AuthenticationModels;

namespace WAVC_WebApi.Controllers.Identity
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;

        public LoginController(SignInManager<ApplicationUser> signInManager)
        {
            _signInManager = signInManager;
        }

        [HttpPost]
        public async Task<IActionResult> SignIn(LoginModel input)
        {
            var result = await _signInManager.PasswordSignInAsync(input.Email, input.Password, input.RememberMe, lockoutOnFailure: true);
            if (!result.Succeeded)
            {
                return BadRequest();
            }

            return Ok();
        }

        // thanks to setting cookies to not be httpOnly we can do signing out locally
        // thus this isn't needed, but I'm gona keep it just in case
        [HttpPost]
        [Route("SignOut")]
        public async Task SignOut()
        {
            await _signInManager.SignOutAsync();
        }
    }
}