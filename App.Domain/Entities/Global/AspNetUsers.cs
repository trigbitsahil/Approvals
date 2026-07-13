using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Global
{

    [Table("AspNetUsers")]
    public class AspNetUsers
    {
        [Key]
        [ForeignKey("AspNetUsers")]
        [Column("Id")]
        public string Id { get; set; }
        [Column("FirstName")]
        public string FirstName { get; set; }
        [Column("LastName")]
        public string LastName { get; set; }
        [Column("TenantID")]
        public string TenantId { get; set; }
        [Column("UserName")]
        public string UserName { get; set; }
        [Column("NormalizedUserName")]
        public string NormalizedUserName { get; set; }
        [Column("Email")]
        public string Email { get; set; }
        [Column("NormalizedEmail")]
        public string NormalizedEmail { get; set; }
        [Required]
        [Column("EmailConfirmed")]
        public bool EmailConfirmed { get; set; }
        [Column("PasswordHash")]
        public string PasswordHash { get; set; }
        [Column("SecurityStamp")]
        public string SecurityStamp { get; set; }
        [Column("ConcurrencyStamp")]
        public string ConcurrencyStamp { get; set; }
        [Column("PhoneNumber")]
        public string PhoneNumber { get; set; }
        [Required]
        [Column("PhoneNumberConfirmed")]
        public bool PhoneNumberConfirmed { get; set; }
        [Required]
        [Column("TwoFactorEnabled")]
        public bool TwoFactorEnabled { get; set; }
        [Column("LockoutEnd")]
        public DateTimeOffset? LockoutEnd { get; set; }
        [Required]
        [Column("LockoutEnabled")]
        public bool LockoutEnabled { get; set; }
        [Required]
        [Column("AccessFailedCount")]
        public int AccessFailedCount { get; set; }


        [Column("IsPhoneNumberPublic")]
        public bool IsPhoneNumberPublic { get; set; }
        
        [Column("ReportToUser")]
        public string ReportToUser { get; set; }


        [Required]
        [Column("CreatedBy")]
        public string CreatedBy { get; set; }
        [Required]
        [Column("CreatedDate")]
        public DateTimeOffset CreatedDate { get; set; }
        [Required]
        [Column("IsVoided")]
        public bool IsVoided { get; set; }
        [Required]
        [Column("LastModifiedBy")]
        public string LastModifiedBy { get; set; }
        [Column("LastModifiedDate")]
        public DateTimeOffset? LastModifiedDate { get; set; }

        [Column("TelegramChatId")]
        public string TelegramChatId { get; set; }
    }
}
