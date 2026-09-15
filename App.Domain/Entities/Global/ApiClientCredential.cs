using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOH.Domain.Entities.Global
{
    [Table("api_client_credentials")]
    public class ApiClientCredential
    {
        [Key]
        [Column("credential_id")]
        public string CredentialId { get; set; }

        [Column("client_name")]
        public string ClientName { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("password")]
        public string Password { get; set; }

        [Column("created_date")]
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
