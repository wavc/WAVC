using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models.HelperModels
{
    public class ApplicationUserFormModel
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public IFormFile ProfilePictureUrl { get; set; }
    }
}
