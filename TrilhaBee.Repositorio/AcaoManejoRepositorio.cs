using System.Collections.Generic;
using System.Linq;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Repositorio
{
    public class AcaoManejoRepositorio : BaseRepositorio, IAcaoManejoRepositorio
    {
        public AcaoManejoRepositorio(TrilhaBeeContexto contexto) : base(contexto)
        {
        }

        public void Adicionar(AcaoManejo acaoManejo)
        {
            _contexto.AcoesManejo.Add(acaoManejo);
            _contexto.SaveChanges();
        }

        public void Atualizar(AcaoManejo acaoManejo)
        {
            _contexto.AcoesManejo.Update(acaoManejo);
            _contexto.SaveChanges();
        }

        public void Excluir(int id)
        {
            var acaoManejo = _contexto.AcoesManejo.Find(id);
            if (acaoManejo != null)
            {
                _contexto.AcoesManejo.Remove(acaoManejo);
                _contexto.SaveChanges();
            }
        }

        public AcaoManejo ObterPorId(int id)
        {
            return _contexto.AcoesManejo.Find(id);
        }

        public IEnumerable<AcaoManejo> ObterTodos()
        {
            return _contexto.AcoesManejo.ToList();
        }
    }
}
