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
    public async Task<ActionResult<IEnumerable<Transaccion>>> GetTransacciones()
    {
        return await _context.Transacciones.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Transaccion>> GetTransaccion(int id)
    {
        var transaccion = await _context.Transacciones.FindAsync(id);
        if (transaccion == null) return NotFound();
        return transaccion;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Transaccion>> PostTransaccion(Transaccion transaccion)
    {
        _context.Transacciones.Add(transaccion);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTransaccion), new { id = transaccion.transaccion_id }, transaccion);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PutTransaccion(int id, Transaccion transaccion)
    {
        if (id != transaccion.transaccion_id) return BadRequest();
        _context.Entry(transaccion).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Transacciones.Any(t => t.transaccion_id == id)) return NotFound();
            else throw;
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTransaccion(int id)
    {
        var transaccion = await _context.Transacciones.FindAsync(id);
        if (transaccion == null) return NotFound();
        _context.Transacciones.Remove(transaccion);
        await _context.SaveChangesAsync();
        return Ok(transaccion);
    }
}