using System.ComponentModel.DataAnnotations;
using Arbeidstilsynet.ExampleBackend.Domain.Logic;
using Arbeidstilsynet.ExampleBackend.Domain.Logic.DependencyInjection;
using Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.DependencyInjection;

namespace Arbeidstilsynet.ExampleBackend.API.Adapters;

internal record AppSettings
{
    [ConfigurationKeyName("API")]
    public ApiConfiguration ApiConfig { get; init; } = new();

    [Required]
    [ConfigurationKeyName("Infrastructure")]
    public required InfrastructureConfiguration InfrastructureConfig { get; init; }

    [ConfigurationKeyName("Domain")]
    public required DomainConfiguration DomainConfig { get; init; }
}

internal record ApiConfiguration
{
    [ConfigurationKeyName("Cors")]
    public CorsConfiguration Cors { get; init; } = new();
}

internal record CorsConfiguration
{
    [Required]
    public string[] AllowedOrigins { get; init; } = [];

    [Required]
    public bool AllowCredentials { get; init; } = false;
}
