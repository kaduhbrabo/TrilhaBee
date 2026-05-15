using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrilhaBee.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class AddEstruturaFisicaColmeia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QuantidadeMelgueiras",
                table: "Colmeia",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "QuantidadeQuadros",
                table: "Colmeia",
                type: "int",
                nullable: false,
                defaultValue: 10);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuantidadeMelgueiras",
                table: "Colmeia");

            migrationBuilder.DropColumn(
                name: "QuantidadeQuadros",
                table: "Colmeia");
        }
    }
}
