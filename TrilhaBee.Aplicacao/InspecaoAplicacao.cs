using System;
using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Aplicacao
{
    public class InspecaoAplicacao
    {
        readonly IInspecaoRepositorio _inspecaoRepositorio;
        readonly TrilhaBee.Servicos.Interfaces.IAlertaIAService _alertaIAService;
        readonly IAlertaIARepositorio _alertaIARepositorio;

        public InspecaoAplicacao(
            IInspecaoRepositorio inspecaoRepositorio,
            TrilhaBee.Servicos.Interfaces.IAlertaIAService alertaIAService,
            IAlertaIARepositorio alertaIARepositorio)
        {
            _inspecaoRepositorio = inspecaoRepositorio;
            _alertaIAService = alertaIAService;
            _alertaIARepositorio = alertaIARepositorio;
        }

        public void Criar(Inspecao inspecao)
        {
            if (inspecao.DataInspecao == default(DateTime))
            {
                inspecao.DataInspecao = DateTime.Now;
            }
            _inspecaoRepositorio.Adicionar(inspecao);

            // Integração com IA
            var mensagemAlerta = _alertaIAService.AnalisarInspecao(
                inspecao.ForcaColmeia, 
                inspecao.NivelAlimento, 
                inspecao.TemRainha, 
                inspecao.TemPostura);

            if (!string.IsNullOrEmpty(mensagemAlerta))
            {
                var alerta = new AlertaIA
                {
                    Mensagem = mensagemAlerta,
                    DataGeracao = DateTime.Now,
                    NivelGravidade = "Atenção",
                    Resolvido = false,
                    ColmeiaID = inspecao.ColmeiaID
                };
                _alertaIARepositorio.Adicionar(alerta);
            }
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

            _inspecaoRepositorio.Atualizar(existente);
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
