using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrilhaBee.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuario",
                columns: table => new
                {
                    UsuarioID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tipo = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuario", x => x.UsuarioID);
                });

            migrationBuilder.CreateTable(
                name: "Apiario",
                columns: table => new
                {
                    ApiarioID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Localizacao = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Capacidade = table.Column<int>(type: "int", nullable: false),
                    UsuarioID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Apiario", x => x.ApiarioID);
                    table.ForeignKey(
                        name: "FK_Apiario_Usuario_UsuarioID",
                        column: x => x.UsuarioID,
                        principalTable: "Usuario",
                        principalColumn: "UsuarioID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Colmeia",
                columns: table => new
                {
                    ColmeiaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Identificacao = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TipoAbelha = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DataInstalacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Ativa = table.Column<bool>(type: "bit", nullable: false),
                    ApiarioID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Colmeia", x => x.ColmeiaID);
                    table.ForeignKey(
                        name: "FK_Colmeia_Apiario_ApiarioID",
                        column: x => x.ApiarioID,
                        principalTable: "Apiario",
                        principalColumn: "ApiarioID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AlertaIA",
                columns: table => new
                {
                    AlertaIAID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Mensagem = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DataGeracao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NivelGravidade = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Resolvido = table.Column<bool>(type: "bit", nullable: false),
                    ColmeiaID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertaIA", x => x.AlertaIAID);
                    table.ForeignKey(
                        name: "FK_AlertaIA_Colmeia_ColmeiaID",
                        column: x => x.ColmeiaID,
                        principalTable: "Colmeia",
                        principalColumn: "ColmeiaID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Inspecao",
                columns: table => new
                {
                    InspecaoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DataInspecao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Observacoes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    TemRainha = table.Column<bool>(type: "bit", nullable: false),
                    CondicaoGeral = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ColmeiaID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inspecao", x => x.InspecaoID);
                    table.ForeignKey(
                        name: "FK_Inspecao_Colmeia_ColmeiaID",
                        column: x => x.ColmeiaID,
                        principalTable: "Colmeia",
                        principalColumn: "ColmeiaID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AcaoManejo",
                columns: table => new
                {
                    AcaoManejoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descricao = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DataRealizacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TipoManejo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    InspecaoID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcaoManejo", x => x.AcaoManejoID);
                    table.ForeignKey(
                        name: "FK_AcaoManejo_Inspecao_InspecaoID",
                        column: x => x.InspecaoID,
                        principalTable: "Inspecao",
                        principalColumn: "InspecaoID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AcaoManejo_InspecaoID",
                table: "AcaoManejo",
                column: "InspecaoID");

            migrationBuilder.CreateIndex(
                name: "IX_AlertaIA_ColmeiaID",
                table: "AlertaIA",
                column: "ColmeiaID");

            migrationBuilder.CreateIndex(
                name: "IX_Apiario_UsuarioID",
                table: "Apiario",
                column: "UsuarioID");

            migrationBuilder.CreateIndex(
                name: "IX_Colmeia_ApiarioID",
                table: "Colmeia",
                column: "ApiarioID");

            migrationBuilder.CreateIndex(
                name: "IX_Inspecao_ColmeiaID",
                table: "Inspecao",
                column: "ColmeiaID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AcaoManejo");

            migrationBuilder.DropTable(
                name: "AlertaIA");

            migrationBuilder.DropTable(
                name: "Inspecao");

            migrationBuilder.DropTable(
                name: "Colmeia");

            migrationBuilder.DropTable(
                name: "Apiario");

            migrationBuilder.DropTable(
                name: "Usuario");
        }
    }
}
