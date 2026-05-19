using System;
using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrilhaBee.Servicos.Interfaces;
using System.Text.Json;
using System.Collections.Generic;

namespace TrilhaBee.Aplicacao
{
    public class AlertaIAAplicacao
    {
        readonly IAlertaIARepositorio _alertaIARepositorio;
        readonly IColmeiaRepositorio _colmeiaRepositorio;
        readonly IInspecaoRepositorio _inspecaoRepositorio;
        readonly IAiService _aiService;

        public AlertaIAAplicacao(IAlertaIARepositorio alertaIARepositorio, IColmeiaRepositorio colmeiaRepositorio, IInspecaoRepositorio inspecaoRepositorio, IAiService aiService)
        {
            _alertaIARepositorio = alertaIARepositorio;
            _colmeiaRepositorio = colmeiaRepositorio;
            _inspecaoRepositorio = inspecaoRepositorio;
            _aiService = aiService;
        }

        public async Task GerarAnaliseInteligenteAsync()
        {
            // Carrega os pareceres existentes para evitar duplicação
            var existentes = _alertaIARepositorio.ObterTodos().ToList();

            var colmeias = _colmeiaRepositorio.ObterTodos();
            var inspecoes = _inspecaoRepositorio.ObterTodos();

            var contextoBuilder = new StringBuilder();

            // Pega a primeira colmeia para servir de exemplo, senão a IA pode bugar com lista vazia
            var colmeiasAtivas = colmeias.Where(c => c.Ativa).ToList();
            if(!colmeiasAtivas.Any()) return;

            foreach(var colmeia in colmeiasAtivas)
            {
                var ultimaInspecao = inspecoes
                    .Where(i => i.ColmeiaID == colmeia.ColmeiaID)
                    .OrderByDescending(i => i.DataInspecao)
                    .FirstOrDefault();

                int diasNaCaixa = (int)(DateTime.Now - colmeia.DataInstalacao).TotalDays;

                contextoBuilder.AppendLine($"- Colmeia {colmeia.Identificacao} (ID: {colmeia.ColmeiaID}):");
                contextoBuilder.AppendLine($"  Dias instalada: {diasNaCaixa}");
                contextoBuilder.AppendLine($"  Quadros: {colmeia.QuantidadeQuadros}, Melgueiras: {colmeia.QuantidadeMelgueiras}");
                
                if(ultimaInspecao != null)
                {
                    contextoBuilder.AppendLine($"  Última Inspeção: {ultimaInspecao.DataInspecao.ToShortDateString()}");
                    contextoBuilder.AppendLine($"  Força (0-10): {ultimaInspecao.ForcaColmeia}, Alimento (0-10): {ultimaInspecao.NivelAlimento}, Condição: {ultimaInspecao.CondicaoGeral}");
                    contextoBuilder.AppendLine($"  Clima: {ultimaInspecao.Clima}, Observações: {ultimaInspecao.Observacoes}");
                }
                else
                {
                    contextoBuilder.AppendLine($"  Nunca foi inspecionada.");
                }
            }

            // Aqui vamos construir o prompt pedindo o formato JSON especificamente
            var prompt = $@"
Você é um Especialista em Zootecnia e Apicultura Avançada. 
Sua função é fornecer um Relatório Técnico de Manejo para auxiliar o apicultor na tomada de decisões.

Contexto atual das colmeias:
{contextoBuilder.ToString()}

Regras para sua resposta:
1. Analise as condições climáticas informadas, força da colmeia, disponibilidade de alimento e espaço físico (quadros/melgueiras).
2. Forneça análises zootécnicas precisas (ex: risco de enxameação por superlotação, necessidade de alimentação suplementar, inserção de cera alveolada, etc).
3. Seja conciso e evite repetir problemas que não mudaram de status.
4. A sua recomendação deve ser fluida, técnica e natural. Se houver alguma urgência, integre ao texto suavemente sem criar campos como 'Prazo:' ou 'Data limite:'.
5. NUNCA cite os números brutos na sua resposta (ex: não diga 'Força 9' ou 'Alimento 2'), fale apenas de forma fluida (ex: 'A colmeia está muito forte' ou 'A colmeia está sem reservas de mel').
6. Você DEVE retornar EXATAMENTE um array JSON puro onde cada objeto tem duas propriedades: 'Mensagem' (string com a análise e recomendação técnica) e 'NivelGravidade' (string: 'Baixa', 'Media', 'Alta' ou 'Parecer').
7. Não retorne nenhum outro texto além do JSON, sem formatação markdown.
";

            try
            {
                var respostaBruta = await _aiService.GetAiResponseAsync(prompt);
                
                // Limpa markdown se a IA colocar
                if (respostaBruta.StartsWith("```json"))
                {
                    respostaBruta = respostaBruta.Substring(7);
                    if (respostaBruta.EndsWith("```")) respostaBruta = respostaBruta.Substring(0, respostaBruta.Length - 3);
                }

                var sugestoes = JsonSerializer.Deserialize<List<Dictionary<string, string>>>(respostaBruta.Trim());
                if (sugestoes == null) throw new Exception("JSON veio vazio ou nulo.");

                foreach(var sugestao in sugestoes)
                {
                    if (sugestao.TryGetValue("Mensagem", out var mensagem) && sugestao.TryGetValue("NivelGravidade", out var nivel))
                    {
                        // Evitar spam de alertas idênticos que já foram resolvidos ou estão ativos
                        bool jaExiste = existentes.Any(a => a.Mensagem == mensagem);
                        if(!jaExiste)
                        {
                            // Tenta associar a uma colmeia caso a IA cite o nome ou ID, fallback pro primeiro ID
                            var colID = colmeiasAtivas.FirstOrDefault(c => mensagem.Contains(c.Identificacao))?.ColmeiaID ?? colmeiasAtivas.First().ColmeiaID;

                            _alertaIARepositorio.Adicionar(new AlertaIA
                            {
                                ColmeiaID = colID,
                                Mensagem = mensagem,
                                NivelGravidade = nivel,
                                DataGeracao = DateTime.Now,
                                Resolvido = false
                            });
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                // Em caso de falha da IA (Timeout, Quota exceeded, etc), cria um alerta de sistema.
                _alertaIARepositorio.Adicionar(new AlertaIA
                {
                    ColmeiaID = colmeiasAtivas.First().ColmeiaID,
                    Mensagem = $"Falha na conexão com a OpenAI: {ex.Message}",
                    NivelGravidade = "Media",
                    DataGeracao = DateTime.Now,
                    Resolvido = false
                });
            }
        }

        public void Criar(AlertaIA alertaIA)
        {
            if (string.IsNullOrEmpty(alertaIA.Mensagem)) throw new Exception("Mensagem é obrigatória.");
            alertaIA.DataGeracao = DateTime.Now;
            alertaIA.Resolvido = false;
            _alertaIARepositorio.Adicionar(alertaIA);
        }

        public void Atualizar(AlertaIA alertaIA)
        {
            var existente = _alertaIARepositorio.ObterPorId(alertaIA.AlertaIAID);
            if (existente == null) throw new Exception("Alerta não encontrado.");
            
            existente.Resolvido = alertaIA.Resolvido;

            _alertaIARepositorio.Atualizar(existente);
        }

        public void Excluir(int id)
        {
            _alertaIARepositorio.Excluir(id);
        }

        public AlertaIA ObterPorId(int id)
        {
            return _alertaIARepositorio.ObterPorId(id);
        }

        public IEnumerable<AlertaIA> ObterTodos()
        {
            return _alertaIARepositorio.ObterTodos();
        }
    }
}
