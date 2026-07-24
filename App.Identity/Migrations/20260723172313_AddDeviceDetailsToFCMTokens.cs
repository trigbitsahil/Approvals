using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OOH.Identity.Migrations
{
    /// <inheritdoc />
    public partial class AddDeviceDetailsToFCMTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeviceDetails",
                table: "UserFCMTokens",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeviceDetails",
                table: "UserFCMTokens");
        }
    }
}
