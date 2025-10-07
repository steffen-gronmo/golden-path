using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("API.Adapters.Test")]

namespace Arbeidstilsynet.ExampleBackend.API.Adapters;

public interface IAssemblyInfo
{
    public const string AppName = "ExampleBackend";
}
