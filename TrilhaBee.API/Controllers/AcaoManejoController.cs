using Microsoft.AspNetCore.Mvc;
using TrilhaBee.Aplicacao;
using TrilhaBee.Dominio.Entidades;
using Microsoft.AspNetCore.Authorization;

namespace TrilhaBee.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AcaoManejoController : ControllerBase
    {
        private readonly AcaoManejoAplicacao _acaoManejoAplicacao;

        public AcaoManejoController(AcaoManejoAplicacao acaoManejoAplicacao)
        {
            _acaoManejoAplicacao = acaoManejoAplicacao;
        }

        [HttpGet]
        public IActionResult ObterTodos()
        {
            return Ok(_acaoManejoAplicacao.ObterTodos());
        }

        [HttpGet("{id}")]
        public IActionResult ObterPorId(int id)
        {
            var acaoManejo = _acaoManejoAplicacao.ObterPorId(id);
            if (acaoManejo == null) return NotFound();
            return Ok(acaoManejo);
        }

        [HttpPost]
        public IActionResult Criar([FromBody] AcaoManejo acaoManejo)
        {
            try
            {
                _acaoManejoAplicacao.Criar(acaoManejo);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { erro = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, [FromBody] AcaoManejo acaoManejo)
        {
            try
            {
                acaoManejo.AcaoManejoID = id;
                _acaoManejoAplicacao.Atualizar(acaoManejo);
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
            _acaoManejoAplicacao.Excluir(id);
            return Ok();
        }
    }
}
