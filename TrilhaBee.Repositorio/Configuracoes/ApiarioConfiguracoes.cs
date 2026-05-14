using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Configuracoes
{
    public class ApiarioConfiguracoes : IEntityTypeConfiguration<Apiario>
    {
        public void Configure(EntityTypeBuilder<Apiario> builder)
        {   
            builder.ToTable("Apiario");
            builder.HasKey(a => a.ApiarioID);

            builder.Property(a => a.ApiarioID).HasColumnName("ApiarioID");
            builder.Property(a => a.Nome).HasColumnName("Nome").IsRequired(true).HasMaxLength(150);
            builder.Property(a => a.Localizacao).HasColumnName("Localizacao").HasMaxLength(300);
            builder.Property(a => a.DataCriacao).HasColumnName("DataCriacao").IsRequired(true);
            builder.Property(a => a.Capacidade).HasColumnName("Capacidade").IsRequired(true);

            // Relacionamentos
            builder.HasOne(a => a.Usuario)
                   .WithMany() // Opcional adicionar na classe Usuario ICollection<Apiario>
                   .HasForeignKey(a => a.UsuarioID)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
