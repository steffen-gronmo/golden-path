using Arbeidstilsynet.GoldenPathBackend.Domain.Data;
using Arbeidstilsynet.GoldenPathBackend.Infrastructure.Adapters.Db.Model;
using Mapster;

namespace Arbeidstilsynet.GoldenPathBackend.Infrastructure.Adapters.Mapper;

internal class InfrastructureMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<SakEntity, Sak>()
            .NameMatchingStrategy(NameMatchingStrategy.Flexible)
            .Map(target => target.LastUpdated, source => source.UpdatedAt);
    }
}
