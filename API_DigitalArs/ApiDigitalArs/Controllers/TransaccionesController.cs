using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class TransaccionesController : ControllerBase
{
    private readonly ApiDigitalDbContext _context;

    public TransaccionesController(ApiDigitalDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransaccionDto>>> GetTransacciones()
    {
        var transacciones = await _context.Transacciones
            .Select(t => new TransaccionDto
            {
                TransaccionId = t.TransaccionId,
                Monto = t.Monto,
                Fecha = t.Fecha,
                Descripcion = t.Descripcion,
                Estado = t.Estado,
                TipoTransaccion = t.TipoTransaccion,
                CuentaOrigenId = t.CuentaOrigenId,
                CuentaDestinoId = t.CuentaDestinoId
            })
            .ToListAsync();

        return Ok(transacciones);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TransaccionDto>> GetTransaccion(int id)
    {
        var transaccion = await _context.Transacciones
        .Where(t => t.TransaccionId == id)
        .Select(t => new TransaccionDto
        {
            TransaccionId = t.TransaccionId,
            Monto = t.Monto,
            Fecha = t.Fecha,
            Descripcion = t.Descripcion,
            Estado = t.Estado,
            TipoTransaccion = t.TipoTransaccion,
            CuentaOrigenId = t.CuentaOrigenId,
            CuentaDestinoId = t.CuentaDestinoId
        })
        .FirstOrDefaultAsync();

        if (transaccion == null)
        {
            return NotFound();
        }

        return Ok(transaccion);
    }

    [HttpPost]
    // [Authorize]   --Fausto: Comentando para pruebas
    public async Task<ActionResult<TransaccionDto>> TransaccionCreate(CreateTransaccionDto dto)
    {
        try
        {
            // Validar que las cuentas existan
            var cuentaOrigenExiste = dto.CuentaOrigenId == null || await _context.Cuentas.AnyAsync(c => c.CuentaId == dto.CuentaOrigenId);
            var cuentaDestinoExiste = dto.CuentaDestinoId == null || await _context.Cuentas.AnyAsync(c => c.CuentaId == dto.CuentaDestinoId);

            if (!cuentaOrigenExiste || !cuentaDestinoExiste)
            {
                return BadRequest("Cuenta origen o destino no existe.");
            }

            var transaccion = new Transaccion
            {
                Monto = dto.Monto,
                Fecha = DateTime.Now,
                Descripcion = dto.Descripcion,
                Estado = dto.Estado,
                TipoTransaccion = dto.TipoTransaccion,
                CuentaOrigenId = dto.CuentaOrigenId,
                CuentaDestinoId = dto.CuentaDestinoId
            };

            _context.Transacciones.Add(transaccion);
            await _context.SaveChangesAsync();

            // Convertimos a DTO para retornar
            var resultDto = new TransaccionDto
            {
                TransaccionId = transaccion.TransaccionId,
                Monto = transaccion.Monto,
                Fecha = transaccion.Fecha,
                Descripcion = transaccion.Descripcion,
                Estado = transaccion.Estado,
                TipoTransaccion = transaccion.TipoTransaccion,
                CuentaOrigenId = transaccion.CuentaOrigenId,
                CuentaDestinoId = transaccion.CuentaDestinoId
            };

            return CreatedAtAction(nameof(GetTransacciones), new { id = transaccion.TransaccionId }, resultDto);
        }
        catch (Exception ex)
        {
            // Manejo de errores
            return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    // [Authorize(Roles = "Admin")] ----Fausto: Comentando para pruebas
    public async Task<IActionResult> TransaccionUpdate(int id, UpdateTransaccionDto dto)
    {
        var transaccion = await _context.Transacciones.FindAsync(id);

        if (transaccion == null)
        {
            return NotFound();
        }

        // Mapping manual
        transaccion.Monto = dto.Monto;
        transaccion.Descripcion = dto.Descripcion;
        transaccion.Estado = dto.Estado;
        transaccion.TipoTransaccion = dto.TipoTransaccion;
        transaccion.CuentaOrigenId = dto.CuentaOrigenId;
        transaccion.CuentaDestinoId = dto.CuentaDestinoId;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Transacciones.Any(t => t.TransaccionId == id))
                return NotFound();

            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    // [Authorize(Roles = "Admin")] --Fausto: Comentando para pruebas
    public async Task<IActionResult> DeleteTransaccion(int id)
    {
        var transaccion = await _context.Transacciones.FindAsync(id);

        if (transaccion == null)
        {
            return NotFound();
        }

        _context.Transacciones.Remove(transaccion);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}