using AutoMapper;
using MediatR;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Contracts.Persistence;
 
using OOH.Application.Models.Mail;
using OOH.Domain.Entities.Tenders;


namespace OOH.Application.Features.Tenders.Cities.Queries.GetCityList
{
    public class GetCityListQueryHandler :
        IRequestHandler<GetCityListQuery, GetCityListQueryResponse>
    {
        private readonly IAsyncRepository<City> _cityRepository;

        private readonly IMapper _mapper;

        private readonly IEmailService _emailService;

      

        public GetCityListQueryHandler(IMapper mapper, IAsyncRepository<City> cityRepository, IEmailService emailService )
        {
            _mapper = mapper;
            _cityRepository = cityRepository;
            _emailService = emailService;   
         
        }


 

        public async Task<GetCityListQueryResponse> Handle(GetCityListQuery request, CancellationToken cancellationToken)
        {



            GetCityListQueryResponse getCityListQueryResponse = new GetCityListQueryResponse();

             

            if (getCityListQueryResponse.Success)
            {

                List<City> entitylist = await _cityRepository.ListAllAsync();

                //EmailInfo objEmailInfo = new EmailInfo("This is the test body","iamtaranpanesa@gmail.com","","Test Email Sending","dev@wallop.in",null);

                //bool isSent = await _emailService.SendEmail(objEmailInfo);


        

                if (entitylist == null)
                {
                    getCityListQueryResponse.Success = false;

                }
                else
                {
                    getCityListQueryResponse.Data = _mapper.Map<List<CityListVM>>(entitylist);

                }

            }

            return getCityListQueryResponse;


        }


    }
}
