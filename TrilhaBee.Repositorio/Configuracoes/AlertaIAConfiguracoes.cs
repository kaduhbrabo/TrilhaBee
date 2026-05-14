using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Configuracoes
{
    public class AlertaIAConfiguracoes : IEntityTypeConfiguration<AlertaIA>
    {
        public void Configure(EntityTypeBuilder<AlertaIA> builder)
        {   
            builder.ToTable("AlertaIA");
            builder.HasKey(a => a.AlertaIAID);

            builder.Property(a => a.AlertaIAID).HasColumnName("AlertaIAID");
            builder.Property(a => a.Mensagem).HasColumnName("Mensagem").IsRequired(true).HasMaxLength(500);
            builder.Property(a => a.DataGeracao).HasColumnName("DataGeracao").IsRequired(true);
            builder.Property(a => a.NivelGravidade).HasColumnName("NivelGravidade").HasMaxLength(50);
            builder.Property(a => a.Resolvido).HasColumnName("Resolvido").IsRequired(true);

            // Relacionamentos
            builder.HasOne(a => a.Colmeia)
                   .WithMany(c => c.Alertas)
                   .HasForeignKey(a => a.ColmeiaID)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
