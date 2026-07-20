using MediatR;
using System;

namespace OOH.Application.Features.Global.Transactions.Commands.ClearTransactionalData
{
    public class ClearTransactionalDataCommand : IRequest<bool>
    {
        // Add authorization properties if needed, e.g., confirmation token or admin reason
        public string Reason { get; set; }
    }
}
