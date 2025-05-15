public class Transaccion
{
    public int TransaccionId { get; set; }
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public string Descripcion { get; set; } = null!;
    public string Estado { get; set; } = null!; 
    public string TipoTransaccion { get; set; } = null!;
    
    // FK a cuenta origen (nullable)
    public int? CuentaOrigenId { get; set; }
    public Cuenta? CuentaOrigen { get; set; }

    // FK a cuenta destino (nullable)
    public int? CuentaDestinoId { get; set; }
    public Cuenta? CuentaDestino { get; set; }
}