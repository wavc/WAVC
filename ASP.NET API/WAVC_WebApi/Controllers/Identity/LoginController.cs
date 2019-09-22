﻿using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WAVC_WebApi.Models;

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

        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> SignIn(InputModel input)
        {
            var result = await _signInManager.PasswordSignInAsync(input.Email, input.Password, input.RememberMe, lockoutOnFailure: true);
            if (result.Succeeded)
            {
                return Ok("{ \"yay\" : \"true\" }");
            }
            else
            {
                return BadRequest();
            }
        }

        //thanks to setting cookies to not be httpOnly we can do signing out locally
        //thus this isn't needed, but I'm gona keep it just in case
        [HttpPost]
        [Route("SignOut")]
        public async Task SignOut()
        {
            await _signInManager.SignOutAsync();
        }
    }
}