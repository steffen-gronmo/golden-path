using System.Diagnostics;

namespace Arbeidstilsynet.GoldenPathBackend.API.Adapters;

internal static class Tracer
{
    public static readonly ActivitySource Source = new("API.Adapters");
}
