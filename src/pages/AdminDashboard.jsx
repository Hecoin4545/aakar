import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Layers, MessageSquare, Clock, Plus,
  Search, Edit3, Trash2, LogOut, CheckCircle, AlertTriangle, Eye, Upload, X
} from 'lucide-react';
import { productService, workService, inquiryService, journeyService, uploadService } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'work', 'inquiries', 'timeline'

  // Data States
  const [products, setProducts] = useState([]);
  const [workProjects, setWorkProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State for Product Create/Edit
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Dining Room',
    material: 'Solid Teak',
    basePrice: '',
    dimensions: '220cm L x 100cm W x 76cm H',
    finish: 'Hand-rubbed organic oil & beeswax',
    stockStatus: 'In Stock',
    badge: '',
    description: '',
    images: []
  });
  const [productFormError, setProductFormError] = useState('');

  // Modal State for Work Create
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [workForm, setWorkForm] = useState({
    title: '',
    roomType: 'Living Room',
    scope: 'Bespoke Furniture Transformation',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    completedYear: 2026,
    description: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('hc_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [pRes, wRes, iRes, tRes] = await Promise.all([
        productService.getProducts(),
        workService.getWorkProjects(),
        inquiryService.getInquiries(),
        journeyService.getTimelineEvents()
      ]);

      if (pRes.data?.products) setProducts(pRes.data.products);
      if (wRes.data?.projects) setWorkProjects(wRes.data.projects);
      if (iRes.data?.inquiries) setInquiries(iRes.data.inquiries);
      if (tRes.data?.events) setTimelineEvents(tRes.data.events);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hc_admin_token');
    localStorage.removeItem('hc_admin_user');
    navigate('/admin/login');
  };

  // PRODUCT CRUD
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductFormError('');
    setProductForm({
      title: '',
      category: 'Dining Room',
      material: 'Solid Teak',
      basePrice: '150000',
      dimensions: '220cm L x 100cm W x 76cm H',
      finish: 'Hand-rubbed organic oil & beeswax',
      warranty: '10-Year Structural Warranty',
      careInstructions: 'Dust clean with a dry microfiber cloth.',
      stockStatus: 'In Stock',
      badge: '',
      description: '',
      images: []
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormError('');
    setProductForm({
      title: prod.title,
      category: prod.category,
      material: prod.material,
      basePrice: prod.basePrice,
      dimensions: prod.dimensions || '',
      finish: prod.finish || '',
      warranty: prod.warranty || '10-Year Structural Warranty',
      careInstructions: prod.careInstructions || 'Dust clean with a dry microfiber cloth.',
      stockStatus: prod.stockStatus || 'In Stock',
      badge: prod.badge || '',
      description: prod.description || '',
      images: prod.images && prod.images.length ? [...prod.images] : []
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setProductFormError('');

    // Sanitize the form data before sending
    const sanitized = {
      ...productForm,
      basePrice: Number(productForm.basePrice),
      // badge: only send valid enum values
      badge: ['NEW', 'BESTSELLER', 'CUSTOM ORDER'].includes(productForm.badge)
        ? productForm.badge
        : null,
      // description: provide fallback if empty
      description: productForm.description.trim() || `${productForm.title} — handcrafted ${productForm.material} piece from Heritage Craftsmen.`,
      // images: filter out empty strings
      images: productForm.images.filter(img => img && img.trim()),
    };

    // Ensure at least one image (fallback to a default)
    if (sanitized.images.length === 0) {
      sanitized.images = ['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80'];
    }

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, sanitized);
      } else {
        await productService.createProduct(sanitized);
      }
      setIsProductModalOpen(false);
      loadDashboardData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unknown error';
      setProductFormError('Failed to save product: ' + msg);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      loadDashboardData();
    } catch {
      alert('Failed to delete product');
    }
  };

  // WORK CRUD
  const handleSaveWorkProject = async (e) => {
    e.preventDefault();
    try {
      await workService.createWorkProject(workForm);
      setIsWorkModalOpen(false);
      loadDashboardData();
    } catch {
      alert('Failed to save work project');
    }
  };

  const handleDeleteWorkProject = async (id) => {
    if (!window.confirm('Delete this work project entry?')) return;
    try {
      await workService.deleteWorkProject(id);
      loadDashboardData();
    } catch {
      alert('Failed to delete project');
    }
  };

  // Image Upload helper
  const handleImageUpload = async (e, fieldSetter) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadService.uploadImage(formData);
      if (res.data?.url) {
        fieldSetter(res.data.url);
      }
    } catch {
      alert('Image upload failed. Using provided default URL.');
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchSearch = !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F3E9] flex">

      {/* 1. LEFT SIDEBAR NAVIGATION (Cream bg + Dark Active Highlight Bar matching design.md) */}
      <aside className="w-64 bg-[#EFEAE0] border-r border-[#E3DDCE] flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo Bar */}
          <div className="p-6 border-b border-[#E3DDCE]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#3A2A1C] text-[#C9A45C] font-serif font-bold text-sm flex items-center justify-center">
                H
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-[#3A2A1C] leading-none">
                  HERITAGE
                </h2>
                <span className="font-sans text-[9px] uppercase tracking-widest text-[#B4863A]">
                  Admin Workspace
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 font-sans text-xs">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'products'
                  ? 'bg-[#3A2A1C] text-[#C9A45C] font-semibold shadow-sm border-l-4 border-[#B4863A]'
                  : 'text-[#4A5A78] hover:bg-[#F7F3E9] hover:text-[#3A2A1C]'
                }`}
            >
              <Package className="w-4 h-4" />
              <span>Product Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab('work')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'work'
                  ? 'bg-[#3A2A1C] text-[#C9A45C] font-semibold shadow-sm border-l-4 border-[#B4863A]'
                  : 'text-[#4A5A78] hover:bg-[#F7F3E9] hover:text-[#3A2A1C]'
                }`}
            >
              <Layers className="w-4 h-4" />
              <span>Work Commissions</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all ${activeTab === 'inquiries'
                  ? 'bg-[#3A2A1C] text-[#C9A45C] font-semibold shadow-sm border-l-4 border-[#B4863A]'
                  : 'text-[#4A5A78] hover:bg-[#F7F3E9] hover:text-[#3A2A1C]'
                }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Customer Inquiries</span>
              </div>
              {inquiries.length > 0 && (
                <span className="bg-[#B4863A] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {inquiries.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'timeline'
                  ? 'bg-[#3A2A1C] text-[#C9A45C] font-semibold shadow-sm border-l-4 border-[#B4863A]'
                  : 'text-[#4A5A78] hover:bg-[#F7F3E9] hover:text-[#3A2A1C]'
                }`}
            >
              <Clock className="w-4 h-4" />
              <span>Journey Timeline</span>
            </button>
          </nav>
        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-[#E3DDCE] space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-[#8A8478] hover:text-[#3A2A1C] font-sans flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-white border border-[#E3DDCE] hover:bg-[#3A2A1C] hover:text-white text-[#3A2A1C] font-sans text-xs font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm font-sans text-[#8A8478]">Loading dashboard data...</div>
          </div>
        )}
        {!loading && (
          <>
            {/* STAT CARDS ROW matching design.md */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              <div className="bg-white border border-[#E3DDCE] rounded-lg p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#3A2A1C] text-[#C9A45C] flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#3A2A1C]">{products.length}</div>
                  <div className="font-sans text-xs text-[#8A8478]">Total Products</div>
                </div>
              </div>

              <div className="bg-white border border-[#E3DDCE] rounded-lg p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#5B7A4F]/10 text-[#5B7A4F] flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#3A2A1C]">
                    {products.filter(p => p.stockStatus === 'In Stock').length}
                  </div>
                  <div className="font-sans text-xs text-[#8A8478]">Active Listings</div>
                </div>
              </div>

              <div className="bg-white border border-[#E3DDCE] rounded-lg p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#C07A2E]/10 text-[#C07A2E] flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#3A2A1C]">
                    {products.filter(p => p.stockStatus === 'Low Stock' || p.stockStatus === 'Draft').length}
                  </div>
                  <div className="font-sans text-xs text-[#8A8478]">Low Stock / Drafts</div>
                </div>
              </div>

              <div className="bg-white border border-[#E3DDCE] rounded-lg p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#B4863A]/10 text-[#B4863A] flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#3A2A1C]">{inquiries.length}</div>
                  <div className="font-sans text-xs text-[#8A8478]">Total Inquiries</div>
                </div>
              </div>

            </div>

            {/* TAB CONTENT 1: PRODUCT MANAGEMENT CRUD TABLE */}
            {activeTab === 'products' && (
              <div className="bg-white border border-[#E3DDCE] rounded-lg p-6 shadow-sm space-y-6">

                {/* Header & Primary CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#3A2A1C]">
                      Product Inventory Management
                    </h2>
                    <p className="font-sans text-xs text-[#8A8478]">
                      Manage catalog prices, dimensions, color swatches, and stock statuses.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenCreateProduct}
                    className="bg-[#2C2015] hover:bg-[#3A2A1C] text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-3 rounded shadow transition-all flex items-center gap-2 self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 text-[#C9A45C]" />
                    <span>+ Add New Product</span>
                  </button>
                </div>

                {/* Search & Category Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F7F3E9] p-3 rounded-md border border-[#E3DDCE]">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8478]" />
                    <input
                      type="text"
                      placeholder="Filter products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white border border-[#E3DDCE] rounded pl-9 pr-3 py-1.5 text-xs text-[#3A2A1C] focus:outline-none focus:border-[#B4863A]"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="font-sans text-xs text-[#8A8478]">Category:</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-white border border-[#E3DDCE] rounded px-3 py-1.5 text-xs font-sans text-[#3A2A1C] focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Dining Room">Dining Room</option>
                      <option value="Living Room">Living Room</option>
                      <option value="Master Suite">Master Suite</option>
                      <option value="Home Office">Home Office</option>
                      <option value="Seating">Seating</option>
                      <option value="Tables">Tables</option>
                      <option value="Storage">Storage</option>
                    </select>
                  </div>
                </div>

                {/* PRODUCTS DATA TABLE */}
                <div className="overflow-x-auto border border-[#E3DDCE] rounded-lg">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-[#EFEAE0] border-b border-[#E3DDCE] uppercase text-[10px] font-bold tracking-widest text-[#B4863A]">
                      <tr>
                        <th className="py-3.5 px-4">Item Details</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Material</th>
                        <th className="py-3.5 px-4">Base Price</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3DDCE]">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-[#8A8478]">
                            No products match your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((prod) => (
                          <tr key={prod._id} className="hover:bg-[#F7F3E9]/60 transition-colors">

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80'}
                                  alt={prod.title}
                                  className="w-12 h-12 rounded object-cover border border-[#E3DDCE]"
                                />
                                <div>
                                  <div className="font-serif font-bold text-sm text-[#3A2A1C]">{prod.title}</div>
                                  {prod.badge && (
                                    <span className="text-[9px] bg-[#B4863A]/10 text-[#B4863A] px-1.5 py-0.5 rounded font-bold uppercase">
                                      {prod.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-[#4A5A78] font-medium">{prod.category}</td>
                            <td className="py-3.5 px-4 text-[#4A5A78]">{prod.material}</td>
                            <td className="py-3.5 px-4 font-bold text-[#3A2A1C]">
                              {prod.priceFormatted || `₹${Number(prod.basePrice).toLocaleString('en-IN')}`}
                            </td>

                            {/* STATUS PILL (matching design.md green, amber, gray rules) */}
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${prod.stockStatus === 'In Stock'
                                  ? 'bg-[#5B7A4F]/15 text-[#5B7A4F]'
                                  : prod.stockStatus === 'Low Stock'
                                    ? 'bg-[#C07A2E]/15 text-[#C07A2E]'
                                    : 'bg-[#8A8478]/15 text-[#8A8478]'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${prod.stockStatus === 'In Stock' ? 'bg-[#5B7A4F]' : prod.stockStatus === 'Low Stock' ? 'bg-[#C07A2E]' : 'bg-[#8A8478]'
                                  }`} />
                                <span>{prod.stockStatus || 'In Stock'}</span>
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-1.5 rounded text-[#B4863A] hover:bg-[#EFEAE0] transition-colors"
                                  title="Edit item"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod._id)}
                                  className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: WORK COMMISSIONS */}
            {activeTab === 'work' && (
              <div className="bg-white border border-[#E3DDCE] rounded-lg p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#3A2A1C]">Work Commissions & Transformations</h2>
                    <p className="font-sans text-xs text-[#8A8478]">Manage Before/After project portfolios.</p>
                  </div>
                  <button
                    onClick={() => setIsWorkModalOpen(true)}
                    className="bg-[#2C2015] text-white text-xs font-bold uppercase px-4 py-2.5 rounded flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-[#C9A45C]" />
                    <span>+ Add Project</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workProjects.map((w) => (
                    <div key={w._id} className="border border-[#E3DDCE] rounded-lg p-4 bg-[#F7F3E9]/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif font-bold text-lg text-[#3A2A1C]">{w.title}</h3>
                        <button
                          onClick={() => handleDeleteWorkProject(w._id)}
                          className="text-red-600 hover:text-red-800 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                        <div>
                          <span className="text-[10px] font-bold text-[#8A8478] block">BEFORE</span>
                          <img src={w.beforeImage} alt="Before" className="w-full h-24 object-cover rounded border" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#5B7A4F] block">AFTER</span>
                          <img src={w.afterImage} alt="After" className="w-full h-24 object-cover rounded border" />
                        </div>
                      </div>
                      <p className="text-xs text-[#4A5A78]">{w.scope}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="bg-white border border-[#E3DDCE] rounded-lg p-6 shadow-sm space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#3A2A1C]">Customer Inquiries Log</h2>
                <div className="space-y-3">
                  {inquiries.length === 0 ? (
                    <p className="text-xs text-[#8A8478]">No customer inquiries recorded yet.</p>
                  ) : (
                    inquiries.map((inq, idx) => (
                      <div key={inq._id || idx} className="p-4 border border-[#E3DDCE] rounded bg-[#F7F3E9]/50 space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold text-[#3A2A1C]">
                          <span>{inq.name} ({inq.phone})</span>
                          <span className="text-[#B4863A]">{new Date(inq.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-[#4A5A78]">
                          <strong>Requirement:</strong> {inq.furnitureType} | <strong>Budget:</strong> {inq.budgetRange}
                        </div>
                        {inq.message && <p className="text-xs text-[#8A8478]">{inq.message}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="bg-white border border-[#E3DDCE] rounded-lg p-6 shadow-sm space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#3A2A1C]">Brand Journey Timeline</h2>
                <div className="space-y-4">
                  {timelineEvents.map((ev) => (
                    <div key={ev._id} className="p-4 border border-[#E3DDCE] rounded flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-serif text-2xl font-bold text-[#B4863A]">{ev.year}</span>
                        <div>
                          <h4 className="font-serif font-bold text-[#3A2A1C]">{ev.title}</h4>
                          <p className="text-xs text-[#4A5A78]">{ev.description}</p>
                        </div>
                      </div>
                      {ev.isArchival && <span className="text-[10px] bg-[#2C2015] text-[#C9A45C] px-2 py-0.5 rounded uppercase font-bold">Archival</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F7F3E9] w-full max-w-2xl rounded-xl border border-[#E3DDCE] shadow-2xl p-6 space-y-4 my-8">

            <div className="flex items-center justify-between border-b border-[#E3DDCE] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#3A2A1C]">
                {editingProduct ? 'Edit Furniture Item' : 'Create New Product'}
              </h3>
              <button onClick={() => { setIsProductModalOpen(false); setProductFormError(''); }}>
                <X className="w-5 h-5 text-[#3A2A1C]" />
              </button>
            </div>

            {productFormError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700 font-sans">
                ⚠ {productFormError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 font-sans text-xs">

              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                  >
                    <option value="Dining Room">Dining Room</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Master Suite">Master Suite</option>
                    <option value="Home Office">Home Office</option>
                    <option value="Seating">Seating</option>
                    <option value="Tables">Tables</option>
                    <option value="Storage">Storage</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                    className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Primary Material *</label>
                  <input
                    type="text"
                    required
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Stock Status</label>
                  <select
                    value={productForm.stockStatus}
                    onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value })}
                    className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Finish Treatment</label>
                  <input
                    type="text"
                    value={productForm.finish}
                    onChange={(e) => setProductForm({ ...productForm, finish: e.target.value })}
                    className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Warranty</label>
                  <input
                    type="text"
                    value={productForm.warranty}
                    onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                    className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Care Instructions</label>
                  <input
                    type="text"
                    value={productForm.careInstructions}
                    onChange={(e) => setProductForm({ ...productForm, careInstructions: e.target.value })}
                    className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Badge / Label</label>
                <select
                  value={productForm.badge}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                >
                  <option value="">None</option>
                  <option value="NEW">NEW</option>
                  <option value="BESTSELLER">BESTSELLER</option>
                  <option value="CUSTOM ORDER">CUSTOM ORDER</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold text-[#3A2A1C]">Product Images</label>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''] })}
                    className="text-xs text-[#B4863A] font-bold"
                  >
                    + Add Image
                  </button>
                </div>

                <div className="space-y-2">
                  {productForm.images.map((imgUrl, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={imgUrl || ''}
                        onChange={(e) => {
                          const newImages = [...productForm.images];
                          newImages[idx] = e.target.value;
                          setProductForm({ ...productForm, images: newImages });
                        }}
                        className="flex-1 bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                        placeholder="https://..."
                      />
                      <label className="bg-[#3A2A1C] text-white px-3 py-2 rounded cursor-pointer text-xs font-semibold flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5 text-[#C9A45C]" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, (url) => {
                            const newImages = [...productForm.images];
                            newImages[idx] = url;
                            setProductForm({ ...productForm, images: newImages });
                          })}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...productForm.images];
                          newImages.splice(idx, 1);
                          setProductForm({ ...productForm, images: newImages });
                        }}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {productForm.images.length === 0 && (
                    <p className="text-[10px] text-gray-500 italic">No images added. Click + Add Image URL</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E3DDCE]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-[#E3DDCE] rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2C2015] text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CREATE WORK PROJECT MODAL */}
      {isWorkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F7F3E9] w-full max-w-lg rounded-xl border border-[#E3DDCE] p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-serif text-lg font-bold">Add Work Commission</h3>
              <button onClick={() => setIsWorkModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveWorkProject} className="space-y-3 text-xs font-sans">
              <input
                placeholder="Project Title *"
                required
                value={workForm.title}
                onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                className="w-full p-2.5 border rounded"
              />
              <input
                placeholder="Scope (e.g. 12-Seater Live Edge Table)"
                required
                value={workForm.scope}
                onChange={(e) => setWorkForm({ ...workForm, scope: e.target.value })}
                className="w-full p-2.5 border rounded"
              />
              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Before Image *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={workForm.beforeImage}
                    onChange={(e) => setWorkForm({ ...workForm, beforeImage: e.target.value })}
                    className="flex-1 p-2.5 border rounded text-xs"
                    placeholder="https://..."
                  />
                  <label className="bg-[#3A2A1C] text-white px-3 py-2 rounded cursor-pointer text-xs font-semibold flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-[#C9A45C]" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, (url) => setWorkForm({ ...workForm, beforeImage: url }))}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">After Image *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={workForm.afterImage}
                    onChange={(e) => setWorkForm({ ...workForm, afterImage: e.target.value })}
                    className="flex-1 p-2.5 border rounded text-xs"
                    placeholder="https://..."
                  />
                  <label className="bg-[#3A2A1C] text-white px-3 py-2 rounded cursor-pointer text-xs font-semibold flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-[#C9A45C]" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, (url) => setWorkForm({ ...workForm, afterImage: url }))}
                    />
                  </label>
                </div>
              </div>
              <textarea
                placeholder="Description..."
                value={workForm.description}
                onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
                className="w-full p-2.5 border rounded"
              />
              <button type="submit" className="w-full bg-[#2C2015] text-white py-2.5 rounded font-bold uppercase">
                Save Work Entry
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
