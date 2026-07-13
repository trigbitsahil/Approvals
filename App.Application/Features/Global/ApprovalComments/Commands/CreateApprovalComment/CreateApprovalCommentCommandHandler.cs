using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
using OOH.Application.Contracts.Persistence.Global;
using OOH.Application.Features.Global.ApprovalApprovers.Queries.GetApprovalApproverList;
using OOH.Application.Models.Mail;
using OOH.Domain;
using OOH.Domain.Entities.Global;

namespace OOH.Application.Features.Global.ApprovalComments.Commands.CreateApprovalComment
{
    public class CreateApprovalCommentCommandHandler : IRequestHandler<CreateApprovalCommentCommand, CreateApprovalCommentCommandResponse>
    {
        private readonly IApprovalCommentRepository _ApprovalCommentRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

        private readonly IApprovalApproverRepository _ApprovalApproverRepository;


        private readonly IApprovalRepository _approvalRepository;
        public CreateApprovalCommentCommandHandler(IMapper mapper,
            IApprovalCommentRepository ApprovalCommentRepository,
            IEmailService emailService,
             IApprovalApproverRepository ApprovalApproverRepository,
             IApprovalRepository approvalRepository
            )
        {
            _mapper = mapper;
            _ApprovalCommentRepository = ApprovalCommentRepository;
            _emailService = emailService;
            _approvalRepository = approvalRepository;
            _ApprovalApproverRepository = ApprovalApproverRepository;
        }




        public async Task<CreateApprovalCommentCommandResponse> Handle(CreateApprovalCommentCommand request, CancellationToken cancellationToken)
        {

            var createApprovalCommentCommandResponse = new CreateApprovalCommentCommandResponse();

            var validator = new CreateApprovalCommentCommandValidator(_ApprovalCommentRepository);

            var validationResult = await validator.ValidateAsync(request);

            if (validationResult.Errors.Count() > 0)
            {

                createApprovalCommentCommandResponse.Success = false;
                createApprovalCommentCommandResponse.ValidationErrors = new List<string>();
                foreach (var error in validationResult.Errors)
                {
                    createApprovalCommentCommandResponse.ValidationErrors.Add(error.ErrorMessage);
                }

            }
            if (createApprovalCommentCommandResponse.Success)
            {
                string entityKeyColumnValue = String.Format(EntityColumn.KeyFormat, EntityPrefixes.ApprovalComment, DateTime.Now, System.Guid.NewGuid().ToString());




                ApprovalComment entity = _mapper.Map<ApprovalComment>(request);


                entity.ApprovalCommentId = entityKeyColumnValue;



                int i = await _ApprovalCommentRepository.AddAsync(entity);

                if (i == -1)
                {
                    createApprovalCommentCommandResponse.Success = false;
                }
                else
                {



                    List<ApprovalApproverListVM> entitylist = await _ApprovalApproverRepository.ListAllApprovalApproversAsync(request.ApprovalId);

                    Approval objApproval = new Approval();


                    objApproval = await _approvalRepository.GetByIdAsync(request.ApprovalId);


                    string toCCEmails = string.Empty;


                    foreach (var entity1 in entitylist)
                    {
                        if (string.IsNullOrEmpty(toCCEmails))
                        {

                            toCCEmails = entity1.ApprovalApproverEmail;

                        }
                        else
                        {

                            toCCEmails = toCCEmails + "," + entity1.ApprovalApproverEmail;

                        }
                    }


                    EmailInfo email = new EmailInfo($"Hi,{entity.CreatedBy} has added comment: <b>  {request.CommentText} </b>  to the  approval <b>  {objApproval.Name} </b> . See details using the  link <a href='https://oohapp-afdpgggpdrd9aghz.centralindia-01.azurewebsites.net/Approval/ApprovalDetail/{objApproval.ApprovalId}'> Here </a>",
                      objApproval.RequestedBy, null, $"Approval {objApproval.Name} Comment Added", "dev@wallop.in", null, toCCEmails
                      );

                    bool isSent = await _emailService.SendEmail(email);


                    createApprovalCommentCommandResponse.Data = _mapper.Map<CreateApprovalCommentDto>(entity);

                }

            }


            return createApprovalCommentCommandResponse;



        }


    }
}
