using System;
using System.Collections.Generic;

namespace TrilhaBee.Dominio.Entidades
{
    public class Colmeia
    {
        public int ColmeiaID { get; set; }
        public string Identificacao { get; set; }
        public string TipoAbelha { get; set; }
        public DateTime DataInstalacao { get; set; }
        public bool Ativa { get; set; }
        
        // Relacionamentos
        public int ApiarioID { get; set; }
        public Apiario Apiario { get; set; }
        public ICollection<Inspecao> Inspecoes { get; set; }
        public ICollection<AlertaIA> Alertas { get; set; }
    }
}
