using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class CuentasController : ControllerBase
{
    private readonly ApiDigitalDbContext _context;

    public CuentasController(ApiDigitalDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CuentaDto>>> GetCuentas()
    {
        var cuentas = await _context.Cuentas
            .Select(c => new CuentaDto
            {
                CuentaId = c.CuentaId,
                UsuarioId = c.UsuarioId,
                Moneda = c.Moneda,
                Saldo = c.Saldo,
                FechaCreacion = c.FechaCreacion
            })
            .ToListAsync();

        return Ok(cuentas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CuentaDto>> GetCuenta(int id)
    {
        var cuenta = await _context.Cuentas
            .Where(c => c.CuentaId == id)
            .Select(c => new CuentaDto
            {
                CuentaId = c.CuentaId,
                UsuarioId = c.UsuarioId,
                Moneda = c.Moneda,
                Saldo = c.Saldo,
                FechaCreacion = c.FechaCreacion
            })
            .FirstOrDefaultAsync();

        if (cuenta == null)
            return NotFound();

        return Ok(cuenta);
    }

    [HttpPost]
    public async Task<ActionResult<CuentaDto>> CreateCuenta(CreateCuentaDto dto)
    {
        var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.UsuarioId == dto.UsuarioId);
        if (!usuarioExiste)
            return BadRequest("El usuario especificado no existe.");

        var cuenta = new Cuenta
        {
            UsuarioId = dto.UsuarioId,
            Moneda = dto.Moneda,
            Saldo = dto.Saldo,
            FechaCreacion = DateTime.Now
        };

        _context.Cuentas.Add(cuenta);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCuenta), new { id = cuenta.CuentaId }, new CuentaDto
        {
            CuentaId = cuenta.CuentaId,
            UsuarioId = cuenta.UsuarioId,
            Moneda = cuenta.Moneda,
            Saldo = cuenta.Saldo,
            FechaCreacion = cuenta.FechaCreacion
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")] 
    // [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCuenta(int id, CreateCuentaDto dto)
    {
        var cuenta = await _context.Cuentas.FindAsync(id);
        if (cuenta == null)
            return NotFound();

        var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.UsuarioId == dto.UsuarioId);
        if (!usuarioExiste)
            return BadRequest("El usuario especificado no existe.");

        cuenta.UsuarioId = dto.UsuarioId;
        cuenta.Moneda = dto.Moneda;
        cuenta.Saldo = dto.Saldo;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] 
    // [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCuenta(int id)
    {
        var cuenta = await _context.Cuentas.FindAsync(id);
        if (cuenta == null)
            return NotFound();

        _context.Cuentas.Remove(cuenta);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}