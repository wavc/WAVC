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


        [Route("Home/Index/{user}")]
        public async Task<IActionResult> Index(string user)
        {
            var thisUser = await userManager.GetUserAsync(HttpContext.User);
            var friend = dBContext.Users.Find(user);

            if (thisUser != null && friendsManager.GetRequestsForUser(thisUser).Contains(friend))
            {
                //show conversation with this user (prolly js should download that)
                return await Index();
            }

            return RedirectToAction(nameof(Error));
        }

        public async Task<JsonResult> Search(string query)
        {
            var user = await userManager.GetUserAsync(HttpContext.User);

            var users = dBContext.Users.ToList();
            var queryResult = friendsManager.GetOthers(user, users).
                Select(u => new
                {
                    user = u,
                    comparisonResult = u.UserName.IndexOf(query)
                }).
                OrderBy(x => x.comparisonResult).
                Take(searchResults).
                Where(x => x.comparisonResult >= 0).
                Select(x => x.user.UserName);

            return Json(queryResult);
        }

        public async Task<IActionResult> FriendRequest(string name)
        {
            var user = await userManager.GetUserAsync(HttpContext.User);
            var selected = dBContext.Users.FirstOrDefault(x => x.UserName == name);

            if (selected != null)
                return RedirectToAction(nameof(Error));

            if (friendsManager.GetRequestsForUser(user).Contains(selected))
            {
                //selected already sent request - treat it as accept
                return await AcceptRequest(selected.Id, "yes");
            }

            if (friendsManager.GetUserRequests(user).Contains(selected))
            {
                //user already sent request - do nothing
                return RedirectToAction(nameof(Index));
            }

            await friendsManager.CreateRequestAsync(user, selected);

            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> AcceptRequest(string name, string result)
        {
            var thisUser = await userManager.GetUserAsync(HttpContext.User);
            var other = dBContext.Users.FirstOrDefault(x => x.UserName == name);
            if (result == "no")
            {
                await friendsManager.RejectRequestAsync(thisUser, other);
            }
            else
            {
                await friendsManager.AcceptRequestAsync(thisUser, other);
            }

            return RedirectToAction(nameof(Index));
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
