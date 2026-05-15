using System;
using System.Collections.Generic;

namespace TrilhaBee.Dominio.Entidades
{
    public class Inspecao
    {
        public int InspecaoID { get; set; }
        public DateTime DataInspecao { get; set; }
        public string Observacoes { get; set; }
        public string Clima { get; set; }
        public string Temperamento { get; set; }
        public bool TemRainha { get; set; }
        public bool TemPostura { get; set; }
        public int ForcaColmeia { get; set; }
        public int NivelAlimento { get; set; }
        public string CondicaoGeral { get; set; }
        // Relacionamentos
        public int ColmeiaID { get; set; }
        public Colmeia Colmeia { get; set; }
        public ICollection<AcaoManejo> AcoesManejo { get; set; }

        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public string ColmeiaNome { get; set; }
        
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public string ApiarioNome { get; set; }
    }
}
