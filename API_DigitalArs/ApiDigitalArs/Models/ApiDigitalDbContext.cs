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

}