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
    [Authorize(Roles = "Admin")] 
public async Task<ActionResult<TransaccionDto>> TransaccionCreate(CreateTransaccionDto dto)
    {
        try
        {
            // Obtener cuentas según IDs
            Cuenta? cuentaOrigen = null;
            Cuenta? cuentaDestino = null;

            if (dto.CuentaOrigenId.HasValue)
            {
                cuentaOrigen = await _context.Cuentas.FirstOrDefaultAsync(c => c.CuentaId == dto.CuentaOrigenId.Value);
                if (cuentaOrigen == null)
                    return BadRequest("Cuenta origen no existe.");
            }

            if (dto.CuentaDestinoId.HasValue)
            {
                cuentaDestino = await _context.Cuentas.FirstOrDefaultAsync(c => c.CuentaId == dto.CuentaDestinoId.Value);
                if (cuentaDestino == null)
                    return BadRequest("Cuenta destino no existe.");
            }

            switch (dto.TipoTransaccion.ToLower())
            {
                case "deposito":
                    if (cuentaDestino == null)
                        return BadRequest("Cuenta destino requerida para depósito.");
                    cuentaDestino.Saldo += dto.Monto;
                    break;

                case "retiro":
                    if (cuentaOrigen == null)
                        return BadRequest("Cuenta origen requerida para retiro.");
                    if (cuentaOrigen.Saldo < dto.Monto)
                        return BadRequest("Saldo insuficiente en cuenta origen.");
                    cuentaOrigen.Saldo -= dto.Monto;
                    break;

                case "transferencia":
                    if (cuentaOrigen == null || cuentaDestino == null)
                        return BadRequest("Cuentas origen y destino requeridas para transferencia.");
                    if (cuentaOrigen.Saldo < dto.Monto)
                        return BadRequest("Saldo insuficiente en cuenta origen.");
                    cuentaOrigen.Saldo -= dto.Monto;
                    cuentaDestino.Saldo += dto.Monto;
                    break;

                default:
                    return BadRequest("Tipo de transacción no válido. Debe ser 'deposito', 'retiro' o 'transferencia'.");
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
            return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")] 
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
    [Authorize(Roles = "Admin")] 
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