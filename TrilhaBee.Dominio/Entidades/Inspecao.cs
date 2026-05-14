using System;
using System.Collections.Generic;

namespace TrilhaBee.Dominio.Entidades
{
    public class Inspecao
    {
        public int InspecaoID { get; set; }
        public DateTime DataInspecao { get; set; }
        public string Observacoes { get; set; }
        public bool TemRainha { get; set; }
        public string CondicaoGeral { get; set; }
        
        // Relacionamentos
        public int ColmeiaID { get; set; }
        public Colmeia Colmeia { get; set; }
        public ICollection<AcaoManejo> AcoesManejo { get; set; }
    }
}
