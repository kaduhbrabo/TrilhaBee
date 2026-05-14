using Microsoft.AspNetCore.Mvc;
using TrilhaBee.Aplicacao;
using TrilhaBee.Dominio.Entidades;
using Microsoft.AspNetCore.Authorization;

namespace TrilhaBee.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApiarioController : ControllerBase
    {
        private readonly ApiarioAplicacao _apiarioAplicacao;

        public ApiarioController(ApiarioAplicacao apiarioAplicacao)
        {
            _apiarioAplicacao = apiarioAplicacao;
        }

        [HttpGet]
        public IActionResult ObterTodos()
        {
            return Ok(_apiarioAplicacao.ObterTodos());
        }

        [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var apiario = _apiarioAplicacao.ObterPorId(id);
            if (apiario == null) return NotFound();
            return Ok(apiario);
        }

        [HttpPost]
        public IActionResult Criar([FromBody] Apiario apiario)
        {
            try
            {
                _apiarioAplicacao.Criar(apiario);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, [FromBody] Apiario apiario)
        {
            try
            {
                apiario.ApiarioID = id;
                _apiarioAplicacao.Atualizar(apiario);
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
            _apiarioAplicacao.Excluir(id);
            return Ok();
        }
    }
}
