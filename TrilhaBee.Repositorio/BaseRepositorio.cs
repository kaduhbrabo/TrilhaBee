public abstract class BaseRepositorio
{
    protected readonly TrilhaBeeContexto _contexto;

    public BaseRepositorio(TrilhaBeeContexto contexto)
    {
        _contexto = contexto;
    }
}