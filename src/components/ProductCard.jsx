import React from 'react';
import { Eye, MessageCircle } from 'lucide-react';
import { createProductInquiryWhatsAppUrl } from '../utils/whatsapp';

const ProductCard = ({ product, onQuickView }) => {
  const {
    title,
    category,
    priceFormatted,
    basePrice,
    images,
    badge,
    stockStatus,
    variants
  } = product;

  const displayPrice = priceFormatted || `₹${Number(basePrice).toLocaleString('en-IN')}`;
  const thumbnail = images && images.length ? images[0] : 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80';

  const whatsappUrl = createProductInquiryWhatsAppUrl({
    product,
    selectedVariant: variants && variants.length ? variants[0] : null,
    selectedSize: variants && variants[0]?.sizes ? variants[0].sizes[0] : null
  });

  return (
    <div className="group bg-white border border-[#E3DDCE] rounded-lg overflow-hidden hover:shadow-luxury transition-all duration-300 flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-[#EFEAE0] overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badge Pill Top-Left */}
        {badge && (
          <div className="absolute top-3 left-3 bg-[#F7F3E9]/90 backdrop-blur border border-[#E3DDCE] text-[#3A2A1C] text-[10px] font-sans font-bold tracking-widest uppercase px-2.5 py-1 rounded shadow-sm">
            {badge}
          </div>
        )}

        {/* Stock Status Top-Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-medium border border-[#E3DDCE]">
          <span className={`w-1.5 h-1.5 rounded-full ${
            stockStatus === 'In Stock' ? 'bg-[#5B7A4F]' : stockStatus === 'Low Stock' ? 'bg-[#C07A2E]' : 'bg-[#8A8478]'
          }`} />
          <span className="text-[#4A5A78]">{stockStatus || 'In Stock'}</span>
        </div>

        {/* Hover Quick View Button */}
        <div className="absolute inset-0 bg-[#2C2015]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
          <button
            onClick={() => onQuickView(product)}
            className="bg-white hover:bg-[#F7F3E9] text-[#3A2A1C] text-xs font-sans font-semibold tracking-wider uppercase px-4 py-2.5 rounded shadow-lg flex items-center gap-1.5 transition-transform duration-200 hover:scale-105"
          >
            <Eye className="w-4 h-4 text-[#B4863A]" />
            <span>Quick View</span>
          </button>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#5B7A4F] hover:bg-[#4a6440] text-white text-xs font-sans font-semibold p-2.5 rounded shadow-lg transition-transform duration-200 hover:scale-105"
            title="Enquire on WhatsApp"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col justify-between flex-grow bg-white">
        <div>
          {/* Eyebrow & Price Row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-sans text-[11px] font-semibold tracking-widest text-[#B4863A] uppercase">
              {category}
            </span>
            <span className="font-sans text-sm font-semibold text-[#3A2A1C]">
              {displayPrice}
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-serif text-lg font-bold text-[#3A2A1C] hover:text-[#B4863A] transition-colors cursor-pointer leading-tight mb-2"
          >
            {title}
          </h3>

          <p className="font-sans text-xs text-[#4A5A78] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Color Swatches & Action Footer */}
        <div className="mt-4 pt-3 border-t border-[#E3DDCE]/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {variants && variants.length > 0 ? (
              variants.map((v, idx) => (
                <span
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-[#E3DDCE] shadow-inner inline-block"
                  style={{ backgroundColor: v.hexColor || '#B4863A' }}
                  title={v.colorName}
                />
              ))
            ) : (
              <span className="text-[10px] text-[#8A8478] font-sans">Natural Solid Wood</span>
            )}
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="font-sans text-xs font-semibold text-[#B4863A] hover:text-[#3A2A1C] transition-colors flex items-center gap-1"
          >
            <span>Details</span>
            <span>→</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
