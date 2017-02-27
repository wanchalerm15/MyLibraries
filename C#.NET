        private Image ResizeImage(HttpPostedFileBase file, int newWidth)
        {
            string[] types = new string[] { "image/jpeg", "image/png", "image/gif" };
            if (Array.IndexOf(types, file.ContentType) == -1) return null;
            Image image = Image.FromStream(file.InputStream);
            int newHeight = (newWidth * image.Height) / image.Width;
            Bitmap newImage = new Bitmap(newWidth, newHeight);
            using (var graphics = Graphics.FromImage(newImage))
            {
                graphics.DrawImage(image, 0, 0, newWidth, newHeight);
            }
            return newImage;
        }
