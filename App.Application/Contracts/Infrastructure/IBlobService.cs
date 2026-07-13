using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
 

namespace OOH.Application.Contracts.Infrastructure
{
    public interface IBlobService
    {
        List<string> GetBlobFileNames();
        string UploadFile(string filePath ,string fileName);
        bool DeleteBlobName(string blobName);
    }
}
