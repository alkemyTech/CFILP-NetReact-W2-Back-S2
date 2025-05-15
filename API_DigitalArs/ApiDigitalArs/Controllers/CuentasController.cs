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
    public async Task<ActionResult<IEnumerable<Cuenta>>> GetCuentas()
    {
        return await _context.Cuentas.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Cuenta>> GetCuenta(int id)
    {
        var cuenta = await _context.Cuentas.FindAsync(id);
        if (cuenta == null) return NotFound();
        return cuenta;
    }

    [HttpPost]
    public async Task<ActionResult<Cuenta>> PostCuenta(Cuenta cuenta)
    {
        _context.Cuentas.Add(cuenta);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCuenta), new { id = cuenta.CuentaId }, cuenta);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PutCuenta(int id, Cuenta cuenta)
    {
        if (id != cuenta.CuentaId) return BadRequest();
        _context.Entry(cuenta).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Cuentas.Any(e => e.CuentaId == id)) return NotFound();
            else throw;
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCuenta(int id)
    {
        var cuenta = await _context.Cuentas.FindAsync(id);
        if (cuenta == null) return NotFound();
        _context.Cuentas.Remove(cuenta);
        await _context.SaveChangesAsync();
        return Ok(cuenta);
    }
}