using System;
using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Aplicacao
{
    public class ColmeiaAplicacao
    {
        readonly IColmeiaRepositorio _colmeiaRepositorio;

        public ColmeiaAplicacao(IColmeiaRepositorio colmeiaRepositorio)
        {
            _colmeiaRepositorio = colmeiaRepositorio;
        }

        public void Criar(Colmeia colmeia)
        {
            if (string.IsNullOrEmpty(colmeia.Identificacao)) throw new Exception("Identificação da colmeia é obrigatória.");
            if (colmeia.DataInstalacao == default) colmeia.DataInstalacao = DateTime.Now;
            _colmeiaRepositorio.Adicionar(colmeia);
        }

        public void Atualizar(Colmeia colmeia)
        {
            var existente = _colmeiaRepositorio.ObterPorId(colmeia.ColmeiaID);
            if (existente == null) throw new Exception("Colmeia não encontrada.");
            
            existente.Identificacao = colmeia.Identificacao;
            existente.TipoAbelha = colmeia.TipoAbelha;
            existente.Ativa = colmeia.Ativa;
            existente.DataInstalacao = colmeia.DataInstalacao;
            existente.QuantidadeQuadros = colmeia.QuantidadeQuadros;
            existente.QuantidadeMelgueiras = colmeia.QuantidadeMelgueiras;

            _colmeiaRepositorio.Atualizar(existente);
        }

        public void Excluir(int id)
        {
            _colmeiaRepositorio.Excluir(id);
        }

        public Colmeia ObterPorId(int id)
        {
            return _colmeiaRepositorio.ObterPorId(id);
        }

        public IEnumerable<Colmeia> ObterTodos()
        {
            return _colmeiaRepositorio.ObterTodos();
        }
    }
}
