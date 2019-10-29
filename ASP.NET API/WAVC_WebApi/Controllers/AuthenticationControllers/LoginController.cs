using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Controllers.AuthenticationControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationSettings _applicationSettings;

        public LoginController(
            UserManager<ApplicationUser> userManager, IOptions<ApplicationSettings> appSettings)
        {
            _userManager = userManager;
            _applicationSettings = appSettings.Value;
        }

        [HttpPost]
        //POST : /api/ApplicationUser/Login
        public async Task<IActionResult> Login(LoginModel model)
        {
            ApplicationUser user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null || await _userManager.CheckPasswordAsync(user, model.Password) == false)
                return BadRequest(new { message = "Username or password is incorrect." });

            string token = GenerateToken(user);
            string myId = user.Id;
            return Ok(new { token, myId });

        }

        private string GenerateToken(ApplicationUser user)
        {
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, user.Id),
                        new Claim(ClaimTypes.NameIdentifier, user.Id)
                    }),

                Expires = DateTime.UtcNow.AddHours(6),
                SigningCredentials = new SigningCredentials(
                                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_applicationSettings.JWTSecret)),
                                SecurityAlgorithms.HmacSha256Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(securityToken);

            return token;
        }   
    }
}