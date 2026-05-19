using System;
using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Aplicacao
{
    public class InspecaoAplicacao
    {
        readonly IInspecaoRepositorio _inspecaoRepositorio;
        readonly Microsoft.Extensions.DependencyInjection.IServiceScopeFactory _serviceScopeFactory;
        readonly IAlertaIARepositorio _alertaIARepositorio;

        public InspecaoAplicacao(
            IInspecaoRepositorio inspecaoRepositorio,
            Microsoft.Extensions.DependencyInjection.IServiceScopeFactory serviceScopeFactory,
            IAlertaIARepositorio alertaIARepositorio)
        {
            _inspecaoRepositorio = inspecaoRepositorio;
            _serviceScopeFactory = serviceScopeFactory;
            _alertaIARepositorio = alertaIARepositorio;
        }

        public void Criar(Inspecao inspecao)
        {
            if (inspecao.DataInspecao == default(DateTime))
            {
                inspecao.DataInspecao = DateTime.Now;
            }
            _inspecaoRepositorio.Adicionar(inspecao);

            // Dispara análise da IA em background para não travar a UI
            System.Threading.Tasks.Task.Run(async () => 
            {
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var iaApp = Microsoft.Extensions.DependencyInjection.ServiceProviderServiceExtensions.GetRequiredService<AlertaIAAplicacao>(scope.ServiceProvider);
                    await iaApp.GerarAnaliseInteligenteAsync();
                }
            });
        }

        public void Atualizar(Inspecao inspecao)
        {
            var existente = _inspecaoRepositorio.ObterPorId(inspecao.InspecaoID);
            if (existente == null) throw new Exception("Inspeção não encontrada.");
            
            existente.Observacoes = inspecao.Observacoes;
            existente.TemRainha = inspecao.TemRainha;
            existente.TemPostura = inspecao.TemPostura;
            existente.CondicaoGeral = inspecao.CondicaoGeral;
            existente.ForcaColmeia = inspecao.ForcaColmeia;
            existente.NivelAlimento = inspecao.NivelAlimento;
            existente.Clima = inspecao.Clima;
            existente.Temperamento = inspecao.Temperamento;
            existente.MelColetado = inspecao.MelColetado;
            existente.DataColheita = inspecao.DataColheita;

            _inspecaoRepositorio.Atualizar(existente);

            // Dispara análise da IA em background para atualizar o parecer
            System.Threading.Tasks.Task.Run(async () => 
            {
                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    var iaApp = Microsoft.Extensions.DependencyInjection.ServiceProviderServiceExtensions.GetRequiredService<AlertaIAAplicacao>(scope.ServiceProvider);
                    await iaApp.GerarAnaliseInteligenteAsync();
                }
            });
        }

        public void Excluir(int id)
        {
            _inspecaoRepositorio.Excluir(id);
        }

        public Inspecao ObterPorId(int id)
        {
            return _inspecaoRepositorio.ObterPorId(id);
        }

        public IEnumerable<Inspecao> ObterTodos()
        {
            return _inspecaoRepositorio.ObterTodos();
        }
    }
}
