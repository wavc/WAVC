using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WAVC.Data;
using WAVC.Models;

namespace WAVC.Controllers
{
    public class HomeController : Controller
    {
        UserManager<ApplicationUser> userManager;
        ApplicationDbContext dBContext;
        FriendsManager friendsManager;
        int searchResults = 10;

        public HomeController(UserManager<ApplicationUser> userManager, ApplicationDbContext dBContext)
        {
            this.userManager = userManager;
            this.dBContext = dBContext;
            friendsManager = new FriendsManager(dBContext);
        }

        public async Task<IActionResult> Index()
        {
            var user = await userManager.GetUserAsync(HttpContext.User);

            if (user != null)
            {
                ViewBag.Friends = friendsManager.GetFriends(user);

                ViewBag.FriendRequests = friendsManager.GetRequestsForUser(user);
            }
            else
            {
                ViewBag.FriendRequests = ViewBag.Friends = new List<ApplicationUser>();
            }
            return View();
        }


        [Route("/{name}.{surname}")]
        [Route("Home/Index/{name}.{surname}")]
        public async Task<IActionResult> Index(string name, string surname)
        {
            var thisUser = await userManager.GetUserAsync(HttpContext.User);
            var friend = friendsManager.GetFriends(thisUser).FirstOrDefault(x => x.Surname == x.Surname && x.Name == name);

            if (thisUser != null && friend != null)
            {
                ViewBag.friend = friend;
                return await Index();
            }

            return RedirectToAction(nameof(Index), null);
        }

        public async Task<JsonResult> Search(string query)
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
                Select(x => new
                {
                    name = x.user.Name,
                    surname = x.user.Surname,
                    id = x.user.Id
                });

            return Json(queryResult);
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
