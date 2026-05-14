using System.Collections.Generic;
using System.Linq;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Interfaces;

namespace TrilhaBee.Repositorio
{
    public class AlertaIARepositorio : BaseRepositorio, IAlertaIARepositorio
    {
        public AlertaIARepositorio(TrilhaBeeContexto contexto) : base(contexto)
        {
        }

        public void Adicionar(AlertaIA alertaIA)
        {
            _contexto.Alertas.Add(alertaIA);
            _contexto.SaveChanges();
        }

        public void Atualizar(AlertaIA alertaIA)
        {
            _contexto.Alertas.Update(alertaIA);
            _contexto.SaveChanges();
        }

        public void Excluir(int id)
        {
            var alertaIA = _contexto.Alertas.Find(id);
            if (alertaIA != null)
            {
                _contexto.Alertas.Remove(alertaIA);
                _contexto.SaveChanges();
            }
        }

        public AlertaIA ObterPorId(int id)
        {
            return _contexto.Alertas.Find(id);
        }

        public IEnumerable<AlertaIA> ObterTodos()
        {
            return _contexto.Alertas.ToList();
        }
    }
}
