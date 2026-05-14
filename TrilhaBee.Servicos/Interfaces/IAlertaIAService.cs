namespace TrilhaBee.Servicos.Interfaces
{
    public interface IAlertaIAService
    {
        string AnalisarInspecao(int forcaColmeia, int nivelAlimento, bool temRainha, bool temPostura);
    }
}
