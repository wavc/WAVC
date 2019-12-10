using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC_WebApi
{
    public static class FileSaverExtention
    {
        public static async Task SaveFileAsync(this IFormFile file, string name)
        {
            var path = "wwwroot/" + name;
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }
    }
}
