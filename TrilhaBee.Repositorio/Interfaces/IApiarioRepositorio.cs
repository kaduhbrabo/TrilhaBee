using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Interfaces
{
    public interface IApiarioRepositorio
    {
        IEnumerable<Apiario> ObterTodos();
        Apiario ObterPorId(int id);
        void Adicionar(Apiario apiario);
        void Atualizar(Apiario apiario);
        void Excluir(int id);
    }
}
