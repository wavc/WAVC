using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WAVC_WebApi.Data;
using WAVC_WebApi.Models;

namespace WAVC_WebApi_UnitTests.Helpers
{
    public class DbContextUtlils
    {
        public static string characters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
        public static string hex = "0123456789abcdef";

        public static string[] firstNames = { "Aron", "Abdul", "Abe", "Abel", "Abraham", "Adam", "Adan", "Adolfo", "Adolph",
                                            "adrian","Barrett","Ishaan", "Samuel", "Emerson", "Nehemiah", "Lorenzo","Flynn"};

        public static string[] lastNames = {  "Abbott", "Acosta", "Ddams", "Adkins", "Aguilar","Nevarez", "Neville ", "New", "Newberry",
                                            "Newby", "Newcomb", "Newell", "Newkirk", "Newman","Newsom", "Newsome", "Newton", "Ng", "Ngo",
                                            "Nguyen", "Nicholas", "Nichols", "Nicholson", "Nickel" };

        public static Relationship SetFriendship(ref ApplicationDbContext dbContext, ApplicationUser userA, ApplicationUser userB)
        {
            var relationship = new Relationship()
            {
                User = userA,
                RelatedUser = userB
            };
            dbContext.Relationships.Add(relationship);

            return relationship;
        }

        public static ApplicationUser AddRandomUserToDbContext(ref ApplicationDbContext dbContext)
        {
            var user = GenerateRandomUser();
            dbContext.Users.Add(user);

            return user;
        }

        public static List<ApplicationUser> AddRandomUsersToDbContext(ref ApplicationDbContext dbContext,  int count)
        {
            List<ApplicationUser> users = new List<ApplicationUser>();
            for (int i = 0; i < count; i++)
            {
                var newUser = GenerateRandomUser();
                users.Add(newUser);
                dbContext.Users.Add(newUser);
            }

            return users;
        }

        public static ApplicationUser GenerateRandomUser()
        {
            var random = new Random();

            return new ApplicationUser()
            {
                Id = GenerateRandomId(),
                FirstName = firstNames[random.Next(firstNames.Length)],
                LastName = lastNames[random.Next(lastNames.Length)],
                Email = GenerateRandomEmail(),
                PhoneNumber = GenerateRandomPhoneNumber(),
                UserName = firstNames[random.Next(firstNames.Length)] += random.Next(100).ToString()
            };
        }

        private static string GenerateRandomEmail()
        {
            var random = new Random();
            var email = new string(Enumerable.Repeat(characters, random.Next(3, 10))
                .Select(s => s[random.Next(s.Length)]).ToArray());

            return email + "@wavc.com";
        }

        private static string GenerateRandomPhoneNumber()
        {
            var random = new Random();
            string phoneNumber = string.Empty;
            for (int i = 0; i < 9; i++)
                phoneNumber += random.Next(9).ToString();

            return phoneNumber;
        }

        private static string GenerateRandomId()
        {
            var random = new Random();

            string id = string.Empty;
            for (int i = 0; i < 8; i++)
                id += hex[random.Next(hex.Length)];

            for (int i = 0; i < 3; i++)
            {
                id += '-';
                for (int j = 0; j < 4; j++)
                    id += hex[random.Next(hex.Length)];
            }

            id += '-';
            for (int i = 0; i < 12; i++)
                id += hex[random.Next(hex.Length)];

            return id;
        }
    }
}
