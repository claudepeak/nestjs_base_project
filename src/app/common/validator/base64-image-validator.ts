export function isBase64Image(base64String) {
  if (base64String === null || base64String === undefined) return false;

  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const bufferData = Buffer.from(base64Data, 'base64');

  // Check for common image file header signatures
  if (bufferData.length < 3) {
    return false;
  }

  const headerBytes = bufferData.slice(0, 3).toString('hex').toUpperCase();

  // JPEG/JFIF header starts with "FFD8FF"
  if (headerBytes.startsWith('FFD8FF')) {
    return true;
  }

  // PNG header starts with "89504E"
  if (headerBytes.startsWith('89504E')) {
    return true;
  }

  // GIF header starts with "474946"
  if (headerBytes.startsWith('474946')) {
    return true;
  }

  // BMP header starts with "424D"
  if (headerBytes.startsWith('424D')) {
    return true;
  }

  // Add more checks for other image types if needed

  return false;
}
