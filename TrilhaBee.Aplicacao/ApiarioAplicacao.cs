using System;
using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Aplicacao
{
    public class ApiarioAplicacao
    {
        readonly IApiarioRepositorio _apiarioRepositorio;

        public ApiarioAplicacao(IApiarioRepositorio apiarioRepositorio)
        {
            _apiarioRepositorio = apiarioRepositorio;
        }

        public void Criar(Apiario apiario)
        {
            if (string.IsNullOrEmpty(apiario.Nome)) throw new Exception("Nome do apiário é obrigatório.");
            apiario.DataCriacao = DateTime.Now;
            _apiarioRepositorio.Adicionar(apiario);
        }

        public void Atualizar(Apiario apiario)
        {
            var existente = _apiarioRepositorio.ObterPorId(apiario.ApiarioID);
            if (existente == null) throw new Exception("Apiário não encontrado.");
            
            existente.Nome = apiario.Nome;
            existente.Localizacao = apiario.Localizacao;
            existente.Capacidade = apiario.Capacidade;

            _apiarioRepositorio.Atualizar(existente);
        }

        public void Excluir(int id)
        {
            _apiarioRepositorio.Excluir(id);
        }

        public Apiario ObterPorId(int id)
        {
            return _apiarioRepositorio.ObterPorId(id);
        }

        public IEnumerable<Apiario> ObterTodos()
        {
            return _apiarioRepositorio.ObterTodos();
        }
    }
}
