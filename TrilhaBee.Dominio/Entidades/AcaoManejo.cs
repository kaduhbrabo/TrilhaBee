using System;

namespace TrilhaBee.Dominio.Entidades
{
    public class AcaoManejo
    {
        public int AcaoManejoID { get; set; }
        public string Descricao { get; set; }
        public DateTime DataRealizacao { get; set; }
        public string TipoManejo { get; set; }
        
        // Relacionamentos
        public int InspecaoID { get; set; }
        public Inspecao Inspecao { get; set; }
    }
}
