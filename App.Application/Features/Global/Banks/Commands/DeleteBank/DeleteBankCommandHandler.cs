using MediatR;
using OOH.Application.Contracts.Persistence;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Banks.Commands.DeleteBank
{
    public class DeleteBankCommandHandler : IRequestHandler<DeleteBankCommand, bool>
    {
        private readonly IBankRepository _bankRepository;

        public DeleteBankCommandHandler(IBankRepository bankRepository)
        {
            _bankRepository = bankRepository;
        }

        public async Task<bool> Handle(DeleteBankCommand request, CancellationToken cancellationToken)
        {
            var bank = await _bankRepository.GetByIdAsync(request.BankId);
            if (bank == null)
            {
                return false;
            }

            bank.IsVoided = true;
            await _bankRepository.UpdateAsync(bank);
            return true;
        }
    }
}
