using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WAVC_WebApi.Models;

namespace WAVC_WebApi.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public new DbSet<ApplicationUser> Users { get; set; }
        public DbSet<Relationship> Relationships { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Relationship>()
                .HasKey(r => new { r.UserId, r.RelatedUserId });

            base.OnModelCreating(modelBuilder);
        }
    }
}