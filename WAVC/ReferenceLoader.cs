using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace WAVC
{
    public class ReferenceLoader<T> where T : class
    {
        ICollection<T> objs;
        DbContext ctx;
        public ReferenceLoader(ICollection<T> objs, DbContext ctx)
        {
            this.objs = objs;
            this.ctx = ctx;
        }
        ReferenceLoader<T> Load(Action<EntityEntry<T>> action)
        {
            foreach (var obj in objs)
                action(ctx.Entry(obj));
            return this;
        }
        public ReferenceLoader<T> LoadReference<TProperty>(Expression<Func<T, TProperty>> propertyExpression) where TProperty : class
        {
            return Load(x => x.Reference(propertyExpression).Load());
        }
        public ReferenceLoader<T> LoadCollection<TProperty>(Expression<Func<T, IEnumerable<TProperty>>> propertyExpression) where TProperty : class
        {
            return Load(x => x.Collection(propertyExpression).Load());
        }
    }
}
