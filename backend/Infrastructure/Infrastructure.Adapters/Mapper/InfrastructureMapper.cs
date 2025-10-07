using Arbeidstilsynet.ExampleBackend.Domain.Data;
using Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Db.Model;
using Mapster;

namespace Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Mapper;

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
