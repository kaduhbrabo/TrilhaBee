using System;
using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Aplicacao
{
    public class AlertaIAAplicacao
    {
        readonly IAlertaIARepositorio _alertaIARepositorio;

        public AlertaIAAplicacao(IAlertaIARepositorio alertaIARepositorio)
        {
            _alertaIARepositorio = alertaIARepositorio;
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
            
            existente.Mensagem = alertaIA.Mensagem;
            existente.NivelGravidade = alertaIA.NivelGravidade;
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
