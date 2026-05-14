using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Interfaces
{
    public interface IAlertaIARepositorio
    {
        IEnumerable<AlertaIA> ObterTodos();
        AlertaIA ObterPorId(int id);
        void Adicionar(AlertaIA alertaIA);
        void Atualizar(AlertaIA alertaIA);
        void Excluir(int id);
    }
}
