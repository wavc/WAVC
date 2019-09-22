namespace WAVC_WebApi.Models
{
    public class Relationship
    { 
        public long RelationshipId { get; set; }

        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }
        public string RelatedUserId { get; set; }
        public virtual ApplicationUser RelatedUser { get; set; }
        public Status RelationStatus { get; set; }

        public enum Status
        {
            RequestFromUser,
            Accepted
        }
    }
}
