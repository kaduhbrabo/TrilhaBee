using System;
using System.Collections.Generic;

namespace TrilhaBee.Dominio.Entidades
{
    public class Apiario
    {
        public int ApiarioID { get; set; }
        public string Nome { get; set; }
        public string Localizacao { get; set; }
        public DateTime DataCriacao { get; set; }
        public int Capacidade { get; set; }
        
        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public int TotalColmeia { get; set; }
        
        // Relacionamentos
        public int UsuarioID { get; set; }
        public Usuario Usuario { get; set; }
        public ICollection<Colmeia> Colmeias { get; set; }
    }
}
