using MediatR;
using OOH.Application.Contracts.Persistence;
using OOH.Domain.Entities.Global;
using System.Threading;
using System.Threading.Tasks;

namespace OOH.Application.Features.Global.Approvals.Commands.ClearAllData
{
    public class ClearAllDataCommandHandler : IRequestHandler<ClearAllDataCommand, ClearAllDataCommandResponse>
    {
        private readonly IAsyncRepository<BankTransaction> _bankTransactionRepository;
        private readonly IAsyncRepository<Bank> _bankRepository;
        private readonly IAsyncRepository<Approval> _approvalRepository;

        public ClearAllDataCommandHandler(
            IAsyncRepository<BankTransaction> bankTransactionRepository,
            IAsyncRepository<Bank> bankRepository,
            IAsyncRepository<Approval> approvalRepository)
        {
            _bankTransactionRepository = bankTransactionRepository;
            _bankRepository = bankRepository;
            _approvalRepository = approvalRepository;
        }

        public async Task<ClearAllDataCommandResponse> Handle(ClearAllDataCommand request, CancellationToken cancellationToken)
        {
            var response = new ClearAllDataCommandResponse();

            try 
            {
                // Deletes data from child dependencies via CASCADE if foreign keys restrict it
                await _bankTransactionRepository.ClearTableAsync();
                await _bankRepository.ClearTableAsync();
                await _approvalRepository.ClearTableAsync();

                response.Success = true;
                response.Message = "Data successfully cleared.";
            }
            catch (System.Exception ex)
            {
                response.Success = false;
                response.Message = $"Failed to clear data: {ex.Message}";
            }

            return response;
        }
    }
}
