using Arbeidstilsynet.GoldenPathBackend.API.Ports;
using Arbeidstilsynet.GoldenPathBackend.API.Ports.Requests;
using Arbeidstilsynet.GoldenPathBackend.Domain.Data;
using Microsoft.AspNetCore.Mvc;

namespace Arbeidstilsynet.GoldenPathBackend.API.Adapters.WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class SakerController(ISakService sakService) : ControllerBase
{
    // POST
    [HttpPost()]
    public async Task<ActionResult<Sak>> CreateSak([FromBody] CreateSakDto sakDto)
    {
        using var activity = Tracer.Source.StartActivity();
        var result = await sakService.CreateNewSak(sakDto);
        return Ok(result);
    }

    // GET saker
    [HttpGet]
    public async Task<ActionResult<List<Sak>>> Get()
    {
        return Ok(await sakService.GetAllSaker());
    }

    // GET saker/{sakId}
    [HttpGet("{sakId:guid}")]
    public async Task<ActionResult<Sak>> GetById([FromRoute] Guid sakId)
    {
        return Ok(await sakService.GetSakById(sakId));
    }
}
