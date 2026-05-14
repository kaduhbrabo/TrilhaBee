using Microsoft.AspNetCore.Mvc;
using TrilhaBee.Aplicacao;
using TrilhaBee.Dominio.Entidades;
using Microsoft.AspNetCore.Authorization;

namespace TrilhaBee.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AlertaIAController : ControllerBase
    {
        private readonly AlertaIAAplicacao _alertaIAAplicacao;

        public AlertaIAController(AlertaIAAplicacao alertaIAAplicacao)
        {
            _alertaIAAplicacao = alertaIAAplicacao;
        }

        [HttpGet]
        public IActionResult ObterTodos()
        {
            return Ok(_alertaIAAplicacao.ObterTodos());
        }

        [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var alerta = _alertaIAAplicacao.ObterPorId(id);
            if (alerta == null) return NotFound();
            return Ok(alerta);
        }

        [HttpPost]
        public IActionResult Criar([FromBody] AlertaIA alertaIA)
        {
            try
            {
                _alertaIAAplicacao.Criar(alertaIA);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, [FromBody] AlertaIA alertaIA)
        {
            try
            {
                alertaIA.AlertaIAID = id;
                _alertaIAAplicacao.Atualizar(alertaIA);
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
            _alertaIAAplicacao.Excluir(id);
            return Ok();
        }
    }
}
