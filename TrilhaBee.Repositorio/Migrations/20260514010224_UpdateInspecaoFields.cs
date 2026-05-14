using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrilhaBee.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInspecaoFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Clima",
                table: "Inspecao",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ForcaColmeia",
                table: "Inspecao",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NivelAlimento",
                table: "Inspecao",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "TemPostura",
                table: "Inspecao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Temperamento",
                table: "Inspecao",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Clima",
                table: "Inspecao");

            migrationBuilder.DropColumn(
                name: "ForcaColmeia",
                table: "Inspecao");

            migrationBuilder.DropColumn(
                name: "NivelAlimento",
                table: "Inspecao");

            migrationBuilder.DropColumn(
                name: "TemPostura",
                table: "Inspecao");

            migrationBuilder.DropColumn(
                name: "Temperamento",
                table: "Inspecao");
        }
    }
}
