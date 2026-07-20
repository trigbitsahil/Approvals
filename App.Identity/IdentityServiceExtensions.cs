
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using OOH.Identity.Models;
using System.Text;
using OOH.Application.Contracts.Identity;
using OOH.Identity.Services;


namespace OOH.Identity
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
        {
            //services.AddDbContext<OOHIdentityDBContext>(options =>
            //{
            //    var connectionString = configuration.GetConnectionString("DefaultConnection");
            //    options.UseSqlServer(connectionString);
            //});



            //services
            //    .AddIdentity<ApplicationUser, ApplicationRole>(options =>
            //    {
            //        options.Stores.ProtectPersonalData = false;

            //        options.Password.RequireDigit = false;
            //        options.Password.RequireNonAlphanumeric = false;
            //        options.Password.RequireLowercase = false;
            //        options.Password.RequireUppercase = false;
            //        options.Password.RequiredUniqueChars = 0;

            //        options.SignIn.RequireConfirmedAccount = false;
            //        options.SignIn.RequireConfirmedEmail = false;
            //        options.SignIn.RequireConfirmedPhoneNumber = false;
            //    })
            //    .AddUserStore<ApplicationUserStore>()
            //    .AddRoleStore<ApplicationRoleStore>()
            //    .AddEntityFrameworkStores<OOHIdentityDBContext>()
            //    .AddDefaultTokenProviders()
            //    .AddClaimsPrincipalFactory<ApplicationClaimPrincipalFactory>();

            //services.AddScoped<IUserStore<ApplicationUser>, ApplicationUserStore>();
            //services.AddScoped<IRoleStore<ApplicationRole>, ApplicationRoleStore>();
            //services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationClaimPrincipalFactory>();



            //// Add Authentication and JwtBearer
            //services
            //    .AddAuthentication(options =>
            //    {
            //        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            //        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            //        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            //    })
            //    .AddJwtBearer(options =>
            //    {
            //        options.SaveToken = true;
            //        options.RequireHttpsMetadata = false;
            //        options.TokenValidationParameters = new TokenValidationParameters()
            //        {
            //            ValidateIssuer = true,
            //            ValidateAudience = true,
            //            ValidIssuer = configuration["JWT:ValidIssuer"],
            //            ValidAudience = configuration["JWT:ValidAudience"],
            //            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
            //        };
            //    });

            //        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            //.AddCookie();


            services.AddAuthentication("Bearer").AddJwtBearer(options =>
            {
                 
                options.TokenValidationParameters = new()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = configuration["Authentication:Issuer"],
                    ValidAudience = configuration["Authentication:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(

                        Convert.FromBase64String(configuration["Authentication:SecretForKey"])
                        )


                };
            }
                );


            //services.AddAuthentication(IdentityConstants.ApplicationScheme).AddIdentityCookies();

            services.AddAuthorizationBuilder();

           // services.AddDbContext<OOHIdentityDBContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddEntityFrameworkNpgsql().AddDbContext<OOHIdentityDBContext>(options => options.UseNpgsql(configuration["ConnectionStrings:DefaultConnection"]));
         
           //  services.AddEntityFrameworkNpgsql().AddDbContext<OOHIdentityDBContext>(options => options.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=PostDB@123;Database=learning_db"));


            //services.AddIdentityCore<ApplicationUser>()
            //    .AddEntityFrameworkStores<OOHIdentityDBContext>()
            //    .AddApiEndpoints();

            services.AddEndpointsApiExplorer();

            services.AddScoped<IUserService, UserService>();


            services.AddIdentityApiEndpoints<ApplicationUser>()
                .AddRoles<IdentityRole>()
                .AddClaimsPrincipalFactory<UserClaimsPrincipalFactory>()
                .AddEntityFrameworkStores<OOHIdentityDBContext>();


            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // ✅ REQUIRED
                options.Cookie.SameSite = SameSiteMode.None;             // ✅ REQUIRED
                options.Cookie.Path = "/";

                options.SlidingExpiration = true;
                options.ExpireTimeSpan = TimeSpan.FromHours(30000);
            });
            //AddIdentityCore<ApplicationUser>()
            //.AddEntityFrameworkStores<OOHIdentityDBContext>()
            //.AddApiEndpoints();

            //services.AddIdentity<ApplicationUser, IdentityRole>()
            //    .AddEntityFrameworkStores<OOHIdentityDBContext>()
            //    .AddApiEndpoints();

            return services;
        }
    }
}
