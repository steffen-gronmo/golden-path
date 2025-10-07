using Arbeidstilsynet.ExampleBackend.Domain.Data;
using Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Db.Model;
using Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Test.Fixtures;
using Arbeidstilsynet.ExampleBackend.Infrastructure.Ports;
using Bogus;
using Shouldly;
using Xunit.Abstractions;
using Xunit.Microsoft.DependencyInjection.Abstracts;

namespace Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Test;

public class SakRepositoryTests(
    ITestOutputHelper testOutputHelper,
    InfrastructureAdapterTestFixture infrastractureAdapterTestFixture
) : TestBed<InfrastructureAdapterTestFixture>(testOutputHelper, infrastractureAdapterTestFixture)
{
    private readonly ISakRepository _sut =
        infrastractureAdapterTestFixture.GetService<ISakRepository>(testOutputHelper)!;

    private static readonly string SampleOrgNr = "123456789";

    [Fact]
    public async Task CreateSak_WhenCalled_PersistsSakEntityAsync()
    {
        // act
        var createdSak = await _sut.PersistSak(SampleOrgNr);
        // assert
        var result = await _sut.GetSak(createdSak.Id);
        result?.Organisajonsnummer.ShouldBe(SampleOrgNr);
    }

    [Fact]
    public async Task UpdateSakStatus_WhenCalled_PersistsSakEntityAsync()
    {
        // arrange
        var createdSak = await _sut.PersistSak(SampleOrgNr);
        // act
        var updatedSak = await _sut.UpdateSakStatus(createdSak.Id, SakStatus.InProgress);
        // assert
        updatedSak.ShouldBeEquivalentTo(
            createdSak with
            {
                Status = SakStatus.InProgress,
                LastUpdated = updatedSak!.LastUpdated,
            }
        );
    }

    [Fact]
    public async Task GetSaker_WhenCalled_ReturnsAllSaker()
    {
        // arrange
        var seed = _fixture.SeededEntities;
        // act
        var allSaker = await _sut.GetSaker();
        // assert
        seed.Select(sak => sak.Id).ToList().ShouldBeSubsetOf([.. allSaker.Select(sak => sak.Id)]);
    }
}
