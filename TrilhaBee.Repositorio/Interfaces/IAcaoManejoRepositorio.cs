using System.Collections.Generic;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Interfaces
{
    public interface IAcaoManejoRepositorio
    {
        IEnumerable<AcaoManejo> ObterTodos();
        AcaoManejo ObterPorId(int id);
        void Adicionar(AcaoManejo acaoManejo);
        void Atualizar(AcaoManejo acaoManejo);
        void Excluir(int id);
    }
}
