using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Configuracoes
{
    public class InspecaoConfiguracoes : IEntityTypeConfiguration<Inspecao>
    {
        public void Configure(EntityTypeBuilder<Inspecao> builder)
        {   
            builder.ToTable("Inspecao");
            builder.HasKey(i => i.InspecaoID);

            builder.Property(i => i.InspecaoID).HasColumnName("InspecaoID");
            builder.Property(i => i.DataInspecao).HasColumnName("DataInspecao").IsRequired(true);
            builder.Property(i => i.Observacoes).HasColumnName("Observacoes").HasMaxLength(1000);
            builder.Property(i => i.TemRainha).HasColumnName("TemRainha").IsRequired(true);
            builder.Property(i => i.CondicaoGeral).HasColumnName("CondicaoGeral").HasMaxLength(50);

            // Relacionamentos
            builder.HasOne(i => i.Colmeia)
                   .WithMany(c => c.Inspecoes)
                   .HasForeignKey(i => i.ColmeiaID)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
