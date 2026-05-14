using Microsoft.AspNetCore.Mvc;
using TrilhaBee.Aplicacao;
using TrilhaBee.Dominio.Entidades;
using Microsoft.AspNetCore.Authorization;

namespace TrilhaBee.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InspecaoController : ControllerBase
    {
        private readonly InspecaoAplicacao _inspecaoAplicacao;

        public InspecaoController(InspecaoAplicacao inspecaoAplicacao)
        {
            _inspecaoAplicacao = inspecaoAplicacao;
        }

        [HttpGet]
        public IActionResult ObterTodos()
        {
            return Ok(_inspecaoAplicacao.ObterTodos());
        }

        [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var inspecao = _inspecaoAplicacao.ObterPorId(id);
            if (inspecao == null) return NotFound();
            return Ok(inspecao);
        }

        [HttpPost]
        public IActionResult Criar([FromBody] Inspecao inspecao)
        {
            try
            {
                _inspecaoAplicacao.Criar(inspecao);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, [FromBody] Inspecao inspecao)
        {
            try
            {
                inspecao.InspecaoID = id;
                _inspecaoAplicacao.Atualizar(inspecao);
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
            _inspecaoAplicacao.Excluir(id);
            return Ok();
        }
    }
}
