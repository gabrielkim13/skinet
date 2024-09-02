using API.Middlewares;

using Core.Interfaces;

using Infrastructure.Data;
using Infrastructure.Services;

using Microsoft.EntityFrameworkCore;

using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddCors();
builder.Services.AddSingleton<IConnectionMultiplexer>(config =>
{
    var connectionString = builder.Configuration.GetConnectionString("Redis") ??
        throw new Exception("Cannot get Redis connection string");

    var configuration = ConfigurationOptions.Parse(connectionString, true);

    return ConnectionMultiplexer.Connect(configuration);
});
builder.Services.AddSingleton<ICartService, CartService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(opt => opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200", "https://localhost:4200"));
app.MapControllers();

try
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<StoreContext>();

    await context.Database.MigrateAsync();
    await context.SeedAsync();

}
catch (Exception ex)
{
    Console.WriteLine(ex);

    throw;
}

app.Run();
