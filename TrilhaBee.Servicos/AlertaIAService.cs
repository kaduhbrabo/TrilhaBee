using System.Collections.Generic;
using TrilhaBee.Servicos.Interfaces;

namespace TrilhaBee.Servicos
{
    public class AlertaIAService : IAlertaIAService
    {
        public string AnalisarInspecao(int forcaColmeia, int nivelAlimento, bool temRainha, bool temPostura)
        {
            var alertas = new List<string>();

            if (forcaColmeia < 3)
            {
                alertas.Add("Força da colmeia está baixa. Considere unificação ou alimentação estimulante.");
            }

            if (nivelAlimento < 3)
            {
                alertas.Add("Nível de alimento crítico. É necessário fornecer alimentação suplementar imediatamente.");
            }

            if (!temRainha)
            {
                alertas.Add("Ausência de rainha detectada. Avalie a introdução de uma nova rainha ou fusão com outra colmeia.");
            }
            else if (!temPostura)
            {
                alertas.Add("Rainha presente, mas sem postura. Monitore de perto; a rainha pode estar falhando.");
            }

            if (alertas.Count > 0)
            {
                return string.Join(" ", alertas);
            }

            return null;
        }
    }
}
