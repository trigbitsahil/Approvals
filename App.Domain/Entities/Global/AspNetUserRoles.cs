using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Global
{

    [Table("AspNetUserRoles")]
    public class AspNetUserRoles
    {
        [Key]
        [ForeignKey("AspNetUserRoles")]
        [Column("UserId")]
        public string UserId { get; set; }


        [Key]
        [ForeignKey("AspNetUserRoles")]
        [Column("RoleId")]
        public string RoleId { get; set; }

    }
}
