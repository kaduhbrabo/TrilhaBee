using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrilhaBee.Repositorio.Migrations
{
    /// <inheritdoc />
    public partial class AddSqlObjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Functions
            migrationBuilder.Sql(@"
                CREATE FUNCTION fn_TotalInspecoesPorColmeia (@ColmeiaID INT)
                RETURNS INT
                AS
                BEGIN
                    DECLARE @Total INT;
                    SELECT @Total = COUNT(*) FROM Inspecoes WHERE ColmeiaID = @ColmeiaID;
                    RETURN ISNULL(@Total, 0);
                END;
            ");

            migrationBuilder.Sql(@"
                CREATE FUNCTION fn_MediaForcaColmeia (@ColmeiaID INT)
                RETURNS FLOAT
                AS
                BEGIN
                    DECLARE @Media FLOAT;
                    SELECT @Media = AVG(CAST(ForcaColmeia AS FLOAT)) FROM Inspecoes WHERE ColmeiaID = @ColmeiaID;
                    RETURN ISNULL(@Media, 0);
                END;
            ");

            migrationBuilder.Sql(@"
                CREATE FUNCTION fn_QuantidadeColmeiasPorApiario (@ApiarioID INT)
                RETURNS INT
                AS
                BEGIN
                    DECLARE @Total INT;
                    SELECT @Total = COUNT(*) FROM Colmeias WHERE ApiarioID = @ApiarioID;
                    RETURN ISNULL(@Total, 0);
                END;
            ");

            // Views
            migrationBuilder.Sql(@"
                CREATE VIEW vw_ResumoColmeias AS
                SELECT 
                    c.ColmeiaID, 
                    c.Codigo, 
                    c.Status, 
                    a.Nome AS ApiarioNome,
                    dbo.fn_TotalInspecoesPorColmeia(c.ColmeiaID) AS TotalInspecoes,
                    dbo.fn_MediaForcaColmeia(c.ColmeiaID) AS MediaForca
                FROM Colmeias c
                LEFT JOIN Apiarios a ON c.ApiarioID = a.ApiarioID;
            ");

            migrationBuilder.Sql(@"
                CREATE VIEW vw_ResumoInspecoes AS
                SELECT 
                    i.InspecaoID, 
                    i.Data, 
                    i.Clima, 
                    c.Codigo AS ColmeiaCodigo,
                    a.Nome AS ApiarioNome
                FROM Inspecoes i
                INNER JOIN Colmeias c ON i.ColmeiaID = c.ColmeiaID
                INNER JOIN Apiarios a ON c.ApiarioID = a.ApiarioID;
            ");

            // Stored Procedures
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
                    FROM Apiarios a;
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
        }
    }
}
