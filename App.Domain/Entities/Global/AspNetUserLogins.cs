using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Global
{

    [Table("AspNetUserLogins")]
    public class AspNetUserLogins
    {
        [Key]
        [ForeignKey("AspNetUserLogins")]
        [Column("LoginProvider")]
        public string LoginProvider { get; set; }

        [Key]
        [ForeignKey("AspNetUserLogins")]
        [Column("ProviderKey")]
        public string ProviderKey { get; set; }
        [Column("ProviderDisplayName")]
        public string ProviderDisplayName { get; set; }
        [Required]
        [ForeignKey("AspNetUsers")]
        [Column("UserId")]
        public string UserId { get; set; }
    }
}
