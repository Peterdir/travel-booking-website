// Format number with thousand separators
export const formatPrice = (value) => {
  if (!value) return '';
  const number = value.toString().replace(/[^\d]/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Parse formatted price back to number
export const parsePrice = (value) => {
  if (!value) return '';
  return value.toString().replace(/,/g, '');
};

// Convert image file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Validate image file
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)');
  }

  if (file.size > maxSize) {
    throw new Error('Kích thước ảnh không được vượt quá 5MB');
  }

  return true;
};
