using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Configuracoes
{
    public class AcaoManejoConfiguracoes : IEntityTypeConfiguration<AcaoManejo>
    {
        public void Configure(EntityTypeBuilder<AcaoManejo> builder)
        {   
            builder.ToTable("AcaoManejo");
            builder.HasKey(a => a.AcaoManejoID);

            builder.Property(a => a.AcaoManejoID).HasColumnName("AcaoManejoID");
            builder.Property(a => a.Descricao).HasColumnName("Descricao").IsRequired(true).HasMaxLength(500);
            builder.Property(a => a.DataRealizacao).HasColumnName("DataRealizacao").IsRequired(true);
            builder.Property(a => a.TipoManejo).HasColumnName("TipoManejo").HasMaxLength(100);

            // Relacionamentos
            builder.HasOne(a => a.Inspecao)
                   .WithMany(i => i.AcoesManejo)
                   .HasForeignKey(a => a.InspecaoID)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
