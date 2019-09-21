using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using WAVC_WebApi.Data;

namespace WAVC_WebApi_UnitTests.Mocks
{
    class DbContextInMemory
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
