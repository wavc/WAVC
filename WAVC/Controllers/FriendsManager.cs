using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using WAVC.Models;

namespace WAVC.Controllers
{
    public class FriendsManager
    {
        DbContext dBContext;
        public FriendsManager(DbContext ctx)
        {
            dBContext = ctx;
        }

        List<Friend> Get(ApplicationUser user, Expression<Func<ApplicationUser, IEnumerable<Friend>>> property, bool friendship)
        {
            if (user == null)
                return new List<Friend>();

            new ReferenceLoader<ApplicationUser>(new List<ApplicationUser>() { user }, dBContext).
             LoadCollection(property);

            var func = property.Compile();

            Expression<Func<Friend, ApplicationUser>> which = func(user) == user.Friends ?
                (Expression<Func<Friend, ApplicationUser>>)(x => x.Whose) : (x => x.Who);

            new ReferenceLoader<Friend>((ICollection<Friend>)func(user), dBContext).
                LoadReference(x => x.FriendA).
                LoadReference(x => x.FriendB).
                LoadReference(which);

            var requests = func(user).
                Where(x => (x.Friendship != null) == friendship).
                ToList();

            return requests;
        }

        public List<ApplicationUser> GetFriends(ApplicationUser user)
        {

            var friends = Get(user, u => u.Friends, true).
                Select(x => x.Whose).ToList();

            return friends;
        }
        public List<ApplicationUser> GetUserRequests(ApplicationUser user)
        {
            var requests = Get(user, u => u.Friends, false).
                Select(x => x.Whose).ToList();

            return requests;
        }
        public List<ApplicationUser> GetRequestsForUser(ApplicationUser user)
        {
            var otherRequests = Get(user, u => u.WhoseFriend, false).
                Select(x => x.Who).ToList();

            return otherRequests;
        }

        public List<ApplicationUser> GetOthers(ApplicationUser user, List<ApplicationUser> allUsers)
        {
            var myFriends = GetFriends(user);
            var otherRequests = GetRequestsForUser(user);
            var myRequests = GetUserRequests(user);
            var others = allUsers.Where(x => x != user).Except(otherRequests).Except(myRequests).Except(myFriends).ToList();
            return others;
        }

        public async Task CreateRequestAsync(ApplicationUser I, ApplicationUser friend)
        {
            var request = new Friend() { Who = I, Whose = friend };

            dBContext.Add(request);
            await dBContext.SaveChangesAsync();
        }

        public async Task RejectRequestAsync(ApplicationUser I, ApplicationUser friend)
        {
            if (I == null || friend == null)
                throw new ArgumentNullException();
            var request = GetRequestsForUser(I).FirstOrDefault(x => x == friend);
            if (request == null)
                throw new NullReferenceException();

            dBContext.Remove(request);
            await dBContext.SaveChangesAsync();
        }
        public async Task AcceptRequestAsync(ApplicationUser I, ApplicationUser friend)
        {
            if (I == null || friend == null)
                throw new ArgumentNullException();
            var request = Get(I, u => u.WhoseFriend, false).Find(x => x.Who == friend);
            if (request == null)
                throw new NullReferenceException();

            var accept = new Friend() { Who = I, Whose = friend };
            var friendship = new Friendship() { A = request, B = accept };
            dBContext.Add(accept);
            dBContext.Add(friendship);

            await dBContext.SaveChangesAsync();
        }
    }
}
