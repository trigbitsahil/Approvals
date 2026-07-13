using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Application.Features.Tenders.Cities.Queries.GetCityDetail
{
    
   public class CityDetailVM
    {
 
        public string CityID { get; set; }

 
        public string Name { get; set; }

 
        public bool IsVoided { get; set; }
 
        public string TenantID { get; set; }
 
        public string CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }
  
        public string LastModifiedBy { get; set; }
 
        public DateTime? LastModifiedDate { get; set; }


    }

}
