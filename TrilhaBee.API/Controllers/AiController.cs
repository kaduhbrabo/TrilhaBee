using Microsoft.AspNetCore.Mvc;
using TrilhaBee.Servicos.Interfaces;
using System.Threading.Tasks;

namespace TrilhaBee.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly IAiService _aiService;

        public AiController(IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("completar")]
        public async Task<IActionResult> Completar([FromBody] string prompt)
        {
            var resposta = await _aiService.GetAiResponseAsync(prompt);
            return Ok(resposta);
        }
    }
}
