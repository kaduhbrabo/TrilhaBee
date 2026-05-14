using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Interfaces
{
    public interface IColmeiaRepositorio
    {
        IEnumerable<Colmeia> ObterTodos();
        Colmeia ObterPorId(int id);
        void Adicionar(Colmeia colmeia);
        void Atualizar(Colmeia colmeia);
        void Excluir(int id);
    }
}
