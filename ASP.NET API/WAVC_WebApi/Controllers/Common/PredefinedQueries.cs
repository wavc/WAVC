using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Controllers.Common
{
    public class PredefinedQueries
    {
        private readonly ApplicationDbContext _dbContext;
        public PredefinedQueries(ref ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Message>> FindMessagesAsync(string userId, string otherUserId)
        {
            return await _dbContext.Messages
                .Where(m => (m.SenderUserId == userId || m.SenderUserId == otherUserId))
                .Where(m => (m.RecieverUserId == userId || m.RecieverUserId == otherUserId))
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }

        public async Task<Relationship> FindRelationshipAsync(string userId, string otherUserId)
        {
            var relationship = await _dbContext.Relationships.FindAsync(otherUserId, userId);
            if (relationship == null)
                relationship = await _dbContext.Relationships.FindAsync(userId, otherUserId);

            return relationship;
        }

        public async Task<ApplicationUser> FindUserAsync(string userId)
        {
            return await _dbContext.Users.FindAsync(userId);
        }
    }
}
