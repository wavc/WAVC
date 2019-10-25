namespace WAVC_WebApi.Models
{
    public class Relationship
    {
        public enum StatusType
        {
            New,
            Rejected,
            Accepted
        }

        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }
        public string RelatedUserId { get; set; }
        public virtual ApplicationUser RelatedUser { get; set; }
        public StatusType Status { get; set; }
    }
}