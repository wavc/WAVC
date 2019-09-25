using Microsoft.EntityFrameworkCore;
using System;
using WAVC_WebApi.Data;

namespace WAVC_WebApi_UnitTests.Mocks
{
    internal class DbContextInMemory
    {
        private DbContextOptions<ApplicationDbContext> _options;

        public DbContextInMemory()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                      .UseInMemoryDatabase(Guid.NewGuid().ToString())
                      .Options;
        }

        public ApplicationDbContext Build()
        {
            return new ApplicationDbContext(_options);
        }
    }
}