using System.Diagnostics;

namespace Arbeidstilsynet.GoldenPathBackend.Infrastructure.Adapters;

internal static class Tracer
{
    public static readonly ActivitySource Source = new("Infrastructure.Adapters");
}
