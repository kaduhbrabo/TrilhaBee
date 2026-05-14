using TrilhaBee.Repositorio;
using TrilhaBee.Repositorio.Interfaces;
using TrilhaBee.Aplicacao;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.ReferenceHandler =
        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"]
    };
});

// Configure DbContext
builder.Services.AddDbContext<TrilhaBeeContexto>();

// Injeção de Dependências - Repositórios
builder.Services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();
builder.Services.AddScoped<IApiarioRepositorio, ApiarioRepositorio>();
builder.Services.AddScoped<IColmeiaRepositorio, ColmeiaRepositorio>();
builder.Services.AddScoped<IInspecaoRepositorio, InspecaoRepositorio>();
builder.Services.AddScoped<IAcaoManejoRepositorio, AcaoManejoRepositorio>();
builder.Services.AddScoped<IAlertaIARepositorio, AlertaIARepositorio>();

// Injeção de Dependências - Aplicação
builder.Services.AddScoped<UsuarioAplicacao>();
builder.Services.AddScoped<ApiarioAplicacao>();
builder.Services.AddScoped<ColmeiaAplicacao>();
builder.Services.AddScoped<InspecaoAplicacao>();
builder.Services.AddScoped<AcaoManejoAplicacao>();
builder.Services.AddScoped<AlertaIAAplicacao>();

// Injeção de Dependências - Servicos
builder.Services.AddScoped<TrilhaBee.Servicos.Interfaces.IAlertaIAService, TrilhaBee.Servicos.AlertaIAService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("PermitirFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
