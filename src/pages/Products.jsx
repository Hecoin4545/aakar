import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';

import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import AnimatedCounter from '../components/AnimatedCounter';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedStock, setSelectedStock] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(300000);
  const [sortBy, setSortBy] = useState('newest');

  // Mobile filter drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    'All',
    'Dining Room',
    'Living Room',
    'Master Suite',
    'Home Office',
    'Seating',
    'Tables',
    'Storage',
  ];

  const materials = [
    'All',
    'Teak',
    'Walnut',
    'Oak',
    'Marble',
  ];

  const stockStatuses = [
    'All',
    'In Stock',
    'Low Stock',
  ];

  // Sync category with URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'All';
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = {
          sort: sortBy,
        };

        // Only send filters when they are actually selected
        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }

        if (selectedMaterial !== 'All') {
          params.material = selectedMaterial;
        }

        if (selectedStock !== 'All') {
          params.stockStatus = selectedStock;
        }

        const res = await productService.getProducts(params);

        if (res?.data?.products) {
          setProducts(res.data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    selectedCategory,
    selectedMaterial,
    selectedStock,
    sortBy,
  ]);

  // Search + price filtering
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return products.filter((product) => {
      const title = product?.title?.toLowerCase() || '';
      const category = product?.category?.toLowerCase() || '';
      const material = product?.material?.toLowerCase() || '';

      const matchSearch =
        !query ||
        title.includes(query) ||
        category.includes(query) ||
        material.includes(query);

      const price = Number(product?.basePrice || 0);

      const matchPrice = price <= maxPrice;

      return matchSearch && matchPrice;
    });
  }, [products, searchQuery, maxPrice]);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedMaterial('All');
    setSelectedStock('All');
    setSearchQuery('');
    setMaxPrice(300000);
    setSortBy('newest');

    setSearchParams({});
  };

  // Category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({
        category,
      });
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">


      <div className="relative z-10">

        {/* ================= PAGE HEADER ================= */}
        <div className="mb-8">
          <div className="font-sans text-xs font-bold tracking-widest text-[#B4863A] uppercase mb-1">
            Catalog Collections
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2A1C]">
            Handcrafted Atelier Inventory
          </h1>

          <p className="font-sans text-sm text-[#4A5A78] mt-1 max-w-2xl">
            Browse our solid timber dining tables, lounge seating,
            platform beds, and credenzas. Each item is customizable to order.
          </p>
        </div>

        {/* ================= SEARCH + SORT BAR ================= */}
        <div className="bg-white border border-[#E3DDCE] rounded-lg p-4 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8478]" />

            <input
              type="text"
              placeholder="Search by product name, timber, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F3E9] border border-[#E3DDCE] rounded-md pl-10 pr-4 py-2.5 text-xs text-[#3A2A1C] placeholder-[#8A8478] focus:outline-none focus:border-[#B4863A] transition-colors"
            />
          </div>

          {/* Sort + Count */}
          <div className="flex items-center justify-between md:justify-end gap-4">

            {/* Mobile Filters */}
            <button
              type="button"
              onClick={() =>
                setMobileFilterOpen((prev) => !prev)
              }
              className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-[#E3DDCE] rounded text-xs font-sans text-[#3A2A1C] bg-[#F7F3E9]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B4863A]" />

              <span>Filters</span>
            </button>

            {/* Product Count */}
            <span className="font-sans text-xs text-[#8A8478] hidden lg:inline">
              Showing{' '}
              <AnimatedCounter
                value={filteredProducts.length}
                duration={0.8}
              />{' '}
              of{' '}
              <AnimatedCounter
                value={products.length}
                duration={0.8}
              />{' '}
              products
            </span>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <label className="font-sans text-xs font-medium text-[#4A5A78] hidden sm:inline">
                Sort By:
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F7F3E9] border border-[#E3DDCE] rounded px-3 py-2 text-xs font-sans text-[#3A2A1C] focus:outline-none focus:border-[#B4863A]"
              >
                <option value="newest">
                  Latest Arrivals
                </option>

                <option value="price-asc">
                  Price: Low to High
                </option>

                <option value="price-desc">
                  Price: High to Low
                </option>
              </select>
            </div>

          </div>
        </div>

        {/* ================= MAIN LAYOUT ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* ================= FILTER SIDEBAR ================= */}
          <aside
            className={`
              md:col-span-3
              space-y-6
              bg-white
              p-5
              border
              border-[#E3DDCE]
              rounded-lg
              shadow-sm
              h-fit
              ${mobileFilterOpen ? 'block' : 'hidden md:block'}
            `}
          >

            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DDCE]">

              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-[#3A2A1C] flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#B4863A]" />

                <span>Filter Inventory</span>
              </h3>

              <button
                type="button"
                onClick={handleClearFilters}
                className="font-sans text-[11px] font-semibold text-[#B4863A] hover:text-[#3A2A1C] transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />

                <span>Clear All</span>
              </button>

            </div>

            {/* ================= CATEGORY ================= */}
            <div>
              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#B4863A] mb-2.5">
                Category
              </h4>

              <div className="space-y-1">
                {categories.map((category) => {
                  const isSelected =
                    selectedCategory === category;

                  return (
                    <button
                      type="button"
                      key={category}
                      onClick={() =>
                        handleCategoryChange(category)
                      }
                      className={`
                        w-full
                        text-left
                        px-2.5
                        py-1.5
                        rounded
                        text-xs
                        font-sans
                        transition-colors
                        flex
                        items-center
                        justify-between
                        ${isSelected
                          ? 'bg-[#3A2A1C] text-white font-semibold'
                          : 'text-[#4A5A78] hover:bg-[#F7F3E9]'
                        }
                      `}
                    >
                      <span>{category}</span>

                      {isSelected && (
                        <span className="text-[#C9A45C]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================= MATERIAL ================= */}
            <div className="pt-3 border-t border-[#E3DDCE]">

              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#B4863A] mb-2.5">
                Material
              </h4>

              <div className="space-y-1">
                {materials.map((material) => {
                  const isSelected =
                    selectedMaterial === material;

                  return (
                    <button
                      type="button"
                      key={material}
                      onClick={() =>
                        setSelectedMaterial(material)
                      }
                      className={`
                        w-full
                        text-left
                        px-2.5
                        py-1.5
                        rounded
                        text-xs
                        font-sans
                        transition-colors
                        flex
                        items-center
                        justify-between
                        ${isSelected
                          ? 'bg-[#3A2A1C] text-white font-semibold'
                          : 'text-[#4A5A78] hover:bg-[#F7F3E9]'
                        }
                      `}
                    >
                      <span>{material}</span>

                      {isSelected && (
                        <span className="text-[#C9A45C]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================= PRICE ================= */}
            <div className="pt-3 border-t border-[#E3DDCE]">

              <div className="flex items-center justify-between mb-2">

                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#B4863A]">
                  Max Price
                </h4>

                <span className="font-sans text-xs font-bold text-[#3A2A1C] flex items-center">
                  ₹
                  <AnimatedCounter
                    value={maxPrice}
                    duration={0.3}
                  />
                </span>

              </div>

              <input
                type="range"
                min={50000}
                max={300000}
                step={10000}
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Number(e.target.value))
                }
                className="w-full accent-[#B4863A] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-[#8A8478] font-sans mt-1">
                <span>₹50,000</span>
                <span>₹3,00,000</span>
              </div>

            </div>

            {/* ================= STOCK ================= */}
            <div className="pt-3 border-t border-[#E3DDCE]">

              <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#B4863A] mb-2.5">
                Availability
              </h4>

              <div className="space-y-1">
                {stockStatuses.map((status) => {
                  const isSelected =
                    selectedStock === status;

                  return (
                    <button
                      type="button"
                      key={status}
                      onClick={() =>
                        setSelectedStock(status)
                      }
                      className={`
                        w-full
                        text-left
                        px-2.5
                        py-1.5
                        rounded
                        text-xs
                        font-sans
                        transition-colors
                        flex
                        items-center
                        justify-between
                        ${isSelected
                          ? 'bg-[#3A2A1C] text-white font-semibold'
                          : 'text-[#4A5A78] hover:bg-[#F7F3E9]'
                        }
                      `}
                    >
                      <span>{status}</span>

                      {isSelected && (
                        <span className="text-[#C9A45C]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>

          </aside>

          {/* ================= PRODUCT GRID ================= */}
          <main className="md:col-span-9">

            {/* Loading */}
            {loading ? (
              <div className="py-20 text-center font-sans text-sm text-[#8A8478]">
                Fetching catalog items...
              </div>
            ) : filteredProducts.length === 0 ? (

              /* No Products */
              <div className="bg-white border border-[#E3DDCE] rounded-lg p-12 text-center space-y-3">

                <h3 className="font-serif text-xl font-bold text-[#3A2A1C]">
                  No matching furniture pieces found
                </h3>

                <p className="font-sans text-xs text-[#8A8478]">
                  Try adjusting your search criteria or
                  price slider.
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="bg-[#2C2015] text-white font-sans text-xs font-semibold uppercase px-6 py-2.5 rounded mt-2 hover:bg-[#3A2A1C] transition-colors"
                >
                  Reset All Filters
                </button>

              </div>

            ) : (

              /* Products */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product?._id}
                    product={product}
                    onQuickView={(productItem) =>
                      setSelectedProduct(productItem)
                    }
                  />
                ))}

              </div>

            )}

          </main>

        </div>

        {/* ================= PRODUCT DETAIL MODAL ================= */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() =>
              setSelectedProduct(null)
            }
          />
        )}

      </div>
    </div>
  );
};

export default Products;