//add a using directive to ArchUnitNET.Fluent.ArchRuleDefinition to easily define ArchRules
using ArchUnitNET.Domain;
using ArchUnitNET.Fluent;
using ArchUnitNET.Loader;
using ArchUnitNET.xUnit;
using static ArchUnitNET.Fluent.ArchRuleDefinition;

namespace Arbeidstilsynet.GoldenPathBackend.ArchUnit.Tests;

public class InfrastructurePortLayerTests
{
    static readonly Architecture Architecture = new ArchLoader()
        .LoadAssemblies(Layers.InfrastructurePortAssembly, Layers.SystemConsoleAssembly)
        .Build();

    [Fact]
    public void TypesInInfrastructurePortLayer_HaveInfrastructurePortsNamespace()
    {
        IArchRule archRule = Types()
            .That()
            .Are(Layers.InfrastructurePortLayer)
            .Should()
            .ResideInNamespaceMatching(
                $"^({Constants.NameSpacePrefix}\\.Infrastructure\\.Ports|{Constants.NameSpacePrefix}\\.Infrastructure\\.Ports\\..*)$"
            );

        archRule.Check(Architecture);
    }

    [Fact]
    public void TypesInInfrastructurePortLayer_ArePublic()
    {
        IArchRule archRule = Types().That().Are(Layers.InfrastructurePortLayer).Should().BePublic();

        archRule.Check(Architecture);
    }

    [Fact]
    public void TypesInInfrastructurePortLayer_DoNotDependOnOtherTypesThanInfrastructurePortsAndDomain()
    {
        IArchRule archRule = Types()
            .That()
            .Are(Layers.InfrastructurePortLayer)
            .Should()
            .NotDependOnAny(
                Types()
                    .That()
                    .DoNotResideInNamespaceMatching(
                        $"(^Coverlet.Core.Instrumentation.*$|^System.*$|^{Constants.NameSpacePrefix}\\.Infrastructure\\.Ports.*$|^{Constants.NameSpacePrefix}\\.Domain\\.Data.*$)"
                    )
            );

        archRule.Check(Architecture);
    }
}
