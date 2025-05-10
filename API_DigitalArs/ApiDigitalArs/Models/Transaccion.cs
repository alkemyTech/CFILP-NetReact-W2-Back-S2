public class Transaccion
{
    public int transaccion_id { get; set; }
    public decimal monto { get; set; }
    public DateTime fecha { get; set; }
    public string descripcion { get; set; } = null!;
    public string estado { get; set; } = null!; 
    public string tipo_transaccion { get; set; } = null!;
    public int? cuenta_origen_id { get; set; }
    public int? cuenta_destino_id { get; set; }
}