using MediatR;

namespace OOH.Application.Features.Global.Users.Queries.GetUserDetail
{
    public class GetUserDetailQuery : IRequest<GetUserDetailQueryResponse>
    {
        public string? Id { get; set; }
    }
}
