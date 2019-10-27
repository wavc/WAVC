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
        private readonly DbContext _dbContext;

        public FriendsManager(DbContext ctx)
        {
            _dbContext = ctx;
        }

        private IEnumerable<Relationship> Get(ApplicationUser user, Relationship.StatusType status, Expression<Func<ApplicationUser, IEnumerable<Relationship>>> property)
        {
            if (user == null)
                return new List<Relationship>();

            var func = property.Compile();

            Expression<Func<Relationship, ApplicationUser>> which = func(user) == user.Friends ?
                (Expression<Func<Relationship, ApplicationUser>>)(x => x.RelatedUser) : (x => x.User);

            new ReferenceLoader<ApplicationUser>(user, _dbContext).
                LoadCollection(property);
            new ReferenceLoader<Relationship>((ICollection<Relationship>)func(user), _dbContext).
                LoadReference(which);

            var requests = func(user).
                Where(x => x.Status == status);

            return requests;
        }

        public List<ApplicationUser> GetFriends(ApplicationUser user)
        {
            var friends = Get(user, Relationship.StatusType.Accepted, u => u.Friends).
                Select(r => r.RelatedUser).
                Concat(
                    Get(user, Relationship.StatusType.Accepted, u => u.RelatedFriends).
                        Select(r => r.User)
                ).ToList();

            return friends;
        }

        public List<ApplicationUser> GetUserRequests(ApplicationUser user)
        {
            var requests = Get(user, Relationship.StatusType.New, u => u.Friends).
                Select(r => r.RelatedUser).ToList();

            return requests;
        }

        public List<ApplicationUser> GetRequestsForUser(ApplicationUser user)
        {
            var requests = Get(user, Relationship.StatusType.New, u => u.RelatedFriends).
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
            var request = new Relationship() { User = I, RelatedUser = friend, Status = Relationship.StatusType.New };

            _dbContext.Add(request);

            await _dbContext.SaveChangesAsync();
        }

        public async Task RejectRequestAsync(ApplicationUser I, ApplicationUser friend)
        {
            if (I == null || friend == null)
                throw new ArgumentNullException();

            var request = Get(I, Relationship.StatusType.New, u => u.RelatedFriends).FirstOrDefault(x => x.User == friend);

            if (request == null)
                throw new NullReferenceException();

            _dbContext.Remove(request);

            await _dbContext.SaveChangesAsync();
        }

        public async Task AcceptRequestAsync(ApplicationUser I, ApplicationUser friend)
        {
            if (I == null || friend == null)
                throw new ArgumentNullException();

            var request = Get(I, Relationship.StatusType.New, u => u.RelatedFriends).FirstOrDefault(x => x.User == friend);

            if (request == null)
                throw new NullReferenceException();

            request.Status = Relationship.StatusType.Accepted;
            _dbContext.Update(request);

            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> DeleteFriendAsync(ApplicationUser I, ApplicationUser friend)
        {
            var a = Get(I, Relationship.StatusType.Accepted, u => u.Friends).
                   Concat(
                       Get(I, Relationship.StatusType.Accepted, u => u.RelatedFriends)
                   ).FirstOrDefault(x => x.RelatedUser == friend);

            if (a == null)
                return false;

            _dbContext.Remove(a);

            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}