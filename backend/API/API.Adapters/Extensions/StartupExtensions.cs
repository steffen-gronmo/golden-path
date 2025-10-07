using System.Net;
using Arbeidstilsynet.Common.AspNetCore.Extensions.Extensions;
using Arbeidstilsynet.ExampleBackend.API.Ports;

namespace Arbeidstilsynet.ExampleBackend.API.Adapters.Extensions;

internal static class StartupExtensions
{
    public static IServiceCollection ConfigureStandardApi(
        this IServiceCollection services,
        string appName,
        ApiConfiguration apiConfiguration,
        IWebHostEnvironment env
    )
    {
        services.AddLogging(configure =>
        {
            configure.SetMinimumLevel(LogLevel.Information);
        });
        services.ConfigureApi();
        services.ConfigureOpenTelemetry(appName);
        services.ConfigureSwagger();

        services.ConfigureCors(
            apiConfiguration.Cors.AllowedOrigins,
            apiConfiguration.Cors.AllowCredentials,
            env.IsDevelopment()
        );

        return services;
    }

    public static WebApplication AddStandardApi(this WebApplication app)
    {
        app.AddApi(options =>
            options.AddExceptionMapping<SakNotFoundException>(HttpStatusCode.NotFound)
        );
        app.UseCors();
        app.AddScalar();

        return app;
    }
}
