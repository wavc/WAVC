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
    }
}