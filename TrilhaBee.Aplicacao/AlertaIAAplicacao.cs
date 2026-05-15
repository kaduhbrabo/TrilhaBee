using System;
using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

using System.Linq;

namespace TrilhaBee.Aplicacao
{
    public class AlertaIAAplicacao
    {
        readonly IAlertaIARepositorio _alertaIARepositorio;
        readonly IColmeiaRepositorio _colmeiaRepositorio;
        readonly IInspecaoRepositorio _inspecaoRepositorio;

        public AlertaIAAplicacao(IAlertaIARepositorio alertaIARepositorio, IColmeiaRepositorio colmeiaRepositorio, IInspecaoRepositorio inspecaoRepositorio)
        {
            _alertaIARepositorio = alertaIARepositorio;
            _colmeiaRepositorio = colmeiaRepositorio;
            _inspecaoRepositorio = inspecaoRepositorio;
        }

        public void GerarAnaliseInteligente()
        {
            // Limpa alertas não resolvidos para não duplicar (Refaz a análise atual)
            var existentes = _alertaIARepositorio.ObterTodos();
            foreach(var alerta in existentes)
            {
                if(!alerta.Resolvido) _alertaIARepositorio.Excluir(alerta.AlertaIAID);
            }

            var colmeias = _colmeiaRepositorio.ObterTodos();
            var inspecoes = _inspecaoRepositorio.ObterTodos();

            foreach(var colmeia in colmeias)
            {
                if (!colmeia.Ativa) continue;

                var ultimaInspecao = inspecoes
                    .Where(i => i.ColmeiaID == colmeia.ColmeiaID)
                    .OrderByDescending(i => i.DataInspecao)
                    .FirstOrDefault();

                int diasNaCaixa = (int)(DateTime.Now - colmeia.DataInstalacao).TotalDays;

                // --- 1. Motor de Sugestões (Planejamento Temporal) ---
                if (colmeia.QuantidadeQuadros >= 10 && colmeia.QuantidadeMelgueiras == 0 && diasNaCaixa >= 30)
                {
                    _alertaIARepositorio.Adicionar(new AlertaIA
                    {
                        ColmeiaID = colmeia.ColmeiaID,
                        Mensagem = $"Sugestão: A colmeia {colmeia.Identificacao} está há {diasNaCaixa} dias na caixa com 10 quadros. É o momento ideal para adicionar a primeira melgueira.",
                        NivelGravidade = "Sugestão",
                        DataGeracao = DateTime.Now,
                        Resolvido = false
                    });
                }
                
                if (colmeia.QuantidadeMelgueiras > 0 && ultimaInspecao != null)
                {
                    int diasDesdeInspecao = (int)(DateTime.Now - ultimaInspecao.DataInspecao).TotalDays;
                    if (diasDesdeInspecao > 15)
                    {
                        _alertaIARepositorio.Adicionar(new AlertaIA
                        {
                            ColmeiaID = colmeia.ColmeiaID,
                            Mensagem = $"Planejamento: A colmeia {colmeia.Identificacao} tem melgueiras e não é inspecionada há {diasDesdeInspecao} dias. Verifique a taxa de operculação.",
                            NivelGravidade = "Sugestão",
                            DataGeracao = DateTime.Now,
                            Resolvido = false
                        });
                    }
                }

                // --- 2. Predição de Mel ---
                if (colmeia.QuantidadeMelgueiras > 0 && ultimaInspecao != null && ultimaInspecao.ForcaColmeia >= 5)
                {
                    double estimativaMel = colmeia.QuantidadeMelgueiras * 12.5 * (ultimaInspecao.ForcaColmeia / 10.0);
                    _alertaIARepositorio.Adicionar(new AlertaIA
                    {
                        ColmeiaID = colmeia.ColmeiaID,
                        Mensagem = $"Safra: A colmeia {colmeia.Identificacao} tem {colmeia.QuantidadeMelgueiras} melgueiras e boa força. Estimativa de produção: ~{Math.Round(estimativaMel)} kg de mel.",
                        NivelGravidade = "Sugestão",
                        DataGeracao = DateTime.Now,
                        Resolvido = false
                    });
                }

                // --- 3. Motor de Alertas Críticos (Riscos) ---
                if (ultimaInspecao != null)
                {
                    if (ultimaInspecao.CondicaoGeral == "Ruim" || ultimaInspecao.NivelAlimento <= 3 || !ultimaInspecao.TemRainha)
                    {
                        string motivo = !ultimaInspecao.TemRainha ? "Falta de Rainha" : (ultimaInspecao.NivelAlimento <= 3 ? "Alimento Crítico" : "Condição Ruim");
                        _alertaIARepositorio.Adicionar(new AlertaIA
                        {
                            ColmeiaID = colmeia.ColmeiaID,
                            Mensagem = $"ALERTA CRÍTICO: A colmeia {colmeia.Identificacao} corre risco de perda por: {motivo}. Ação imediata necessária!",
                            NivelGravidade = "Alta",
                            DataGeracao = DateTime.Now,
                            Resolvido = false
                        });
                    }
                }
                else if (diasNaCaixa > 45)
                {
                    _alertaIARepositorio.Adicionar(new AlertaIA
                    {
                        ColmeiaID = colmeia.ColmeiaID,
                        Mensagem = $"ALERTA: A colmeia {colmeia.Identificacao} foi instalada há {diasNaCaixa} dias e nunca foi inspecionada. Risco de enxameação.",
                        NivelGravidade = "Media",
                        DataGeracao = DateTime.Now,
                        Resolvido = false
                    });
                }
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
