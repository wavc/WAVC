namespace WAVC_WebApi.Models.HelperModels
{
    public class ApplicationUserModel
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ProfilePictureUrl { get; set; }

        public ApplicationUserModel(ApplicationUser user)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            ProfilePictureUrl = "";
        }

        public ApplicationUserModel()
        {
        }
    }
}