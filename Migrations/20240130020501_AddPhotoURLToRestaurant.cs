using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TacoTuesdayThursday.Migrations
{
    /// <inheritdoc />
    public partial class AddPhotoURLToRestaurant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhotoURL",
                table: "Restaurants",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoURL",
                table: "Restaurants");
        }
    }
}
