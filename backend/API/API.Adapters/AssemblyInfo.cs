using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("API.Adapters.Test")]

namespace Arbeidstilsynet.GoldenPathBackend.API.Adapters;

public interface IAssemblyInfo
{
    public const string AppName = "GoldenPathBackend";
}
