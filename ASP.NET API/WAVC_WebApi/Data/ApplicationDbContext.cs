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
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ApplicationUserConversation> ApplicationUserConversations { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Relationship>()
                .HasKey(r => new { r.UserId, r.RelatedUserId });

            modelBuilder.Entity<ApplicationUserConversation>()
                .HasKey(auc => new { auc.UserId, auc.ConversationId });

            modelBuilder.Entity<ApplicationUserConversation>()
                .HasOne(auc => auc.User)
                .WithMany(u => u.ApplicationUserConversation)
                .HasForeignKey(auc => auc.UserId);

            modelBuilder.Entity<ApplicationUserConversation>()
                .HasOne(auc => auc.Conversation)
                .WithMany(c => c.ApplicationUserConversation)
                .HasForeignKey(auc => auc.ConversationId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
 