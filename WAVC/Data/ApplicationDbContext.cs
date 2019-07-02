using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WAVC.Models;

namespace WAVC.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public new DbSet<ApplicationUser> Users { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<Friendship> Friendships { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
            
        }

        /*protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Friend>()
                .HasOne(p => p.FriendA)
                .WithOne(i => i.A)
                .HasForeignKey<Friendship>(b => b.A);
        }*/
    }
}
