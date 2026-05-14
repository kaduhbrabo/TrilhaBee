using Microsoft.AspNetCore.Mvc;
using TrilhaBee.Aplicacao;
using TrilhaBee.Dominio.Entidades;
using Microsoft.AspNetCore.Authorization;

namespace TrilhaBee.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ColmeiaController : ControllerBase
    {
        private readonly ColmeiaAplicacao _colmeiaAplicacao;

        public ColmeiaController(ColmeiaAplicacao colmeiaAplicacao)
        {
            _colmeiaAplicacao = colmeiaAplicacao;
        }

        [HttpGet]
        public IActionResult ObterTodos()
        {
            return Ok(_colmeiaAplicacao.ObterTodos());
        }

        [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var colmeia = _colmeiaAplicacao.ObterPorId(id);
            if (colmeia == null) return NotFound();
            return Ok(colmeia);
        }

        [HttpPost]
        public IActionResult Criar([FromBody] Colmeia colmeia)
        {
            try
            {
                _colmeiaAplicacao.Criar(colmeia);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, [FromBody] Colmeia colmeia)
        {
            try
            {
                colmeia.ColmeiaID = id;
                _colmeiaAplicacao.Atualizar(colmeia);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Excluir(int id)
        {
            _colmeiaAplicacao.Excluir(id);
            return Ok();
        }
    }
}
