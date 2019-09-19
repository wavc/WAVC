using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models
{
    public class FriendRequest
    {
        public enum StatusType
        {   
            New,
            Rejected,
            Accepted
        }
        public int FriendRequestId { get; set; }
        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }
        public string FriendId { get; set; }
        public virtual ApplicationUser Friend { get; set; }
        public StatusType Status { get; set; }
    }
}
