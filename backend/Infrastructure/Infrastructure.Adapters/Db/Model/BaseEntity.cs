namespace Arbeidstilsynet.ExampleBackend.Infrastructure.Adapters.Db.Model;

internal abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
