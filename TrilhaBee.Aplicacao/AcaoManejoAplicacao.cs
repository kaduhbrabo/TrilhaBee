using System;
using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Aplicacao
{
    public class AcaoManejoAplicacao
    {
        readonly IAcaoManejoRepositorio _acaoManejoRepositorio;

        public AcaoManejoAplicacao(IAcaoManejoRepositorio acaoManejoRepositorio)
        {
            _acaoManejoRepositorio = acaoManejoRepositorio;
        }

        public void Criar(AcaoManejo acaoManejo)
        {
            if (string.IsNullOrEmpty(acaoManejo.Descricao)) throw new Exception("Descrição é obrigatória.");
            acaoManejo.DataRealizacao = DateTime.Now;
            _acaoManejoRepositorio.Adicionar(acaoManejo);
        }

        public void Atualizar(AcaoManejo acaoManejo)
        {
            var existente = _acaoManejoRepositorio.ObterPorId(acaoManejo.AcaoManejoID);
            if (existente == null) throw new Exception("Ação de Manejo não encontrada.");
            
            existente.Descricao = acaoManejo.Descricao;
            existente.TipoManejo = acaoManejo.TipoManejo;

            _acaoManejoRepositorio.Atualizar(existente);
        }

        public void Excluir(int id)
        {
            _acaoManejoRepositorio.Excluir(id);
        }

        public AcaoManejo ObterPorId(int id)
        {
            return _acaoManejoRepositorio.ObterPorId(id);
        }

        public IEnumerable<AcaoManejo> ObterTodos()
        {
            return _acaoManejoRepositorio.ObterTodos();
        }
    }
}
