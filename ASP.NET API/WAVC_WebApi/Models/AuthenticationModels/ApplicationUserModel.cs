namespace WAVC_WebApi.Models
{
    public class ApplicationUserModel
    {
        public ApplicationUserModel()
        {
        }

        public ApplicationUserModel(ApplicationUser user)
        {
            Id = user.Id;
            Name = user.Name;
            Surname = user.Surname;
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
    }
}