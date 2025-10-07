using Arbeidstilsynet.ExampleBackend.Domain.Data;
using Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Extensions;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SakEntity = Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Db.Model.SakEntity;

namespace Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Db;

internal class SakRepository(SakDbContext dbContext, IMapper mapper, ILogger<SakRepository> logger)
    : Ports.ISakRepository
{
    private SakDbContext DbContext
    {
        get
        {
            dbContext.Database.EnsureCreated();
            return dbContext;
        }
    }

    public async Task<Sak> PersistSak(string organisajonsnummer)
    {
        using var activity = Tracer.Source.StartActivity();
        var sakEntity = new SakEntity
        {
            Id = Guid.NewGuid(),
            Organisajonsnummer = organisajonsnummer,
            Status = SakStatus.New,
        };
        var updatedEntity = await DbContext.Saker.AddAsync(sakEntity);

        await DbContext.SaveChangesAsync();
        await updatedEntity.ReloadAsync();

        return mapper.Map<Sak>(updatedEntity.Entity);
    }

    public async Task<Sak?> UpdateSakStatus(Guid id, SakStatus sakStatus)
    {
        var entity = await DbContext.Saker.FindAsync(id);
        if (entity != null)
        {
            entity.Status = sakStatus;
            await DbContext.SaveChangesAsync();
            return mapper.Map<Sak>(entity);
        }
        logger.LogSakNotFound(id);
        return null;
    }

    public async Task<Sak?> GetSak(Guid? id)
    {
        var entity = await DbContext.Saker.FindAsync(id);
        if (entity != null)
        {
            return mapper.Map<Sak>(entity);
        }

        logger.LogSakNotFound(id);
        return null;
    }

    public async Task<IEnumerable<Sak>> GetSaker()
    {
        return await DbContext.Saker.Select(b => mapper.Map<Sak>(b)).ToListAsync();
    }
}
