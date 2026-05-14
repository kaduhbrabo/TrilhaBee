using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Configuracoes
{
    public class ColmeiaConfiguracoes : IEntityTypeConfiguration<Colmeia>
    {
        public void Configure(EntityTypeBuilder<Colmeia> builder)
        {   
            builder.ToTable("Colmeia");
            builder.HasKey(c => c.ColmeiaID);

            builder.Property(c => c.ColmeiaID).HasColumnName("ColmeiaID");
            builder.Property(c => c.Identificacao).HasColumnName("Identificacao").IsRequired(true).HasMaxLength(100);
            builder.Property(c => c.TipoAbelha).HasColumnName("TipoAbelha").HasMaxLength(100);
            builder.Property(c => c.DataInstalacao).HasColumnName("DataInstalacao").IsRequired(true);
            builder.Property(c => c.Ativa).HasColumnName("Ativa").IsRequired(true);

            // Relacionamentos
            builder.HasOne(c => c.Apiario)
                   .WithMany(a => a.Colmeias)
                   .HasForeignKey(c => c.ApiarioID)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
