export const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters first including the plus sign
    let digits = phone.replace(/\D/g, '');
    
    // Handle Indonesian numbers
    if (digits.startsWith('62')) {
      return digits; // Already has country code without plus
    } else if (digits.startsWith('0')) {
      return `62${digits.substring(1)}`; // Convert 08xx to 628xx
    } else {
      return `62${digits}`; // Assume it's an Indonesian number without prefix
    }
  };
  