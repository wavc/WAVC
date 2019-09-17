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
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationUserController : ControllerBase
    {
        UserManager<ApplicationUser> userManager;
        ApplicationDbContext dBContext;
        FriendsManager friendsManager;
        int searchResults = 10;

        public ApplicationUserController(UserManager<ApplicationUser> userManager, ApplicationDbContext dBContext)
        {
            this.userManager = userManager;
            this.dBContext = dBContext;
            friendsManager = new FriendsManager(dBContext);
        }

        public async Task<List<ApplicationUserModel>> GetFriends()
        {
            var user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null)
            {

                return friendsManager.GetFriends(user).Select(u => u.ToApplicationUserModel()).ToList();
            }
            else
            {
                return new List<ApplicationUserModel>();
            }
        }
        public async Task<List<ApplicationUserModel>> GetRequestsForUser()
        {
            var user = await userManager.GetUserAsync(HttpContext.User);
            if (user != null)
            {
                return friendsManager.GetRequestsForUser(user).Select(u => u.ToApplicationUserModel()).ToList();
            }
            else
            {
                return new List<ApplicationUserModel>();
            }
        }

        public async Task<ApplicationUserModel> GetCurrentFriend(string name, string surname)
        {
            var thisUser = await userManager.GetUserAsync(HttpContext.User);
            return friendsManager.GetFriends(thisUser).FirstOrDefault(x => x.Surname == x.Surname && x.Name == name).ToApplicationUserModel();
        }

        public async Task<List<ApplicationUserModel>> Search(string query)
        {
            var user = await userManager.GetUserAsync(HttpContext.User);

            var users = dBContext.Users.ToList();
            var queryResult = friendsManager.GetOthers(user, users).
                Select(u => new
                {
                    user = u,
                    comparisonResult = (u.Name + " " + u.Surname).IndexOf(query)
                }).
                OrderBy(x => x.comparisonResult).
                Take(searchResults).
                Where(x => x.comparisonResult >= 0).
                Select(x => x.user.ToApplicationUserModel()).ToList();

            return queryResult;
        }

        [HttpPost]
        [Route("Login")]
        //POST : /api/ApplicationUser/Login
        public async Task<IActionResult> Login(LoginModel model) //TO CHECK AND COMPARE WITH Controllers\Identity\LoginController!
        {

            ApplicationUser user = IsValidEmail(model.UserNameOrEmail) 
                ? await _userManager.FindByEmailAsync(model.UserNameOrEmail) 
                : await _userManager.FindByNameAsync(model.UserNameOrEmail);

            if (user == null || await _userManager.CheckPasswordAsync(user, model.Password) == false)
                return BadRequest(new { message = "Username or password is incorrect." });
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("UserId", user.Id.ToString())
                }),

                Expires = DateTime.UtcNow.AddHours(6),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_applicationSettings.JWTSecret)),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(securityToken);

            return Ok(new { token });
           
        }

        bool IsValidEmail(string email) //TO DO: REMOVE IF METHOD ABOVE IS NOT NEEDED
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }

        }
    }
}