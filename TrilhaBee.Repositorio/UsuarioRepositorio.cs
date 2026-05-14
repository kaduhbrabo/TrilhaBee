using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio
{
    public class UsuarioRepositorio : BaseRepositorio, IUsuarioRepositorio
    {
        public UsuarioRepositorio(TrilhaBeeContexto contexto) : base(contexto)
        {
        }


        public int Adicionar(Usuario usuario)
        {
            _contexto.Usuarios.Add(usuario);
            _contexto.SaveChanges();

            return usuario.UsuarioID;
        }

        public void Atualizar(Usuario usuario)
        {
            _contexto.Usuarios.Update(usuario);
            _contexto.SaveChanges();
        }

        public Usuario ObterPorId(int usuarioId)
        {
            return _contexto.Usuarios.Where(u => u.UsuarioID == usuarioId).FirstOrDefault();
        }

        public Usuario ObterPorEmail(string email)
        {
            return _contexto.Usuarios.Where(u => u.Email == email).FirstOrDefault();
        }

        public void Excluir(int usuarioId)
        {
            var usuario = _contexto.Usuarios.Find(usuarioId);
            if (usuario != null)
            {
                _contexto.Usuarios.Remove(usuario);
                _contexto.SaveChanges();
            }
        }

        public IEnumerable<Usuario> Listar()
        {
            return _contexto.Usuarios.ToList();
        }
    }
}