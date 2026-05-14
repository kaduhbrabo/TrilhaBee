using System;
using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Aplicacao
{
    public class InspecaoAplicacao
    {
        readonly IInspecaoRepositorio _inspecaoRepositorio;

        public InspecaoAplicacao(IInspecaoRepositorio inspecaoRepositorio)
        {
            _inspecaoRepositorio = inspecaoRepositorio;
        }

        public void Criar(Inspecao inspecao)
        {
            inspecao.DataInspecao = DateTime.Now;
            _inspecaoRepositorio.Adicionar(inspecao);
        }

        public void Atualizar(Inspecao inspecao)
        {
            var existente = _inspecaoRepositorio.ObterPorId(inspecao.InspecaoID);
            if (existente == null) throw new Exception("Inspeção não encontrada.");
            
            existente.Observacoes = inspecao.Observacoes;
            existente.TemRainha = inspecao.TemRainha;
            existente.CondicaoGeral = inspecao.CondicaoGeral;

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
