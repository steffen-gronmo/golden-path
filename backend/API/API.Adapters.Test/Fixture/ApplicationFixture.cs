using Arbeidstilsynet.GoldenPathBackend.API.Ports;
using Arbeidstilsynet.GoldenPathBackend.API.Ports.Requests;
using Arbeidstilsynet.GoldenPathBackend.Domain.Data;
using Arbeidstilsynet.GoldenPathBackend.Infrastructure.Adapters.Db;
using Arbeidstilsynet.GoldenPathBackend.Infrastructure.Adapters.DependencyInjection;
using Arbeidstilsynet.GoldenPathBackend.Infrastructure.Adapters.Test.Fixtures;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Arbeidstilsynet.GoldenPathBackend.API.Adapters.Test.Fixture;

public class ApplicationFixture : WebApplicationFactory<IAssemblyInfo>, IAsyncLifetime
{
    private readonly PostgresDbDemoFixture _postgresDbDemoFixture = new();

    private Sak? _seededSak;
    internal Sak SeededSak =>
        _seededSak ?? throw new InvalidOperationException("Database not seeded yet");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<InfrastructureConfiguration>();
            services.AddSingleton(
                new InfrastructureConfiguration
                {
                    ConnectionString = _postgresDbDemoFixture.ConnectionString,
                }
            );
            services.RemoveAll<SakDbContext>();
            services.RemoveAll<DbContextOptions<SakDbContext>>();
            services.AddDbContext<SakDbContext>(opt =>
            {
                opt.UseNpgsql(_postgresDbDemoFixture.ConnectionString);
            });
        });
    }

    private async Task SeedDatabase()
    {
        using var scope = Services.CreateScope();
        var sakService = scope.ServiceProvider.GetRequiredService<ISakService>();

        _seededSak = await sakService.CreateNewSak(
            new CreateSakDto() { Organisajonsnummer = "123456789" }
        );
    }

    public async Task InitializeAsync()
    {
        await _postgresDbDemoFixture.InitializeAsync();
        await SeedDatabase();
    }

    public new async Task DisposeAsync()
    {
        await _postgresDbDemoFixture.DisposeAsync();
    }
}
