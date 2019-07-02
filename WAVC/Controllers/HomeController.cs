using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WAVC.Data;
using WAVC.Models;

namespace WAVC.Controllers
{
    public class HomeController : Controller
    {
        UserManager<ApplicationUser> userManager;
        ApplicationDbContext dBContext;
        public HomeController(UserManager<ApplicationUser> userManager, ApplicationDbContext dBContext)
        {
            this.userManager = userManager;
            this.dBContext = dBContext;
        }

        public async Task<IActionResult> Index()
        {

            var user = await userManager.GetUserAsync(HttpContext.User);
            //friends
            if (user != null)
            {
                dBContext.Entry(user).Collection(x => x.Friends).Load();
                dBContext.Entry(user).Collection(x => x.WhoseFriend).Load();
                foreach (var friend in user.Friends)
                {
                    dBContext.Entry(friend).Reference(x => x.FriendA).Load();
                    dBContext.Entry(friend).Reference(x => x.FriendB).Load();
                    dBContext.Entry(friend).Reference(x => x.Whose).Load();
                }
                foreach (var whoseFriend in user.WhoseFriend)
                {
                    dBContext.Entry(whoseFriend).Reference(x => x.FriendA).Load();
                    dBContext.Entry(whoseFriend).Reference(x => x.FriendB).Load();
                    dBContext.Entry(whoseFriend).Reference(x => x.Who).Load();
                }
                var userFriends = user.Friends.
                    Where(x => x.Friendship != null).
                    Select(x => x.Whose).
                    ToList();
                ViewBag.Friends = userFriends;

                var requests = user.WhoseFriend.
                    Where(x => x.Friendship == null).
                    Select(x => x.Who).
                    ToList();
                ViewBag.FriendRequests = requests;
            }
            else
            {
                ViewBag.FriendRequests = ViewBag.Friends = new List<ApplicationUser>();
            }

            var users = dBContext.Users.ToList();
            if (user != null)
                users = users.Where(x => x != user).ToList();
            ViewBag.Users = users;

            return View();
        }

        public async Task<IActionResult> FriendRequest(string id)
        {
            var user = await userManager.GetUserAsync(HttpContext.User);
            var selected = dBContext.Users.Find(id);
            var request = new Friend() { Who = user, Whose = selected };

            dBContext.Add(request);
            await dBContext.SaveChangesAsync();

            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> AcceptRequest(string user, string result)
        {
            var thisUser = await userManager.GetUserAsync(HttpContext.User);
            var other = dBContext.Users.Find(user);
            var request = dBContext.Friends.FirstOrDefault(x => x.Who == other && x.Whose == thisUser);
            if (result == "no")
            {
                dBContext.Remove(request);
            }
            else
            {
                var accept = new Friend() { Who = thisUser, Whose = other };
                var friendship = new Friendship() { A = request, B = accept };
                dBContext.Add(accept);
                dBContext.Add(friendship);
            }
            await dBContext.SaveChangesAsync();

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
