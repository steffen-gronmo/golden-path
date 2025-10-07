using Arbeidstilsynet.Common.AspNetCore.Extensions.Extensions;
using Arbeidstilsynet.ExampleBackend.API.Adapters;
using Arbeidstilsynet.ExampleBackend.API.Adapters.Extensions;
using Arbeidstilsynet.ExampleBackend.Domain.Logic;
using Arbeidstilsynet.ExampleBackend.Domain.Logic.DependencyInjection;
using Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.DependencyInjection;
using IAssemblyInfo = Arbeidstilsynet.ExampleBackend.API.Adapters.IAssemblyInfo;

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
