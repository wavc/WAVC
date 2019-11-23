using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.FileProviders.Physical;
using Microsoft.Extensions.Primitives;
using System;
using System.IO;
using System.Linq;

namespace WAVC_WebApi
{
    public class PhysicalFileProviderAdapter : IFileProvider
    {
        PhysicalFileProvider _provider;
        static char[] _pathSeparators = new char[2]
            { Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar };

        static char[] _invalidFileNameChars = Path.GetInvalidFileNameChars().Where(character =>
                character != Path.DirectorySeparatorChar && character != Path.AltDirectorySeparatorChar
            ).ToArray();

        public PhysicalFileProviderAdapter(string path)
        {
            _provider = new PhysicalFileProvider(path);
        }

        internal static bool PathNavigatesAboveRoot(string path)
        {
            StringTokenizer stringTokenizer = new StringTokenizer(path, _pathSeparators);
            int num = 0;
            foreach (StringSegment stringSegment in stringTokenizer)
            {
                if (!stringSegment.Equals(".") && !stringSegment.Equals(""))
                {
                    if (stringSegment.Equals(".."))
                    {
                        --num;
                        if (num == -1)
                            return true;
                    }
                    else
                        ++num;
                }
            }
            return false;
        }

        private string GetFullPath(string path)
        {
            if (PathNavigatesAboveRoot(path))
            {
                return null;
            }

            string fullPath;
            try
            {
                fullPath = Path.GetFullPath(Path.Combine(_provider.Root, path));
            }
            catch
            {
                return null;
            }

            if (!IsUnderneathRoot(fullPath))
            {
                return null;
            }

            return fullPath;
        }

        private bool IsUnderneathRoot(string fullPath)
        {
            return fullPath.StartsWith(_provider.Root, StringComparison.OrdinalIgnoreCase);
        }

        public IFileInfo GetFileInfo(string subpath)
        {
            if (string.IsNullOrEmpty(subpath) || subpath.IndexOfAny(_invalidFileNameChars) != -1)
            {
                return new NotFoundFileInfo(subpath);
            }

            // Relative paths starting with leading slashes are okay
            subpath = subpath.TrimStart(_pathSeparators);

            // Absolute paths not permitted.
            if (Path.IsPathRooted(subpath))
            {
                return new NotFoundFileInfo(subpath);
            }

            var fullPath = GetFullPath(subpath);
            if (fullPath == null)
            {
                return new NotFoundFileInfo(subpath);
            }

            var fileInfo = new FileInfo(fullPath);

            return new PhysicalFileInfo(fileInfo);
        }

        public IDirectoryContents GetDirectoryContents(string subpath)
        {
            return _provider.GetDirectoryContents(subpath);
        }

        public IChangeToken Watch(string filter)
        {
            return _provider.Watch(filter);
        }
    }
}
