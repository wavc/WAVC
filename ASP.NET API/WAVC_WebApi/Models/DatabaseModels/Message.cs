namespace WAVC_WebApi.Models
{
    public class Message
    {
        public long MessageId { get; set; }
        public string SenderUserId { get; set; }
        public ApplicationUser SenderUser { get; set; }
        public string RecieverUserId { get; set; }
        public ApplicationUser RecieverUser { get; set; }
        public string Content { get; set; }
    }
}