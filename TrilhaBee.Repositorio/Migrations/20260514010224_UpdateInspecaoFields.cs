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

            // Objects SQL (Depois que as colunas existem)
            migrationBuilder.Sql(@"
                CREATE FUNCTION fn_TotalInspecoesPorColmeia (@ColmeiaID INT)
                RETURNS INT
                AS
                BEGIN
                    DECLARE @Total INT;
                    SELECT @Total = COUNT(*) FROM Inspecao WHERE ColmeiaID = @ColmeiaID;
                    RETURN ISNULL(@Total, 0);
                END;
            ");

            migrationBuilder.Sql(@"
                CREATE FUNCTION fn_MediaForcaColmeia (@ColmeiaID INT)
                RETURNS FLOAT
                AS
                BEGIN
                    DECLARE @Media FLOAT;
                    SELECT @Media = AVG(CAST(ForcaColmeia AS FLOAT)) FROM Inspecao WHERE ColmeiaID = @ColmeiaID;
                    RETURN ISNULL(@Media, 0);
                END;
            ");

            migrationBuilder.Sql(@"
                CREATE FUNCTION fn_QuantidadeColmeiasPorApiario (@ApiarioID INT)
                RETURNS INT
                AS
                BEGIN
                    DECLARE @Total INT;
                    SELECT @Total = COUNT(*) FROM Colmeia WHERE ApiarioID = @ApiarioID;
                    RETURN ISNULL(@Total, 0);
                END;
            ");

            migrationBuilder.Sql(@"
                CREATE VIEW vw_ResumoColmeias AS
                SELECT 
                    c.ColmeiaID, 
                    c.Identificacao, 
                    c.Ativa, 
                    a.Nome AS ApiarioNome,
                    dbo.fn_TotalInspecoesPorColmeia(c.ColmeiaID) AS TotalInspecoes,
                    dbo.fn_MediaForcaColmeia(c.ColmeiaID) AS MediaForca
                FROM Colmeia c
                LEFT JOIN Apiario a ON c.ApiarioID = a.ApiarioID;
            ");

            migrationBuilder.Sql(@"
                CREATE VIEW vw_ResumoInspecoes AS
                SELECT 
                    i.InspecaoID, 
                    i.DataInspecao, 
                    i.Clima, 
                    c.Identificacao AS ColmeiaCodigo,
                    a.Nome AS ApiarioNome
                FROM Inspecao i
                INNER JOIN Colmeia c ON i.ColmeiaID = c.ColmeiaID
                INNER JOIN Apiario a ON c.ApiarioID = a.ApiarioID;
            ");

            migrationBuilder.Sql(@"
                CREATE PROCEDURE sp_ListarColmeias
                AS
                BEGIN
                    SELECT * FROM vw_ResumoColmeias;
                END;
            ");

            migrationBuilder.Sql(@"
                CREATE PROCEDURE sp_ListarInspecoes
                AS
                BEGIN
                    SELECT * FROM vw_ResumoInspecoes;
                END;
            ");

            migrationBuilder.Sql(@"
                CREATE PROCEDURE sp_ResumoApiarios
                AS
                BEGIN
                    SELECT 
                        a.ApiarioID, 
                        a.Nome, 
                        a.Localizacao,
                        dbo.fn_QuantidadeColmeiasPorApiario(a.ApiarioID) AS TotalColmeias
                    FROM Apiario a;
                END;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_ResumoApiarios;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_ListarInspecoes;");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS sp_ListarColmeias;");

            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_ResumoInspecoes;");
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_ResumoColmeias;");

            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_QuantidadeColmeiasPorApiario;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_MediaForcaColmeia;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_TotalInspecoesPorColmeia;");

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
