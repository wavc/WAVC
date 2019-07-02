using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WAVC.Models
{
    public class Friend
    {
        public int Id { get; set; }


        public string WhoseId { get; set; }
        public virtual ApplicationUser Whose { get; set; }
        public string WhoId { get; set; }
        public virtual ApplicationUser Who { get; set; }

        [InverseProperty("A")]
        public virtual Friendship FriendA { get; set; }
        [InverseProperty("B")]
        public virtual Friendship FriendB { get; set; }

        [NotMapped]
        public virtual Friendship Friendship => FriendA != null ? FriendA : FriendB;
    }
}
