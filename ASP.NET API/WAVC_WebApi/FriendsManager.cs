using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using WAVC_WebApi.Models;

namespace WAVC_WebApi
{
    public class FriendsManager
    {
        private DbContext dBContext;

        public FriendsManager(DbContext ctx)
        {
            dBContext = ctx;
        }

        private IEnumerable<Relationship> Get(ApplicationUser user, Relationship.Status status, Expression<Func<ApplicationUser, IEnumerable<Relationship>>> property)
        {
            if (user == null)
                return new List<Relationship>();

            new ReferenceLoader<ApplicationUser>(user, dBContext).
             LoadCollection(property);

            var func = property.Compile();

            var requests = func(user).
                Where(x => x.RelationStatus == status);

            return requests;
        }

        public List<ApplicationUser> GetFriends(ApplicationUser user)
        {
            var friends = Get(user, Relationship.Status.Accepted, u => u.Friends).
                Select(r => r.RelatedUser).
                Concat(
                    Get(user, Relationship.Status.Accepted, u => u.RelatedFriends).
                        Select(r => r.User)
                ).ToList();

            return friends;
        }

        public List<ApplicationUser> GetUserRequests(ApplicationUser user)
        {
            var requests = Get(user, Relationship.Status.RequestFromUser, u => u.Friends).
                Select(r => r.RelatedUser).ToList();

            return requests;
        }

        public List<ApplicationUser> GetRequestsForUser(ApplicationUser user)
        {
            var requests = Get(user, Relationship.Status.RequestFromUser, u => u.RelatedFriends).
                Select(r => r.User).ToList();

            return requests;
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
            var request = new Relationship() { User = I, RelatedUser = friend, RelationStatus = Relationship.Status.RequestFromUser };

            dBContext.Add(request);

            await dBContext.SaveChangesAsync();
        }

        public async Task RejectRequestAsync(ApplicationUser I, ApplicationUser friend)
        {
            if (I == null || friend == null)
                throw new ArgumentNullException();

            var request = Get(I, Relationship.Status.RequestFromUser, u => u.RelatedFriends).FirstOrDefault(x => x.User == friend);

            if (request == null)
                throw new NullReferenceException();

            dBContext.Remove(request);

            await dBContext.SaveChangesAsync();
        }

        public async Task AcceptRequestAsync(ApplicationUser I, ApplicationUser friend)
        {
            if (I == null || friend == null)
                throw new ArgumentNullException();

            var request = Get(I, Relationship.Status.RequestFromUser, u => u.RelatedFriends).FirstOrDefault(x => x.User == friend);

            if (request == null)
                throw new NullReferenceException();

            request.RelationStatus = Relationship.Status.Accepted;
            dBContext.Update(request);

            await dBContext.SaveChangesAsync();
        }

        public async Task<bool> DeleteFriendAsync(ApplicationUser I, ApplicationUser friend)
        {
            var a = Get(I, Relationship.Status.Accepted, u => u.Friends).
                   Concat(
                       Get(I, Relationship.Status.Accepted, u => u.RelatedFriends)
                   ).FirstOrDefault(x => x.RelatedUser == friend);

            if (a == null)
                return false;

            dBContext.Remove(a);

            await dBContext.SaveChangesAsync();
            return true;
        }
    }
}