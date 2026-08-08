export const DEFAULT_WHATSAPP_PHONE = import.meta.env.VITE_ADMIN_WHATSAPP_PHONE || '919876543210';

/**
 * Creates a pre-filled WhatsApp link for Quick Inquiry Form
 */
export const createQuickInquiryWhatsAppUrl = ({ name, phone, furnitureType, budgetRange, message }, targetPhone = DEFAULT_WHATSAPP_PHONE) => {
  const text = `Greetings Heritage Craftsmen! 🪵✨\n\nI would like to enquire about a custom furniture project.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Requirement:* ${furnitureType}\n*Budget Range:* ${budgetRange || 'Not specified'}\n${message ? `*Notes:* ${message}\n` : ''}\nPlease connect with me to discuss design options and lead time.`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
};

/**
 * Creates a pre-filled WhatsApp link for a specific product & chosen variants
 */
export const createProductInquiryWhatsAppUrl = ({ product, selectedVariant, selectedSize }, targetPhone = DEFAULT_WHATSAPP_PHONE) => {
  const variantText = selectedVariant ? selectedVariant.colorName : 'Standard Finish';
  const sizeText = selectedSize ? selectedSize.name : 'Standard Dimensions';
  
  const text = `Hello Heritage Craftsmen! 🏛️\n\nI am interested in your *${product.title}* from your collection.\n\n*Category:* ${product.category}\n*Selected Finish/Color:* ${variantText}\n*Selected Size/Dimensions:* ${sizeText}\n*Base Price:* ${product.priceFormatted || `₹${product.basePrice}`}\n\nCould you please share custom timber options, pricing confirmation, and delivery schedules?`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
};
