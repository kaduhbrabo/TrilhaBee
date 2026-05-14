using Microsoft.AspNetCore.Mvc;
using TrilhaBee.Aplicacao;
using TrilhaBee.Dominio.Entidades;
using Microsoft.AspNetCore.Authorization;

namespace TrilhaBee.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioAplicacao _usuarioAplicacao;

        public UsuarioController(UsuarioAplicacao usuarioAplicacao)
        {
            _usuarioAplicacao = usuarioAplicacao;
        }

        [HttpPost]
        public IActionResult Criar([FromBody] Usuario usuario)
        {
            try
            {
                var id = _usuarioAplicacao.Criar(usuario);
                return Ok(new { UsuarioID = id });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, [FromBody] Usuario usuario)
        {
            try
            {
                usuario.UsuarioID = id;
                _usuarioAplicacao.Atualizar(usuario);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [Authorize]
        [HttpGet]
        public IActionResult Listar()
        {
            try
            {
                return Ok(_usuarioAplicacao.ObterTodos());
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            try
            {
                var usuario = _usuarioAplicacao.ObterPorId(id);
                if (usuario == null) return NotFound();
                return Ok(usuario);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Excluir(int id)
        {
            try
            {
                _usuarioAplicacao.Excluir(id);
                return NoContent();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }
    }
}
