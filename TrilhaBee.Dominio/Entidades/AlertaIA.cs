using System;

namespace TrilhaBee.Dominio.Entidades
{
    public class AlertaIA
    {
        public int AlertaIAID { get; set; }
        public string Mensagem { get; set; }
        public DateTime DataGeracao { get; set; }
        public string NivelGravidade { get; set; }
        public bool Resolvido { get; set; }
        
        // Relacionamentos
        public int ColmeiaID { get; set; }
        public Colmeia Colmeia { get; set; }
    }
}
