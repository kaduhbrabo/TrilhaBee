using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Dapper;
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
            var conexao = _contexto.Database.GetDbConnection();
            return conexao.Query<Apiario>("sp_ResumoApiarios", commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}
