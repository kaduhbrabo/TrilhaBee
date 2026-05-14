using TrilhaBee.Dominio.Entidades;

public interface IUsuarioRepositorio
{
    int Adicionar(Usuario usuario);

    void Atualizar(Usuario usuario);

    Usuario ObterPorId(int usuarioId);

    Usuario ObterPorEmail(string email);

    void Excluir(int usuarioId);

    IEnumerable<Usuario> Listar();
}