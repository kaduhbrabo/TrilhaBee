using TrilhaBee.Dominio.Enumeradores;

namespace TrilhaBee.Dominio.Entidades
{
    public class Usuario
    {   
        public int UsuarioID { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public TipoUsuario Tipo { get; set; }
    }
}