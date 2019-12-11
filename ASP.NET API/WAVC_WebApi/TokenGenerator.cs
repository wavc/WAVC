using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WAVC_WebApi.Models;

namespace WAVC_WebApi
{
    public class TokenGenerator
    {
        private readonly string secret;

        public TokenGenerator(string secret)
        {
            this.secret = secret;
        }

        public string GenerateToken(ApplicationUser user)
        {
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, user.Id),
                        new Claim(ClaimTypes.NameIdentifier, user.Id)
                    }),

                Expires = DateTime.UtcNow.AddHours(6),
                SigningCredentials = new SigningCredentials(
                                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                                SecurityAlgorithms.HmacSha256Signature)
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(securityToken);

            return token;
        }
    }
}