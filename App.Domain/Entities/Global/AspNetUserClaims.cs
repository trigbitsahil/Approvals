using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Global
{

    [Table("AspNetUserClaims")]
    public class AspNetUserClaims
    {
        [Key]
        [ForeignKey("AspNetUserClaims")]
        [Column("Id")]
        public int Id { get; set; }
        [Required]
        [ForeignKey("AspNetUsers")]
        [Column("UserId")]
        public string UserId { get; set; }
        [Column("ClaimType")]
        public string ClaimType { get; set; }
        [Column("ClaimValue")]
        public string ClaimValue { get; set; }
    }
}
