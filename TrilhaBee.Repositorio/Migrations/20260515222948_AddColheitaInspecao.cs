using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrilhaBee.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class AddColheitaInspecao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataColheita",
                table: "Inspecao",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MelColetado",
                table: "Inspecao",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataColheita",
                table: "Inspecao");

            migrationBuilder.DropColumn(
                name: "MelColetado",
                table: "Inspecao");
        }
    }
}
