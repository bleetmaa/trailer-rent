using System.Net;
using System.Text.Json;
using TrailerRent.Business.Exceptions;

namespace TrailerRent.API.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred processing the request");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = new ErrorResponse();

        switch (exception)
        {
            case NotFoundException:
                response.Message = exception.Message;
                response.StatusCode = (int)HttpStatusCode.NotFound;
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                break;
            case ConflictException:
                response.Message = exception.Message;
                response.StatusCode = (int)HttpStatusCode.Conflict;
                context.Response.StatusCode = (int)HttpStatusCode.Conflict;
                break;
            case ValidationException:
                response.Message = exception.Message;
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;
            case UnauthorizedException:
                response.Message = exception.Message;
                response.StatusCode = (int)HttpStatusCode.Unauthorized;
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                break;
            default:
                response.Message = "An error occurred while processing your request";
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;
        }

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}

public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
    public int StatusCode { get; set; }
}
