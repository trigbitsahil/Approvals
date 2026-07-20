using MediatR;
using Microsoft.Extensions.Logging;
using OOH.Application.Contracts.Infrastructure;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Transactions;

namespace OOH.Application.Behaviors
{
    public class TransactionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly ILogger<TransactionBehavior<TRequest, TResponse>> _logger;

        public TransactionBehavior(ILogger<TransactionBehavior<TRequest, TResponse>> logger)
        {
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            if (request is not ITransactionalCommand)
            {
                return await next();
            }

            // Wrapping the MediatR request in a TransactionScope ensures all ADO.NET/Dapper 
            // connections opened inside 'next()' enlist in the same ambient transaction.
            var transactionOptions = new TransactionOptions
            {
                IsolationLevel = IsolationLevel.ReadCommitted,
                Timeout = TransactionManager.MaximumTimeout
            };

            using (var scope = new TransactionScope(TransactionScopeOption.Required, transactionOptions, TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    _logger.LogInformation("Beginning ambient database transaction for {RequestName}", typeof(TRequest).Name);

                    var response = await next();

                    scope.Complete();
                    _logger.LogInformation("Successfully committed ambient database transaction for {RequestName}", typeof(TRequest).Name);
                    
                    return response;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to execute {RequestName}. Ambient transaction will be rolled back.", typeof(TRequest).Name);
                    throw;
                }
            }
        }
    }
}
