using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Interfaces
{
    public interface IInspecaoRepositorio
    {
        IEnumerable<Inspecao> ObterTodos();
        Inspecao ObterPorId(int id);
        void Adicionar(Inspecao inspecao);
        void Atualizar(Inspecao inspecao);
        void Excluir(int id);
    }
}
