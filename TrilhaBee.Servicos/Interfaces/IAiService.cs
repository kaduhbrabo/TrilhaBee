using System.Threading.Tasks;

namespace TrilhaBee.Servicos.Interfaces
{
    public interface IAiService
    {
        Task<string> GetAiResponseAsync(string prompt);
    }
}
