using System.Diagnostics;

namespace Arbeidstilsynet.ExampleBackend.Domain.Logic;

internal static class Tracer
{
    public static readonly ActivitySource Source = new("Domain.Logic");
}
