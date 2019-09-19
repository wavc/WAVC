﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi.Models.MessengerModels
{
    public class Friend
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string ProfilePictureUri { get; set; }
    }
}
