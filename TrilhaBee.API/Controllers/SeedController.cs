using Microsoft.AspNetCore.Mvc;
using TrilhaBee.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;

namespace TrilhaBee.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly TrilhaBeeContexto _ctx;

        public SeedController(TrilhaBeeContexto ctx)
        {
            _ctx = ctx;
        }

        [HttpPost("dados-exemplo")]
        public async Task<IActionResult> SeedDadosExemplo([FromQuery] int usuarioID)
        {
            var usuario = await _ctx.Usuarios.FindAsync(usuarioID);
            if (usuario == null)
                return BadRequest(new { erro = $"Usuário ID={usuarioID} não encontrado." });

            var jaTemApiario = await _ctx.Apiarios.AnyAsync(a => a.Nome.StartsWith("Apiário Demo"));
            if (jaTemApiario)
                return Ok(new { mensagem = "Dados de exemplo já existem. Nenhuma ação realizada." });

            // ── APIÁRIOS ─────────────────────────────────────────────
            var apiarios = new List<Apiario>
            {
                new Apiario { Nome = "Apiário Demo - Setor A", Localizacao = "Alfenas, MG",              DataCriacao = DateTime.Now.AddYears(-1), Capacidade = 20, UsuarioID = usuarioID },
                new Apiario { Nome = "Apiário Demo - Setor B", Localizacao = "Alfenas, MG - Zona Rural", DataCriacao = DateTime.Now.AddMonths(-6), Capacidade = 10, UsuarioID = usuarioID },
            };
            _ctx.Apiarios.AddRange(apiarios);
            await _ctx.SaveChangesAsync();

            // ── COLMEIAS ──────────────────────────────────────────────
            var colmeias = new List<Colmeia>
            {
                new Colmeia { Identificacao = "Colmeia Alpha",   TipoAbelha = "Apis mellifera", Ativa = true,  DataInstalacao = DateTime.Now.AddMonths(-8),  QuantidadeQuadros = 10, QuantidadeMelgueiras = 2, ApiarioID = apiarios[0].ApiarioID },
                new Colmeia { Identificacao = "Colmeia Beta",    TipoAbelha = "Apis mellifera", Ativa = true,  DataInstalacao = DateTime.Now.AddMonths(-6),  QuantidadeQuadros = 10, QuantidadeMelgueiras = 1, ApiarioID = apiarios[0].ApiarioID },
                new Colmeia { Identificacao = "Colmeia Gamma",   TipoAbelha = "Apis mellifera", Ativa = true,  DataInstalacao = DateTime.Now.AddMonths(-4),  QuantidadeQuadros = 8,  QuantidadeMelgueiras = 1, ApiarioID = apiarios[0].ApiarioID },
                new Colmeia { Identificacao = "Colmeia Delta",   TipoAbelha = "Jataí",          Ativa = true,  DataInstalacao = DateTime.Now.AddMonths(-12), QuantidadeQuadros = 6,  QuantidadeMelgueiras = 2, ApiarioID = apiarios[1].ApiarioID },
                new Colmeia { Identificacao = "Colmeia Épsilon", TipoAbelha = "Mandaçaia",      Ativa = false, DataInstalacao = DateTime.Now.AddMonths(-3),  QuantidadeQuadros = 5,  QuantidadeMelgueiras = 0, ApiarioID = apiarios[1].ApiarioID },
            };
            _ctx.Colmeias.AddRange(colmeias);
            await _ctx.SaveChangesAsync();

            // ── INSPEÇÕES ──────────────────────────────────────────────
            var rand = new Random(42);
            var inspecoes = new List<Inspecao>();
            var climas = new[] { "Ensolarado", "Parcialmente nublado", "Nublado" };

            foreach (var c in colmeias.Where(c => c.Ativa))
            {
                for (int i = 0; i < 3; i++)
                {
                    var forca = rand.Next(6, 10);
                    var clima = climas[rand.Next(climas.Length)];
                    var temp = rand.Next(22, 32);
                    var kgColheita = c.QuantidadeMelgueiras * rand.Next(8, 16);

                    inspecoes.Add(new Inspecao
                    {
                        ColmeiaID     = c.ColmeiaID,
                        DataInspecao  = DateTime.Now.AddDays(-(i * 15 + rand.Next(1, 10))),
                        Clima         = $"Alfenas - {clima}, {temp}°C",
                        Temperamento  = rand.Next(2) == 0 ? "Calmas" : "Agitadas",
                        ForcaColmeia  = forca,
                        NivelAlimento = rand.Next(5, 10),
                        TemRainha     = true,
                        TemPostura    = true,
                        CondicaoGeral = forca >= 8 ? "Excelente" : forca >= 6 ? "Boa" : "Regular",
                        Observacoes   = $"[Colheita: {kgColheita}kg em {DateTime.Now.AddDays(-(i * 15)).ToString("dd/MM/yyyy")}] - Inspeção de rotina.",
                    });
                }
            }
            _ctx.Inspecoes.AddRange(inspecoes);
            await _ctx.SaveChangesAsync();

            return Ok(new
            {
                mensagem  = "Dados de exemplo inseridos com sucesso!",
                apiarios  = apiarios.Count,
                colmeias  = colmeias.Count,
                inspecoes = inspecoes.Count,
            });
        }
    }
}
