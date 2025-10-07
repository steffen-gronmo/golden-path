using System.ComponentModel.DataAnnotations;

namespace Arbeidstilsynet.ExampleBackend.API.Ports.Requests;

public record CreateSakDto
{
    [RegularExpression(@"^\d{9}$")]
    public required string Organisajonsnummer { get; init; }
}
