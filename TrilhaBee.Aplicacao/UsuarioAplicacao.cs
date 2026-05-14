using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Aplicacao
{
    public class UsuarioAplicacao
    {
        readonly IUsuarioRepositorio _usuarioRepositorio;

        public UsuarioAplicacao(IUsuarioRepositorio usuarioRepositorio)
        {
            _usuarioRepositorio = usuarioRepositorio;
        }

        public int Criar(Usuario usuario)
        {
            if (usuario == null)
            {
                throw new Exception("Usuário não pode ser vazio.");
            }
            if (string.IsNullOrEmpty(usuario.Senha))
            {
                throw new Exception("Senha de usuário não pode ser vazia.");
            }
            
            ValidarInformacoesUsuario(usuario);

            return _usuarioRepositorio.Adicionar(usuario);

        }

        public void Atualizar(Usuario usuario)
        {
            var usuarioDominio = _usuarioRepositorio.ObterPorId(usuario.UsuarioID);

            if (usuarioDominio == null)
                throw new Exception("Usuário não encontrado."); 
    
            ValidarInformacoesUsuario(usuario);

            usuarioDominio.Nome = usuario.Nome;
            usuarioDominio.Email = usuario.Email;

            _usuarioRepositorio.Atualizar(usuario);
        }   

        public void Excluir(int id)
        {
            _usuarioRepositorio.Excluir(id);
        }

        public Usuario ObterPorId(int id)
        {
            return _usuarioRepositorio.ObterPorId(id);
        }

        public IEnumerable<Usuario> ObterTodos()
        {
            return _usuarioRepositorio.Listar();
        }

        public Usuario ValidarLogin(string email, string senha)
        {
            var usuario = _usuarioRepositorio.ObterPorEmail(email);
            if (usuario == null || usuario.Senha != senha)
            {
                throw new Exception("E-mail ou senha inválidos.");
            }
            return usuario;
        }

        #region Util

        private static void ValidarInformacoesUsuario(Usuario usuario)
        {   
            if (string.IsNullOrEmpty(usuario.Nome))
            {
                throw new Exception("Nome de usuário não pode ser vazio.");
            }
            if (string.IsNullOrEmpty(usuario.Email))
            {
                throw new Exception("Email de usuário não pode ser vazio.");
            }
        }

            #endregion
    }
}