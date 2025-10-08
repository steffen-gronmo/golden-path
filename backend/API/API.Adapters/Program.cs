using Arbeidstilsynet.Common.AspNetCore.Extensions.Extensions;
using Arbeidstilsynet.GoldenPathBackend.API.Adapters;
using Arbeidstilsynet.GoldenPathBackend.API.Adapters.Extensions;
using Arbeidstilsynet.GoldenPathBackend.Domain.Logic;
using Arbeidstilsynet.GoldenPathBackend.Domain.Logic.DependencyInjection;
using Arbeidstilsynet.GoldenPathBackend.Infrastructure.Adapters.DependencyInjection;
using IAssemblyInfo = Arbeidstilsynet.GoldenPathBackend.API.Adapters.IAssemblyInfo;

var builder = WebApplication.CreateBuilder(args);

var appSettings = builder.Configuration.GetRequired<AppSettings>();
var services = builder.Services;
var env = builder.Environment;

var appNameFromConfig = Environment.GetEnvironmentVariable("OTEL_SERVICE_NAME");
services.ConfigureStandardApi(
    string.IsNullOrEmpty(appNameFromConfig) ? IAssemblyInfo.AppName : appNameFromConfig,
    appSettings.ApiConfig,
    env
);

services.AddDomain(appSettings.DomainConfig);
services.AddInfrastructure(appSettings.InfrastructureConfig);

var app = builder.Build();

if (env.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.AddStandardApi();

await app.RunAsync();
