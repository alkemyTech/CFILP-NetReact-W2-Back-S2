using Microsoft.EntityFrameworkCore;

public class ApiDigitalDbContext : DbContext
{
    public ApiDigitalDbContext(DbContextOptions<ApiDigitalDbContext> options) : base(options)
    {
    }

    public DbSet<Cuenta> Cuentas { get; set; } = null!;
    public DbSet<Rol> Roles { get; set; } = null!;
    public DbSet<Transaccion> Transacciones { get; set; } = null!;
    public DbSet<Usuario> Usuarios { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        
    modelBuilder.Entity<Rol>(entity =>
    {
        entity.Property(e => e.RolNombre)
              .HasColumnType("TEXT")   // Cambiar nvarchar(max) a TEXT para SQLite
              .IsRequired();
    });

    // Para decimal en SQLite (solo si querés forzar precisión)
    modelBuilder.Entity<Cuenta>()
        .Property(c => c.Saldo)
        .HasConversion<double>();

    modelBuilder.Entity<Transaccion>()
        .Property(t => t.Monto)
        .HasConversion<double>();

    // Relaciones (igual que antes)
    modelBuilder.Entity<Transaccion>()
        .HasOne(t => t.CuentaOrigen)
        .WithMany(c => c.TransaccionesOrigen)
        .HasForeignKey(t => t.CuentaOrigenId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Transaccion>()
        .HasOne(t => t.CuentaDestino)
        .WithMany(c => c.TransaccionesDestino)
        .HasForeignKey(t => t.CuentaDestinoId)
        .OnDelete(DeleteBehavior.Restrict);
    }

}