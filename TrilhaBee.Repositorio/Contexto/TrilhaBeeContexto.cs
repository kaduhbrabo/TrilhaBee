using Microsoft.EntityFrameworkCore;
using TrilhaBee.Dominio.Entidades;
using TrilhaBee.Repositorio.Configuracoes;

public class TrilhaBeeContexto : DbContext
{   
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Apiario> Apiarios { get; set; }
    public DbSet<Colmeia> Colmeias { get; set; }
    public DbSet<Inspecao> Inspecoes { get; set; }
    public DbSet<AcaoManejo> AcoesManejo { get; set; }
    public DbSet<AlertaIA> Alertas { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=DESKTOP-HRI9LP9\\SQLEXPRESS;Database=TrilhaBee;Trusted_Connection=True;TrustServerCertificate=True");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UsuarioConfiguracoes());
        modelBuilder.ApplyConfiguration(new ApiarioConfiguracoes());
        modelBuilder.ApplyConfiguration(new ColmeiaConfiguracoes());
        modelBuilder.ApplyConfiguration(new InspecaoConfiguracoes());
        modelBuilder.ApplyConfiguration(new AcaoManejoConfiguracoes());
        modelBuilder.ApplyConfiguration(new AlertaIAConfiguracoes());
    }
}