using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public new DbSet<ApplicationUser> Users { get; set; }
        public DbSet<Relationship> Relationships { get; set; }
        public DbSet<FriendRequest> FriendRequests { get; set; }
        public DbSet<Message> Messages { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //FriendsRequest
            modelBuilder.Entity<FriendRequest>()
                .HasOne(fr => fr.User)
                .WithMany(u => u.FriendRequests)
                .HasForeignKey(fr => fr.UserId);

            modelBuilder.Entity<FriendRequest>()
                .HasOne(fr => fr.Friend)
                .WithMany(u => u.RelatedFriendRequests)
                .HasForeignKey(fr => fr.FriendId)
                .OnDelete(DeleteBehavior.Restrict);

            //Relationship
            modelBuilder.Entity<Relationship>().HasKey(sc => new { sc.UserId, sc.RelatedUserId});

            modelBuilder.Entity<Relationship>()
                .HasOne(r => r.User)
                .WithMany(u => u.Friends)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Relationship>()
                .HasOne(r => r.RelatedUser)
                .WithMany(ru => ru.RelatedFriends)
                .HasForeignKey(r => r.RelatedUserId);

            //Message

            modelBuilder.Entity<Message>()
                .HasOne(m => m.SenderUser)
                .WithMany(su => su.MessagesSent)
                .HasForeignKey(m => m.SenderUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.RecieverUser)
                .WithMany(su => su.MessagesRecieved)
                .HasForeignKey(m => m.RecieverUserId);


            base.OnModelCreating(modelBuilder);
        }

        public DbSet<WAVC_WebApi.Models.Message> Message { get; set; }
    }
}
