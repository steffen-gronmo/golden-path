using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("ArchUnit.Tests")]
[assembly: InternalsVisibleTo("Infrastructure.Adapters.Test")]
[assembly: InternalsVisibleTo("API.Adapters.Test")]

namespace Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters;

interface IAssemblyInfo { }
