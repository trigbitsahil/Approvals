
using OOH.Infrastructure;
using OOH.Application;
using OOH.Persistence;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using OOH.API.Services;
using OOH.Identity;
using OOH.Identity.Models;
using OOH.API.Middleware;
using OOH.Application.Contracts.Infrastructure;
using OOH.API.Filter;
using Microsoft.AspNetCore.RateLimiting;


namespace OOH.API
{
    public static class StartupExtensions
    {
        public static WebApplication ConfigureServices(
            this WebApplicationBuilder builder)
        {
            builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = long.MaxValue);

            // Initialize Firebase
            FirebaseAdmin.FirebaseApp.Create(new FirebaseAdmin.AppOptions()
            {
                Credential = Google.Apis.Auth.OAuth2.GoogleCredential.FromFile(Path.Combine(builder.Environment.ContentRootPath, "firebase-service-account.json")),
            });

            builder.Services.AddApplicationServices();
            builder.Services.AddInfrastructureServices(builder.Configuration);
            builder.Services.AddPersistenceServices(builder.Configuration);
            builder.Services.AddIdentityServices(builder.Configuration);

            builder.Services.AddScoped<ILoggedInUserService, LoggedInUserService>();

            builder.Services.AddHttpContextAccessor();
            builder.Services.AddHttpClient();

            builder.Host.UseSerilog();

            // Add services to the container.

            builder.Services.AddControllers(options =>
            {
                options.ReturnHttpNotAcceptable = true;
                options.Filters.Add<TimeZoneConversionFilter>();


            }).AddXmlDataContractSerializerFormatters();


            builder.Services.AddProblemDetails();
            //builder.Services.AddProblemDetails(options =>
            //{
            //    options.CustomizeProblemDetails = ctx =>
            //    {
            //        ctx.ProblemDetails.Extensions.Add("additionalInfo", "Additional Info Example");
            //        ctx.ProblemDetails.Extensions.Add("server", Environment.MachineName);

            //    };


            //});



            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddSingleton<FileExtensionContentTypeProvider>();


#if DEBUG


            builder.Services.AddTransient<IMailService, LocalMailService>();
#else

            builder.Services.AddTransient<IMailService, CloudMailService>();

#endif


            // builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());



            // builder.Services.AddIdentityServices(builder.Configuration);


            //builder.Services.AddAuthentication("Bearer").AddJwtBearer(options =>
            //{
            //    options.TokenValidationParameters = new()
            //    {
            //        ValidateIssuer = true,
            //        ValidateAudience = true,
            //        ValidateIssuerSigningKey = true,
            //        ValidIssuer = builder.Configuration["Authentication:Issuer"],
            //        ValidAudience = builder.Configuration["Authentication:Audience"],
            //        IssuerSigningKey = new SymmetricSecurityKey(

            //            Convert.FromBase64String(builder.Configuration["Authentication:SecretForKey"])
            //            )


            //    };
            //}
            //    );

            builder.Services.AddApiVersioning(setupAction =>
            {
                setupAction.ReportApiVersions = true;
                setupAction.AssumeDefaultVersionWhenUnspecified = true;
                setupAction.DefaultApiVersion = new ApiVersion(1, 0);
            }).AddMvc();

            builder.Services.AddRateLimiter(options =>
            {
                options.AddFixedWindowLimiter("fixed", limiterOptions =>
                {
                    limiterOptions.PermitLimit = 5; // Temporarily lowered so you can test it easily!
                    limiterOptions.Window = TimeSpan.FromMinutes(1);
                    limiterOptions.QueueProcessingOrder = System.Threading.RateLimiting.QueueProcessingOrder.OldestFirst;
                    limiterOptions.QueueLimit = 0; // Disabled queue so it rejects immediately
                });
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            });



            builder.Services.AddCors(options =>
            {
                options.AddPolicy("open", policy =>
                {
                    policy.SetIsOriginAllowed(origin => true) // Allow ngrok URLs
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });

            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy("ViteCors", policy =>
            //    {
            //        policy.WithOrigins("https://oohapi-b7eud8e8hzg0c8bp.centralindia-01.azurewebsites.net") // ✅ Vite default
            //              .AllowAnyMethod()
            //              .AllowAnyHeader()
            //              .AllowCredentials(); // ✅ REQUIRED
            //    });
            //});

       

            return builder.Build();


        }


        public static WebApplication ConfigurePipeline(this WebApplication app)
        {

            app.MapGroup("api/v{version:apiVersion}/identity")
               .MapIdentityApi<ApplicationUser>()
               .RequireRateLimiting("fixed");


            if (!app.Environment.IsDevelopment())
            {
                // app.UseExceptionHandler();
                app.UseDeveloperExceptionPage();
                app.UseHsts();
            }
            app.UseDefaultFiles();
            app.UseStaticFiles();
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseRateLimiter();

            app.UseCors("open");


            app.UseAuthentication();

            app.UseAuthorization();

            //app.MapControllers();

            app.UseCustomMiddlewareHandler();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


            // app.MapIdentityApi<ApplicationUser>();

            app.MapPost("/Logout", async (ClaimsPrincipal user, SignInManager<ApplicationUser> signInManager) =>
            {
                await signInManager.SignOutAsync();
                return TypedResults.Ok();
            });

           // app.UseCors("ViteCors");

            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI();
            //}





            return app;
        }
    }
}
