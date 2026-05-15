using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrilhaBee.Repositorio.Migrations
{
    public partial class AddSqlObjects : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE OR ALTER FUNCTION fn_QuantidadeColmeiasPorApiario (@ApiarioID INT)
                RETURNS INT
                AS
                BEGIN
                    DECLARE @Total INT;
                    SELECT @Total = COUNT(*) FROM Colmeia WHERE ApiarioID = @ApiarioID;
                    RETURN ISNULL(@Total, 0);
                END;
            ");

            migrationBuilder.Sql(@"
                CREATE OR ALTER PROCEDURE [dbo].[sp_ResumoApiarios]
                AS
                BEGIN
                    SELECT 
                        a.ApiarioID, 
                        a.Nome, 
                        a.Localizacao,
                        a.Capacidade,
                        dbo.fn_QuantidadeColmeiasPorApiario(a.ApiarioID) AS TotalColmeia
                    FROM Apiario a;
                END;
            ");
            migrationBuilder.Sql(@"
                CREATE OR ALTER VIEW vw_ResumoInspecoes AS
                SELECT 
                    i.*, 
                    c.Identificacao AS ColmeiaNome,
                    a.Nome AS ApiarioNome
                FROM Inspecao i
                INNER JOIN Colmeia c ON i.ColmeiaID = c.ColmeiaID
                INNER JOIN Apiario a ON c.ApiarioID = a.ApiarioID;
            ");

            migrationBuilder.Sql(@"
                CREATE OR ALTER PROCEDURE [dbo].[sp_ListarInspecoes]
                AS
                BEGIN
                    SELECT * FROM vw_ResumoInspecoes;
                END;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_ResumoApiarios]");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_QuantidadeColmeiasPorApiario");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS [dbo].[sp_ListarInspecoes]");
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_ResumoInspecoes");
        }
    }
}
