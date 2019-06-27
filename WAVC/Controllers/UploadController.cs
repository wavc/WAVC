using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WAVC.Controllers
{
    public class UploadController : Controller
    {
        public class UploadedFiles
        {
            public List<IFormFile> files { get; set; }
        }
        public IActionResult Index()
        {
            return View();
        }
        public async Task SaveFileAsync(string name, IFormFile file)
        {
            using (var stream = new FileStream(name, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }
        public async Task Upload(UploadedFiles filesForm)
        {
            Task []tasks = new Task[filesForm.files.Count];

            for(int i = 0; i < filesForm.files.Count; i++)
            {
                var file = filesForm.files[i];
                var fileExt = Path.GetExtension(file.FileName);
                var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                var filePath = "wwwroot/files/" + fileName + "-" + Guid.NewGuid().ToString() + fileExt;
                tasks[i] = SaveFileAsync(filePath, file);
            }
            for (int i = 0; i < filesForm.files.Count; i++)
                await tasks[i];
        }
    }
}