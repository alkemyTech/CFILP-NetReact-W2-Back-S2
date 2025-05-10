public class Usuario{
    public int usuario_id { get; set; }
    public string nombre { get; set; } = null!;
    public string apellido { get; set; } = null!;
    public string dni { get; set; } = null!;
    public string email { get; set; } = null!;
    public string contraseña { get; set; } = null!;
    public int rol_id { get; set; }
}