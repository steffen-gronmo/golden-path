using Arbeidstilsynet.ExampleBackend.API.Ports;
using Arbeidstilsynet.ExampleBackend.API.Ports.Requests;
using Arbeidstilsynet.ExampleBackend.Domain.Data;
using Arbeidstilsynet.ExampleBackend.Domain.Logic.DependencyInjection;
using Arbeidstilsynet.ExampleBackend.Infrastructure.Ports;
using Microsoft.Extensions.Options;

namespace Arbeidstilsynet.ExampleBackend.Domain.Logic;

internal class SakService(ISakRepository sakRepository, IOptions<DomainConfiguration> domainConfig)
    : ISakService
{
    private readonly string _someConfigValue = domainConfig.Value.SomeSetting;

    public async Task<Sak> CreateNewSak(CreateSakDto sakDto)
    {
        using var activity = Tracer.Source.StartActivity();
        return await sakRepository.PersistSak(sakDto.Organisajonsnummer);
    }

    public async Task<IEnumerable<Sak>> GetAllSaker()
    {
        return await sakRepository.GetSaker();
    }

    public async Task<Sak> ArchiveSak(Guid sakId)
    {
        return await sakRepository.UpdateSakStatus(sakId, SakStatus.Archived)
            ?? throw new SakNotFoundException(sakId);
    }

    public async Task<Sak> EndSak(Guid sakId)
    {
        return await sakRepository.UpdateSakStatus(sakId, SakStatus.Done)
            ?? throw new SakNotFoundException(sakId);
    }

    public async Task<Sak> StartSak(Guid sakId)
    {
        return await sakRepository.UpdateSakStatus(sakId, SakStatus.InProgress)
            ?? throw new SakNotFoundException(sakId);
    }

    public async Task<Sak> GetSakById(Guid sakId)
    {
        return await sakRepository.GetSak(sakId) ?? throw new SakNotFoundException(sakId);
    }
}
