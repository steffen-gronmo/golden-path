using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("ArchUnit.Tests")]
[assembly: InternalsVisibleTo("Infrastructure.Adapters.Test")]
[assembly: InternalsVisibleTo("API.Adapters.Test")]

namespace Arbeidstilsynet.GoldenPathBackend.Infrastructure.Adapters;

interface IAssemblyInfo { }
