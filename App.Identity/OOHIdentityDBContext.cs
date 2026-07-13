using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OOH.Identity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Identity
{
    public class OOHIdentityDBContext : IdentityDbContext<ApplicationUser, IdentityRole,string>
    {
        public OOHIdentityDBContext()
        {

        }

        public OOHIdentityDBContext(DbContextOptions<OOHIdentityDBContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder
        .LogTo(Console.WriteLine)
        .EnableSensitiveDataLogging();

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured)
        //    {

        //      //  var connectionString = configuration.GetConnectionString("DbCoreConnectionString");
        //        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=PostDB@123;Database=learning_db");
        //    }
        //}

    }
}
