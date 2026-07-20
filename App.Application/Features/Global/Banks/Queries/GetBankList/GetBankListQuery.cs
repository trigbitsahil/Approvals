using MediatR;
using System.Collections.Generic;

namespace OOH.Application.Features.Global.Banks.Queries.GetBankList
{
    public class GetBankListQuery : IRequest<List<BankListVM>>
    {
    }
}
