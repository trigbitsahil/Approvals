using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OOH.Domain.Entities.Global
{

    [Table("AspNetUserTokens")]
    public class AspNetUserTokens
    {
        [Key]
        [ForeignKey("AspNetUserTokens")]
        [Column("UserId")]
        public string UserId { get; set; }

        [Key]
        [ForeignKey("AspNetUserTokens")]
        [Column("LoginProvider")]
        public string LoginProvider { get; set; }

        [Key]
        [ForeignKey("AspNetUserTokens")]
        [Column("Name")]
        public string Name { get; set; }

        [Column("Value")]
        public string Value { get; set; }
    }
}
