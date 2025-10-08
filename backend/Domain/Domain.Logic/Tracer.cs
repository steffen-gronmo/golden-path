using System.Diagnostics;

namespace Arbeidstilsynet.GoldenPathBackend.Domain.Logic;

internal static class Tracer
{
    public static readonly ActivitySource Source = new("Domain.Logic");
}
