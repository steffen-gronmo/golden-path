using Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Db;
using Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Db.Model;
using Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.DependencyInjection;
using Bogus;
using Microsoft.Extensions.DependencyInjection;
using Xunit.Microsoft.DependencyInjection;
using Xunit.Microsoft.DependencyInjection.Abstracts;
using Xunit.Sdk;

namespace Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Test.Fixtures;

public class InfrastructureAdapterTestFixture : TestBedFixture, IAsyncLifetime
{
    private readonly TestOutputHelper _testOutputHelper = new();
    private readonly PostgresDbDemoFixture _dbDemoFixture = new();

    private readonly Faker<SakEntity> _sakEntityFaker = TestData.CreateSakEntityFaker();
    internal List<SakEntity> SeededEntities { get; }

    public InfrastructureAdapterTestFixture()
    {
        SeededEntities = _sakEntityFaker.Generate(50);
    }

    protected override void AddServices(
        IServiceCollection services,
        global::Microsoft.Extensions.Configuration.IConfiguration? configuration
    )
    {
        services.AddInfrastructure(
            new InfrastructureConfiguration() { ConnectionString = _dbDemoFixture.ConnectionString }
        );
    }

    protected override ValueTask DisposeAsyncCore() => new();

    protected override IEnumerable<TestAppSettings> GetTestAppSettings()
    {
        yield return new() { Filename = "appsettings.json", IsOptional = true };
    }

    private async Task SeedDatabase()
    {
        var dbContext = GetService<SakDbContext>(_testOutputHelper)!;

        await dbContext.Database.EnsureCreatedAsync();
        await dbContext.Saker.AddRangeAsync(SeededEntities);
        await dbContext.SaveChangesAsync();
    }

    public async Task InitializeAsync()
    {
        await _dbDemoFixture.InitializeAsync();
        await SeedDatabase();
    }

    public new Task DisposeAsync()
    {
        return _dbDemoFixture.DisposeAsync();
    }
}
