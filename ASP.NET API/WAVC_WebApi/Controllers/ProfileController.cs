using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WAVC_WebApi;
using WAVC_WebApi.Models;
using WAVC_WebApi.Models.HelperModels;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WAVC_WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        // GET: api/<controller>
        [HttpGet]
        public async Task<ApplicationUserModel> GetAsync()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            return new ApplicationUserModel(user);
        }

        // POST api/<controller>
        [HttpPost]
        public async Task PostAsync([FromForm]ApplicationUserFormModel userModel)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            user.FirstName = userModel.FirstName;
            user.LastName = userModel.LastName;
            if(userModel.ProfilePicture != null)
            {
                if(user.ProfilePictureUrl != "/images/profiles/default.jpg")
                {
                    System.IO.File.Delete("wwwroot/" + user.ProfilePictureUrl);
                }
                user.ProfilePictureUrl = "/images/profiles/" + user.Id + Path.GetExtension(userModel.ProfilePicture.FileName);

                await userModel.ProfilePicture.SaveFileAsync(user.ProfilePictureUrl);
            }
            await _userManager.UpdateAsync(user);
        }


    }
}
