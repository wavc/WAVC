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
        public static List<Message> AddRandomMessages(ref ApplicationDbContext dbContext, ApplicationUser userA, ApplicationUser userB, int count)
        {
            var random = new Random();

            var messages = new List<Message>();
            for (int i = 0; i < count; i++)
            {
                var direction = Convert.ToBoolean(random.Next(2));
                Message message = new Message()
                {
                    SenderUserId = direction ? userA.Id : userB.Id,
                    RecieverUserId = !direction ? userA.Id : userB.Id,
                    Type = MessageType.Text,
                    Content = GenerateRandomMessageContent()
                };
                dbContext.Messages.Add(message);
                messages.Add(message);
            }

            dbContext.SaveChangesAsync();
            return messages;
        }

        public static Relationship SetFriendship(ref ApplicationDbContext dbContext, ApplicationUser userA, ApplicationUser userB)
        {
            var relationship = new Relationship()
            {
                User = userA,
                RelatedUser = userB
            };
            dbContext.Relationships.Add(relationship);
            dbContext.SaveChangesAsync();

            return relationship;
        }

        public static ApplicationUser AddRandomUserToDbContext(ref ApplicationDbContext dbContext)
        {
            var user = GenerateRandomUser();
            dbContext.Users.Add(user);
            dbContext.SaveChangesAsync();

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
            dbContext.SaveChangesAsync();

            return users;
        }

        public static string GenerateRandomMessageContent()
        {
            var random = new Random();
            var message = string.Empty;

            for (int i = 0; i < random.Next(1, 10); i++)
            {
                for (int j = 0; j < random.Next(5, 10); j++)
                {
                    message += characters[random.Next(characters.Length)];
                }
                message += " ";
            }

            return message;
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
