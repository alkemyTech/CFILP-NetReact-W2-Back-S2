using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ApiDigitalArs.Models;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApiDigitalDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ApiDigitalDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("loginUsuario")]
    public async Task<IActionResult> LoginUsuario([FromBody] LoginRequest request)
    {
        var usuario = await _context.Usuarios
            .Include(u => u.Rol)
            .FirstOrDefaultAsync(u => u.Email == request.Username);

        if (usuario == null)
            return Unauthorized("Usuario no encontrado");

        if (usuario.Contraseña != request.Password)
            return Unauthorized("Contraseña incorrecta");

        // Crear token JWT
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol.RolNombre),
                new Claim("UsuarioId", usuario.UsuarioId.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        // Obtener la cuenta asociada al usuario
        var cuenta = await _context.Cuentas.FirstOrDefaultAsync(c => c.UsuarioId == usuario.UsuarioId);

        return Ok(new
        {
            token = tokenHandler.WriteToken(token),
            nombre = usuario.Nombre,
            usuarioId = usuario.UsuarioId,
            rol = usuario.Rol.RolNombre,
            cuentaId = cuenta?.CuentaId,
            saldo = cuenta?.Saldo
        });
    }
}