using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Dapper;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Repositorio
{
    public class ColmeiaRepositorio : BaseRepositorio, IColmeiaRepositorio
    {
        public ColmeiaRepositorio(TrilhaBeeContexto contexto) : base(contexto)
        {
        }

        public void Adicionar(Colmeia colmeia)
        {
            _contexto.Colmeias.Add(colmeia);
            _contexto.SaveChanges();
        }

        public void Atualizar(Colmeia colmeia)
        {
            _contexto.Colmeias.Update(colmeia);
            _contexto.SaveChanges();
        }

        public void Excluir(int id)
        {
            var colmeia = _contexto.Colmeias.Find(id);
            if (colmeia != null)
            {
                _contexto.Colmeias.Remove(colmeia);
                _contexto.SaveChanges();
            }
        }

        public Colmeia ObterPorId(int id)
        {
            return _contexto.Colmeias.Find(id);
        }

        public IEnumerable<Colmeia> ObterTodos()
        {
            var conexao = _contexto.Database.GetDbConnection();
            return conexao.Query<Colmeia>("sp_ListarColmeias", commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}
