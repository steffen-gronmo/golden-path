using Microsoft.Extensions.Logging;

namespace Arbeidstilsynet.GoldenPathBackend.Infrastructure.Adapters.Extensions;

internal static partial class LoggerExtensions
{
    [LoggerMessage(
        LogLevel.Information,
        "Could not find Sak with Id <{sakId}>",
        EventName = "SakNotFound"
    )]
    public static partial void LogSakNotFound(this ILogger logger, Guid? sakId);
}
