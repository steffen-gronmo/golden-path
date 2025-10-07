using System.Diagnostics;

namespace Arbeidstilsynet.ExampleBackend.API.Adapters;

internal static class Tracer
{
    public static readonly ActivitySource Source = new("API.Adapters");
}
