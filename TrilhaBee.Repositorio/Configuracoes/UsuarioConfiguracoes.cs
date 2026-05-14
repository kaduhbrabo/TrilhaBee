using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrilhaBee.Dominio.Entidades;

namespace TrilhaBee.Repositorio.Configuracoes
{
    public class UsuarioConfiguracoes : IEntityTypeConfiguration<TrilhaBee.Dominio.Entidades.Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {   
            builder.ToTable("Usuario");

            builder.Property(nameof(Usuario.UsuarioID)).HasColumnName("UsuarioID");
            builder.Property(nameof(Usuario.Nome)).HasColumnName("Nome").IsRequired(true);
            builder.Property(nameof(Usuario.Email)).HasColumnName("Email").IsRequired(true);
            builder.Property(nameof(Usuario.Senha)).HasColumnName("Senha").IsRequired(true);
            builder.Property(nameof(Usuario.Tipo)).HasColumnName("Tipo").IsRequired(true);
        }
    }
}