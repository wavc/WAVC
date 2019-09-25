using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace WAVC_WebApi
{
    public class ReferenceLoader<T> where T : class
    {
        private readonly ICollection<T> _objs;
        private readonly T _obj;
        private readonly DbContext _dbContext;

        public ReferenceLoader(ICollection<T> objs, DbContext ctx)
        {
            _objs = objs;
            _dbContext = ctx;
        }

        public ReferenceLoader(T obj, DbContext ctx)
        {
            _obj = obj;
            _dbContext = ctx;
        }

        private ReferenceLoader<T> Load(Action<EntityEntry<T>> action)
        {
            if (_objs != null)
                foreach (var obj in _objs)
                    action(_dbContext.Entry(obj));
            else if (_obj != null)
                action(_dbContext.Entry(_obj));
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