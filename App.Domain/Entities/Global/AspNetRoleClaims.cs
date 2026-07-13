using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Global
{

    [Table("AspNetRoleClaims")]
    public class AspNetRoleClaims
    {
        [Key]
        [ForeignKey("AspNetRoleClaims")]
        [Column("Id")]
        public int Id { get; set; }
        [Required]
        [ForeignKey("AspNetRoles")]
        [Column("RoleId")]
        public string RoleId { get; set; }
        [Column("ClaimType")]
        public string ClaimType { get; set; }
        [Column("ClaimValue")]
        public string ClaimValue { get; set; }
    }
}
