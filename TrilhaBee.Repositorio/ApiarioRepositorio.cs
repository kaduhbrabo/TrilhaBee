using System.Collections.Generic;
using System.Linq;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Repositorio
{
    public class ApiarioRepositorio : BaseRepositorio, IApiarioRepositorio
    {
        public ApiarioRepositorio(TrilhaBeeContexto contexto) : base(contexto)
        {
        }

        public void Adicionar(Apiario apiario)
        {
            _contexto.Apiarios.Add(apiario);
            _contexto.SaveChanges();
        }

        public void Atualizar(Apiario apiario)
        {
            _contexto.Apiarios.Update(apiario);
            _contexto.SaveChanges();
        }

        public void Excluir(int id)
        {
            var apiario = _contexto.Apiarios.Find(id);
            if (apiario != null)
            {
                _contexto.Apiarios.Remove(apiario);
                _contexto.SaveChanges();
            }
        }

        public Apiario ObterPorId(int id)
        {
            return _contexto.Apiarios.Find(id);
        }

        public IEnumerable<Apiario> ObterTodos()
        {
            return _contexto.Apiarios.ToList();
        }
    }
}
