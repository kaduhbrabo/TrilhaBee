using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Dapper;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Repositorio
{
    public class InspecaoRepositorio : BaseRepositorio, IInspecaoRepositorio
    {
        public InspecaoRepositorio(TrilhaBeeContexto contexto) : base(contexto)
        {
        }

        public void Adicionar(Inspecao inspecao)
        {
            _contexto.Inspecoes.Add(inspecao);
            _contexto.SaveChanges();
        }

        public void Atualizar(Inspecao inspecao)
        {
            _contexto.Inspecoes.Update(inspecao);
            _contexto.SaveChanges();
        }

        public void Excluir(int id)
        {
            var inspecao = _contexto.Inspecoes.Find(id);
            if (inspecao != null)
            {
                _contexto.Inspecoes.Remove(inspecao);
                _contexto.SaveChanges();
            }
        }

        public Inspecao ObterPorId(int id)
        {
            return _contexto.Inspecoes.Find(id);
        }

        public IEnumerable<Inspecao> ObterTodos()
        {
            var conexao = _contexto.Database.GetDbConnection();
            return conexao.Query<Inspecao>("sp_ListarInspecoes", commandType: System.Data.CommandType.StoredProcedure);
        }
    }
}
