using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
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
            if (user != null)
            {
                //Friends
                new ReferenceLoader<ApplicationUser>(new List<ApplicationUser>() { user }, dBContext).
                    LoadCollection(x => x.Friends).
                    LoadCollection(x => x.WhoseFriend);

                new ReferenceLoader<Friend>(user.Friends, dBContext).
                    LoadReference(x => x.FriendA).
                    LoadReference(x => x.FriendB).
                    LoadReference(x => x.Whose);

                var userFriends = user.Friends.
                    Where(x => x.Friendship != null).
                    Select(x => x.Whose).
                    ToList();
                ViewBag.Friends = userFriends;

                //Friend Requests
                new ReferenceLoader<Friend>(user.WhoseFriend, dBContext).
                    LoadReference(x => x.FriendA).
                    LoadReference(x => x.FriendB).
                    LoadReference(x => x.Who);

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

            //All users except self 
            //(should not show friends)
            //(could do so that not whole list is sent, but while typying name a few users would show up, whose name starts with what has been typed)
            var users = dBContext.Users.ToList();
            if (user != null)
                users = users.Where(x => x != user).ToList();
            ViewBag.Users = users;

            return View();
        }

        [Route("Home/Index/{user}")]
        public async Task<IActionResult> Index(string user)
        {
            var thisUser = await userManager.GetUserAsync(HttpContext.User);
            var friend = dBContext.Users.Find(user);

            dBContext.Entry(thisUser).Collection(x => x.Friends).Load();

            new ReferenceLoader<Friend>(thisUser.Friends, dBContext).
                LoadReference(x => x.FriendA).
                LoadReference(x => x.FriendB).
                LoadReference(x => x.Whose);

            if (thisUser!=null && thisUser.Friends.FirstOrDefault(x => x.Whose == friend && x.Friendship != null)!=null)
            {
                //show conversation with this user (prolly js should download that)
                return await Index();
            }

            return RedirectToAction(nameof(Error));
        }

        public async Task<IActionResult> FriendRequest(string id)
        {
            var user = await userManager.GetUserAsync(HttpContext.User);
            var selected = dBContext.Users.Find(id);
            //validate if selected != null or request hasn't been sent already
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


        class ReferenceLoader<T> where T : class
        {
            ICollection<T> objs;
            DbContext ctx;
            public ReferenceLoader(ICollection<T> objs, DbContext ctx)
            {
                this.objs = objs;
                this.ctx = ctx;
            }
            public ReferenceLoader<T> LoadReference<TProperty>(Expression<Func<T, TProperty>> propertyExpression) where TProperty : class
            {
                foreach (var obj in objs)
                {
                    ctx.Entry(obj).Reference(propertyExpression).Load();
                }
                return this;
            }
            public ReferenceLoader<T> LoadCollection<TProperty>(Expression<Func<T, IEnumerable<TProperty>>> propertyExpression) where TProperty : class
            {
                foreach (var obj in objs)
                {
                    ctx.Entry(obj).Collection(propertyExpression).Load();
                }
                return this;
            }
        }
    }
}
