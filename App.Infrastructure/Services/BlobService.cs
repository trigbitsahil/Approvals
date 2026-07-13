using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using OOH.Application.Contracts.Infrastructure;
using OOH.Application.Models.Files;
using OOH.Application.Models.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OOH.Infrastructure.Services
{
    public class BlobService : IBlobService
    {
        private BlobSettings _blobSettings { get; }

        private BlobServiceClient _blobServiceClient { get; }

        public BlobService(IOptions<BlobSettings> blobSettings, BlobServiceClient blobServiceClient)
        {
            _blobSettings = blobSettings.Value;

            _blobServiceClient = blobServiceClient;

        }
        public List<string> GetBlobFileNames()
        {
            List<string> lstFileNames = new List<string>();

            try
            {

                BlobContainerClient blobContainerClient = _blobServiceClient.GetBlobContainerClient(_blobSettings.Container);
                var blobs = blobContainerClient.GetBlobs();
                foreach (var blob in blobs)
                {
                    lstFileNames.Add(blob.Name);
                }
            }
            catch (Exception ex) { }
            return lstFileNames;
        }


        public async Task<Stream> Get(String name)
        {

           //create container instance
            var containerInstance = _blobServiceClient.GetBlobContainerClient(_blobSettings.Container);

            //create blob instance
            var blobInstance = containerInstance.GetBlobClient(name);
           

            var downloadContent = await blobInstance.DownloadAsync();

            return downloadContent.Value.Content;

        }
        public string UploadFile(string filePath,string fileName)
        {
        
            

            BlobContainerClient blobContainerClient = _blobServiceClient.GetBlobContainerClient(_blobSettings.Container);
            BlobClient blobClient = blobContainerClient.GetBlobClient(fileName);

            using (Stream stream = File.OpenRead(filePath)  )
            {
                blobClient.Upload(stream, true);
            }


            return blobClient.Uri.ToString();
        }





        //public string UploadFile(IFormFile formFile)
        //{
        //    string containerName = _blobSettings.Container;
        //    //var blobServiceClient = GetBlobServiceClient();

        //    string connectionString = _blobSettings.ConnectionString;
        //    BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

        //    BlobContainerClient blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
        //    BlobClient blobClient = blobContainerClient.GetBlobClient(formFile.FileName);

        //    using (Stream stream = formFile.OpenReadStream())
        //    {
        //        blobClient.Upload(stream, true);
        //    }

        //    return formFile.FileName;
        //}

        public bool DeleteBlobName(string blobName)
        {
            try
            {

                BlobContainerClient blobContainerClient = _blobServiceClient.GetBlobContainerClient(_blobSettings.Container);

                blobContainerClient.DeleteBlobIfExistsAsync(blobName);
                return true;
            }
            catch (Exception ex) { return false; }
        }

    }
}
