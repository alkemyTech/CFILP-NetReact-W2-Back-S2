public class Cuenta {
    public int cuenta_id { get; set; }
    public int usuario_id { get; set; }
    public string moneda { get; set; } = null!;
    public decimal saldo { get; set; }
    public DateTime fecha_creacion { get; set; }
}