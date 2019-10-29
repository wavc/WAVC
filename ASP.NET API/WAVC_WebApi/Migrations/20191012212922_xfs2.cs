using Microsoft.EntityFrameworkCore.Migrations;

namespace WAVC_WebApi.Migrations
{
    public partial class xfs2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUserConversation_Conversations_ConversationId",
                table: "ApplicationUserConversation");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUserConversation_AspNetUsers_UserId",
                table: "ApplicationUserConversation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ApplicationUserConversation",
                table: "ApplicationUserConversation");

            migrationBuilder.RenameTable(
                name: "ApplicationUserConversation",
                newName: "ApplicationUserConversations");

            migrationBuilder.RenameIndex(
                name: "IX_ApplicationUserConversation_ConversationId",
                table: "ApplicationUserConversations",
                newName: "IX_ApplicationUserConversations_ConversationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ApplicationUserConversations",
                table: "ApplicationUserConversations",
                columns: new[] { "UserId", "ConversationId" });

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUserConversations_Conversations_ConversationId",
                table: "ApplicationUserConversations",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "ConversationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUserConversations_AspNetUsers_UserId",
                table: "ApplicationUserConversations",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUserConversations_Conversations_ConversationId",
                table: "ApplicationUserConversations");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUserConversations_AspNetUsers_UserId",
                table: "ApplicationUserConversations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ApplicationUserConversations",
                table: "ApplicationUserConversations");

            migrationBuilder.RenameTable(
                name: "ApplicationUserConversations",
                newName: "ApplicationUserConversation");

            migrationBuilder.RenameIndex(
                name: "IX_ApplicationUserConversations_ConversationId",
                table: "ApplicationUserConversation",
                newName: "IX_ApplicationUserConversation_ConversationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ApplicationUserConversation",
                table: "ApplicationUserConversation",
                columns: new[] { "UserId", "ConversationId" });

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUserConversation_Conversations_ConversationId",
                table: "ApplicationUserConversation",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "ConversationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUserConversation_AspNetUsers_UserId",
                table: "ApplicationUserConversation",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
