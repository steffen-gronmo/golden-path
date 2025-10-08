using Arbeidstilsynet.GoldenPathBackend.Domain.Data;

namespace Arbeidstilsynet.GoldenPathBackend.Infrastructure.Ports;

public interface ISakRepository
{
    public Task<Sak> PersistSak(string organisajonsnummer);

    public Task<Sak?> UpdateSakStatus(Guid id, SakStatus sakStatus);
    public Task<Sak?> GetSak(Guid? id);

    public Task<IEnumerable<Sak>> GetSaker();
}
