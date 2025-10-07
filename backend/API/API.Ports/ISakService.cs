using Arbeidstilsynet.ExampleBackend.API.Ports.Requests;
using Arbeidstilsynet.ExampleBackend.Domain.Data;

namespace Arbeidstilsynet.ExampleBackend.API.Ports;

public interface ISakService
{
    public Task<Sak> CreateNewSak(CreateSakDto sakDto);

    public Task<Sak> StartSak(Guid sakId);

    public Task<Sak> EndSak(Guid sakId);
    public Task<Sak> ArchiveSak(Guid sakId);

    public Task<IEnumerable<Sak>> GetAllSaker();

    public Task<Sak> GetSakById(Guid sakId);
}
