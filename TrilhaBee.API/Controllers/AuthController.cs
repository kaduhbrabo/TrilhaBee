using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TrilhaBee.API.Models;
using TrilhaBee.Aplicacao;

namespace TrilhaBee.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UsuarioAplicacao _usuarioAplicacao;
        private readonly IConfiguration _configuration;

        public AuthController(UsuarioAplicacao usuarioAplicacao, IConfiguration configuration)
        {
            _usuarioAplicacao = usuarioAplicacao;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                var usuario = _usuarioAplicacao.ValidarLogin(request.Email, request.Senha);

                var token = GerarTokenJwt(usuario.Email, usuario.UsuarioID);

                return Ok(new LoginResponse
                {
                    Token = token,
                    Usuario = usuario.Nome,
                    UsuarioID = usuario.UsuarioID
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { erro = ex.Message });
            }
        }

        private string GerarTokenJwt(string email, int usuarioId)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.NameIdentifier, usuarioId.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"])),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
