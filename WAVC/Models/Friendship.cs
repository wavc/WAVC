using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC.Models
{
    public class Friendship
    {
        public int Id { get; set; }

        public int AId { get; set; }
        public Friend A { get; set; }

        public int BId { get; set; }
        public Friend B { get; set; }
    }
}
