import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Layers, MessageSquare, Clock, Plus,
  Search, Edit3, Trash2, LogOut, CheckCircle, AlertTriangle,
  Eye, Upload, X, MapPin, Image as ImageIcon
} from 'lucide-react';
import {
  productService, workService, inquiryService,
  journeyService, uploadService
} from '../services/api';

// ─── Reusable image-upload helper component ───────────────────────────────────
function ImageUploadField({ label, url, onUrlChange, onUpload, required = false }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await uploadService.uploadImages(fd);
      if (res.data?.url) {
        onUpload(res.data.url, res.data.public_id || null);
      }
    } catch {
      alert('Image upload failed. Check your Cloudinary credentials.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block font-semibold text-[#3A2A1C] mb-1 text-xs">{label}{required ? ' *' : ''}</label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={url || ''}
          onChange={(e) => onUrlChange(e.target.value)}
          className="flex-1 bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
          placeholder="Paste URL or upload →"
        />
        <label className={`flex items-center gap-1 px-3 py-2 rounded cursor-pointer text-xs font-semibold text-white transition-colors ${uploading ? 'bg-[#8A8478]' : 'bg-[#3A2A1C] hover:bg-[#B4863A]'}`}>
          {uploading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Upload className="w-3.5 h-3.5 text-[#C9A45C]" />
          )}
          <span>{uploading ? 'Uploading…' : 'Upload'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {url && (
        <img src={url} alt="preview" className="mt-2 h-20 w-full object-cover rounded border border-[#E3DDCE]" onError={(e) => { e.target.style.display = 'none'; }} />
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  // Data States
  const [products, setProducts] = useState([]);
  const [workProjects, setWorkProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // ── Product Modal ──────────────────────────────────────────────────────────
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const blankProductForm = {
    title: '', category: 'Dining Room', material: 'Solid Teak',
    basePrice: '150000', dimensions: '220cm L x 100cm W x 76cm H',
    finish: 'Hand-rubbed organic oil & beeswax', warranty: '10-Year Structural Warranty',
    careInstructions: 'Dust clean with a dry microfiber cloth.',
    stockStatus: 'In Stock', badge: '', description: '',
    images: [], imagePublicIds: []     // ← parallel arrays: images[i] ↔ imagePublicIds[i]
  };
  const [productForm, setProductForm] = useState(blankProductForm);
  const [productFormError, setProductFormError] = useState('');

  // ── Work Modal ─────────────────────────────────────────────────────────────
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [editingWorkProject, setEditingWorkProject] = useState(null);
  const blankWorkForm = {
    title: '',
    clientLocation: 'The Minimalist Villa — Zurich',
    sqft: '4,200 sq. ft.',
    roomType: 'Living Room',
    scope: 'Interior Architecture & Custom Paneling',
    beforeImage: '', beforeImagePublicId: null,
    afterImage: '', afterImagePublicId: null,
    completedYear: new Date().getFullYear(),
    dimensions: '',
    materialsUsed: 'Smoked Oak, Brushed Brass, Italian Travertine',
    description: '',
    gallery: [],
    customFurnitureItems: []
  };
  const [workForm, setWorkForm] = useState(blankWorkForm);
  const [workFormError, setWorkFormError] = useState('');

  // ── Timeline Modal ─────────────────────────────────────────────────────────
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const blankTimelineForm = {
    year: new Date().getFullYear(),
    title: '', description: '', location: 'Jodhpur Atelier',
    imageUrl: '', imagePublicId: null, isArchival: false
  };
  const [timelineForm, setTimelineForm] = useState(blankTimelineForm);
  const [timelineFormError, setTimelineFormError] = useState('');

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('hc_admin_token');
    if (!token) { navigate('/admin/login'); return; }
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
      if (tRes.data?.events) {
        const sorted = [...(tRes.data.events)].sort((a, b) => a.year - b.year);
        setTimelineEvents(sorted);
      }
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

  // ── PRODUCT CRUD ────────────────────────────────────────────────────────────
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductFormError('');
    setProductForm(blankProductForm);
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
      images: prod.images ? [...prod.images] : [],
      imagePublicIds: prod.imagePublicIds ? [...prod.imagePublicIds] : []
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setProductFormError('');

    if (productForm.images.filter(Boolean).length === 0) {
      setProductFormError('Please upload at least one product image before saving.');
      return;
    }

    const sanitized = {
      ...productForm,
      basePrice: Number(productForm.basePrice),
      badge: ['NEW', 'BESTSELLER', 'CUSTOM ORDER'].includes(productForm.badge) ? productForm.badge : null,
      description: productForm.description.trim() || `${productForm.title} — handcrafted ${productForm.material} piece.`,
      images: productForm.images.filter(img => img && img.trim()),
      imagePublicIds: productForm.imagePublicIds.filter(Boolean),
    };

    setActionLoading(true);
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
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product? Its Cloudinary images will also be removed.')) return;
    try {
      await productService.deleteProduct(id);
      loadDashboardData();
    } catch { alert('Failed to delete product.'); }
  };

  // Product image upload: maintains parallel images[] and imagePublicIds[]
  const handleProductImageUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await uploadService.uploadImages(fd);
      if (res.data?.url) {
        const newImages = [...productForm.images];
        const newPublicIds = [...productForm.imagePublicIds];
        newImages[idx] = res.data.url;
        newPublicIds[idx] = res.data.public_id || null;
        setProductForm({ ...productForm, images: newImages, imagePublicIds: newPublicIds });
      }
    } catch { alert('Image upload failed.'); }
  };

  // ── WORK CRUD ───────────────────────────────────────────────────────────────
  const handleOpenCreateWork = () => {
    setEditingWorkProject(null);
    setWorkFormError('');
    setWorkForm(blankWorkForm);
    setIsWorkModalOpen(true);
  };

  const handleOpenEditWork = (w) => {
    setEditingWorkProject(w);
    setWorkFormError('');
    setWorkForm({
      title: w.title || '',
      clientLocation: w.clientLocation || 'Private Residence — Zurich',
      sqft: w.sqft || '4,200 sq. ft.',
      roomType: w.roomType || 'Living Room',
      scope: w.scope || '',
      beforeImage: w.beforeImage || '',
      beforeImagePublicId: w.beforeImagePublicId || null,
      afterImage: w.afterImage || '',
      afterImagePublicId: w.afterImagePublicId || null,
      completedYear: w.completedYear || new Date().getFullYear(),
      dimensions: w.dimensions || '',
      materialsUsed: Array.isArray(w.materialsUsed) ? w.materialsUsed.join(', ') : (w.materialsUsed || ''),
      description: w.description || '',
      gallery: Array.isArray(w.gallery) ? [...w.gallery] : [],
      customFurnitureItems: Array.isArray(w.customFurnitureItems)
        ? w.customFurnitureItems.map(item => ({ ...item }))
        : []
    });
    setIsWorkModalOpen(true);
  };

  const handleWorkGalleryImageUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await uploadService.uploadImages(fd);
      if (res.data?.url) {
        const newGallery = [...workForm.gallery];
        newGallery[idx] = res.data.url;
        setWorkForm({ ...workForm, gallery: newGallery });
      }
    } catch { alert('Gallery image upload failed.'); }
  };

  const handleFurnitureItemImageUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await uploadService.uploadImages(fd);
      if (res.data?.url) {
        const newItems = [...workForm.customFurnitureItems];
        newItems[idx] = { ...newItems[idx], image: res.data.url };
        setWorkForm({ ...workForm, customFurnitureItems: newItems });
      }
    } catch { alert('Furniture image upload failed.'); }
  };

  const handleSaveWorkProject = async (e) => {
    e.preventDefault();
    setWorkFormError('');

    if (!workForm.beforeImage || !workForm.afterImage) {
      setWorkFormError('Please upload both Before and After images.');
      return;
    }

    const payload = {
      ...workForm,
      completedYear: Number(workForm.completedYear),
      materialsUsed: typeof workForm.materialsUsed === 'string'
        ? workForm.materialsUsed.split(',').map(m => m.trim()).filter(Boolean)
        : workForm.materialsUsed,
      gallery: (workForm.gallery || []).filter(g => g && g.trim()),
      customFurnitureItems: (workForm.customFurnitureItems || []).filter(item => item && item.title && item.title.trim())
    };

    setActionLoading(true);
    try {
      if (editingWorkProject) {
        await workService.updateWorkProject(editingWorkProject._id, payload);
      } else {
        await workService.createWorkProject(payload);
      }
      setIsWorkModalOpen(false);
      setWorkForm(blankWorkForm);
      loadDashboardData();
    } catch (err) {
      setWorkFormError(err.response?.data?.message || 'Failed to save work project.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteWorkProject = async (id) => {
    if (!window.confirm('Delete this work project? Cloudinary images will also be removed.')) return;
    try {
      await workService.deleteWorkProject(id);
      loadDashboardData();
    } catch { alert('Failed to delete project.'); }
  };

  // ── TIMELINE CRUD ───────────────────────────────────────────────────────────
  const handleSaveTimelineEvent = async (e) => {
    e.preventDefault();
    setTimelineFormError('');

    if (!timelineForm.imageUrl) {
      setTimelineFormError('Please upload an image for this milestone.');
      return;
    }

    const payload = { ...timelineForm, year: Number(timelineForm.year) };

    setActionLoading(true);
    try {
      await journeyService.createTimelineEvent(payload);
      setIsTimelineModalOpen(false);
      setTimelineForm(blankTimelineForm);
      loadDashboardData();
    } catch (err) {
      setTimelineFormError(err.response?.data?.message || 'Failed to save timeline event.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTimelineEvent = async (id) => {
    if (!window.confirm('Delete this timeline event? Its Cloudinary image will also be removed.')) return;
    try {
      await journeyService.deleteTimelineEvent(id);
      loadDashboardData();
    } catch { alert('Failed to delete event.'); }
  };

  // ── Filters ─────────────────────────────────────────────────────────────────
  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchSearch = !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F3E9] flex">

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-[#EFEAE0] border-r border-[#E3DDCE] flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="p-6 border-b border-[#E3DDCE]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#3A2A1C] text-[#C9A45C] font-serif font-bold text-sm flex items-center justify-center">H</div>
              <div>
                <h2 className="font-serif font-bold text-base text-[#3A2A1C] leading-none">HERITAGE</h2>
                <span className="font-sans text-[9px] uppercase tracking-widest text-[#B4863A]">Admin Workspace</span>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1.5 font-sans text-xs">
            {[
              { id: 'products', label: 'Product Inventory', Icon: Package },
              { id: 'work', label: 'Work Commissions', Icon: Layers },
              { id: 'timeline', label: 'Journey Timeline', Icon: Clock },
              { id: 'inquiries', label: 'Customer Inquiries', Icon: MessageSquare, badge: inquiries.length },
            ].map(({ id, label, Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between gap-3 transition-all ${activeTab === id
                  ? 'bg-[#3A2A1C] text-[#C9A45C] font-semibold shadow-sm border-l-4 border-[#B4863A]'
                  : 'text-[#4A5A78] hover:bg-[#F7F3E9] hover:text-[#3A2A1C]'
                }`}
              >
                <span className="flex items-center gap-3"><Icon className="w-4 h-4" />{label}</span>
                {badge > 0 && <span className="bg-[#B4863A] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{badge}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-[#E3DDCE] space-y-3">
          <button onClick={() => navigate('/')} className="text-xs text-[#8A8478] hover:text-[#3A2A1C] font-sans flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /><span>View Public Site</span>
          </button>
          <button onClick={handleLogout} className="w-full bg-white border border-[#E3DDCE] hover:bg-[#3A2A1C] hover:text-white text-[#3A2A1C] font-sans text-xs font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors">
            <LogOut className="w-3.5 h-3.5" /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <main className="flex-1 p-8 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-sm font-sans text-[#8A8478]">Loading dashboard data…</div>
          </div>
        ) : (
          <>
            {/* ── STAT CARDS ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Products', value: products.length, Icon: Package, color: 'bg-[#3A2A1C] text-[#C9A45C]' },
                { label: 'Active Listings', value: products.filter(p => p.stockStatus === 'In Stock').length, Icon: CheckCircle, color: 'bg-[#5B7A4F]/10 text-[#5B7A4F]' },
                { label: 'Low Stock / Drafts', value: products.filter(p => p.stockStatus !== 'In Stock').length, Icon: AlertTriangle, color: 'bg-[#C07A2E]/10 text-[#C07A2E]' },
                { label: 'Total Inquiries', value: inquiries.length, Icon: MessageSquare, color: 'bg-[#B4863A]/10 text-[#B4863A]' },
              ].map(({ label, value, Icon, color }) => (
                <div key={label} className="bg-white border border-[#E3DDCE] rounded-lg p-5 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-serif text-2xl font-bold text-[#3A2A1C]">{value}</div>
                    <div className="font-sans text-xs text-[#8A8478]">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ══════════════════════════════════════════════════════════════
                TAB 1: PRODUCTS
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'products' && (
              <div className="bg-white border border-[#E3DDCE] rounded-lg p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#3A2A1C]">Product Inventory</h2>
                    <p className="font-sans text-xs text-[#8A8478]">Manage catalog, images (stored in Cloudinary), prices, and stock.</p>
                  </div>
                  <button onClick={handleOpenCreateProduct} className="bg-[#2C2015] hover:bg-[#3A2A1C] text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-3 rounded shadow transition-all flex items-center gap-2 self-start sm:self-auto">
                    <Plus className="w-4 h-4 text-[#C9A45C]" /><span>Add Product</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F7F3E9] p-3 rounded-md border border-[#E3DDCE]">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8478]" />
                    <input type="text" placeholder="Filter products…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-[#E3DDCE] rounded pl-9 pr-3 py-1.5 text-xs text-[#3A2A1C] focus:outline-none focus:border-[#B4863A]" />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="font-sans text-xs text-[#8A8478]">Category:</label>
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-white border border-[#E3DDCE] rounded px-3 py-1.5 text-xs font-sans text-[#3A2A1C] focus:outline-none">
                      {['All', 'Dining Room', 'Living Room', 'Master Suite', 'Home Office', 'Seating', 'Tables', 'Storage'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto border border-[#E3DDCE] rounded-lg">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-[#EFEAE0] border-b border-[#E3DDCE] uppercase text-[10px] font-bold tracking-widest text-[#B4863A]">
                      <tr>
                        <th className="py-3.5 px-4">Item</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Material</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3DDCE]">
                      {filteredProducts.length === 0 ? (
                        <tr><td colSpan="6" className="py-8 text-center text-[#8A8478]">No products yet. Click Add Product to create one.</td></tr>
                      ) : filteredProducts.map((prod) => (
                        <tr key={prod._id} className="hover:bg-[#F7F3E9]/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {prod.images?.[0]
                                ? <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 rounded object-cover border border-[#E3DDCE]" />
                                : <div className="w-12 h-12 rounded bg-[#EFEAE0] border border-[#E3DDCE] flex items-center justify-center"><ImageIcon className="w-5 h-5 text-[#B4863A] opacity-40" /></div>
                              }
                              <div>
                                <div className="font-serif font-bold text-sm text-[#3A2A1C]">{prod.title}</div>
                                {prod.badge && <span className="text-[9px] bg-[#B4863A]/10 text-[#B4863A] px-1.5 py-0.5 rounded font-bold uppercase">{prod.badge}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#4A5A78] font-medium">{prod.category}</td>
                          <td className="py-3.5 px-4 text-[#4A5A78]">{prod.material}</td>
                          <td className="py-3.5 px-4 font-bold text-[#3A2A1C]">{prod.priceFormatted || `₹${Number(prod.basePrice).toLocaleString('en-IN')}`}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${prod.stockStatus === 'In Stock' ? 'bg-[#5B7A4F]/15 text-[#5B7A4F]' : prod.stockStatus === 'Low Stock' ? 'bg-[#C07A2E]/15 text-[#C07A2E]' : 'bg-[#8A8478]/15 text-[#8A8478]'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${prod.stockStatus === 'In Stock' ? 'bg-[#5B7A4F]' : prod.stockStatus === 'Low Stock' ? 'bg-[#C07A2E]' : 'bg-[#8A8478]'}`} />
                              {prod.stockStatus || 'In Stock'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleOpenEditProduct(prod)} className="p-1.5 rounded text-[#B4863A] hover:bg-[#EFEAE0] transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteProduct(prod._id)} className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 2: WORK COMMISSIONS
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'work' && (
              <div className="bg-white border border-[#E3DDCE] rounded-lg p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#3A2A1C]">Work Commissions</h2>
                    <p className="font-sans text-xs text-[#8A8478]">Manage portfolio case studies, multi-photo galleries, and custom furniture pieces.</p>
                  </div>
                  <button onClick={handleOpenCreateWork} className="bg-[#2C2015] hover:bg-[#3A2A1C] text-white text-xs font-bold uppercase px-4 py-2.5 rounded flex items-center gap-2 transition-all">
                    <Plus className="w-4 h-4 text-[#C9A45C]" /><span>Add Project</span>
                  </button>
                </div>

                {workProjects.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <Layers className="w-10 h-10 text-[#B4863A] mx-auto opacity-40" />
                    <p className="font-sans text-sm text-[#8A8478]">No work projects yet. Add your first commission above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {workProjects.map((w) => (
                      <div key={w._id} className="border border-[#E3DDCE] rounded-lg p-4 bg-[#F7F3E9]/40 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-serif font-bold text-lg text-[#3A2A1C]">{w.title}</h3>
                            {w.clientLocation && (
                              <p className="text-xs text-[#B4863A] font-sans flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {w.clientLocation}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleOpenEditWork(w)} className="p-1.5 rounded text-[#B4863A] hover:bg-[#EFEAE0] transition-colors" title="Edit">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteWorkProject(w._id)} className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                          <div>
                            <span className="text-[10px] font-bold text-[#8A8478] block mb-1">BEFORE</span>
                            <img src={w.beforeImage} alt="Before" className="w-full h-28 object-cover rounded border border-[#E3DDCE]" onError={(e) => { e.target.style.display = 'none'; }} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#5B7A4F] block mb-1">AFTER</span>
                            <img src={w.afterImage} alt="After" className="w-full h-28 object-cover rounded border border-[#E3DDCE]" onError={(e) => { e.target.style.display = 'none'; }} />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-xs text-[#8A8478] pt-1 border-t border-[#E3DDCE]/60">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#B4863A]">{w.roomType}</span>
                            <span>·</span>
                            <span>{w.completedYear}</span>
                            {w.sqft && <span>· {w.sqft}</span>}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#3A2A1C]">
                            <span className="bg-white border border-[#E3DDCE] px-2 py-0.5 rounded">
                              📷 {(w.gallery || []).length} Gallery Photos
                            </span>
                            <span className="bg-[#B4863A]/10 text-[#B4863A] px-2 py-0.5 rounded">
                              🛋️ {(w.customFurnitureItems || []).length} Furniture Pieces
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-[#4A5A78] line-clamp-2">{w.description || w.scope}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 3: JOURNEY TIMELINE
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'timeline' && (
              <div className="bg-white border border-[#E3DDCE] rounded-lg p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#3A2A1C]">Brand Journey Timeline</h2>
                    <p className="font-sans text-xs text-[#8A8478]">Milestones shown on the public Journey page. Images stored in Cloudinary.</p>
                  </div>
                  <button onClick={() => { setTimelineForm(blankTimelineForm); setTimelineFormError(''); setIsTimelineModalOpen(true); }} className="bg-[#2C2015] text-white text-xs font-bold uppercase px-4 py-2.5 rounded flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#C9A45C]" /><span>Add Milestone</span>
                  </button>
                </div>

                {timelineEvents.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <Clock className="w-10 h-10 text-[#B4863A] mx-auto opacity-40" />
                    <p className="font-sans text-sm text-[#8A8478]">No timeline events yet. Add your first milestone above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {timelineEvents.map((ev) => (
                      <div key={ev._id} className="p-4 border border-[#E3DDCE] rounded-lg flex items-center gap-5">
                        {ev.imageUrl && (
                          <img src={ev.imageUrl} alt={ev.title} className="w-20 h-16 object-cover rounded border border-[#E3DDCE] flex-shrink-0" onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="font-serif text-2xl font-bold text-[#B4863A]">{ev.year}</span>
                            {ev.isArchival && <span className="text-[10px] bg-[#2C2015] text-[#C9A45C] px-2 py-0.5 rounded uppercase font-bold">Archival</span>}
                          </div>
                          <h4 className="font-serif font-bold text-[#3A2A1C]">{ev.title}</h4>
                          <p className="text-xs text-[#4A5A78] truncate">{ev.description}</p>
                          {ev.location && (
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-[#8A8478]">
                              <MapPin className="w-3 h-3 text-[#B4863A]" />{ev.location}
                            </div>
                          )}
                        </div>
                        <button onClick={() => handleDeleteTimelineEvent(ev._id)} className="text-red-600 hover:text-red-800 p-2 flex-shrink-0" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                TAB 4: INQUIRIES
            ══════════════════════════════════════════════════════════════ */}
            {activeTab === 'inquiries' && (
              <div className="bg-white border border-[#E3DDCE] rounded-lg p-6 shadow-sm space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#3A2A1C]">Customer Inquiries Log</h2>
                {inquiries.length === 0 ? (
                  <p className="text-xs text-[#8A8478] py-8 text-center">No customer inquiries recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq, idx) => (
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
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: CREATE / EDIT PRODUCT
      ══════════════════════════════════════════════════════════════════════ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F7F3E9] w-full max-w-2xl rounded-xl border border-[#E3DDCE] shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E3DDCE] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#3A2A1C]">{editingProduct ? 'Edit Furniture Item' : 'Create New Product'}</h3>
              <button onClick={() => { setIsProductModalOpen(false); setProductFormError(''); }}><X className="w-5 h-5 text-[#3A2A1C]" /></button>
            </div>

            {productFormError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700">⚠ {productFormError}</div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Product Title *</label>
                <input required type="text" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Category *</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]">
                    {['Dining Room', 'Living Room', 'Master Suite', 'Home Office', 'Seating', 'Tables', 'Storage'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Base Price (₹) *</label>
                  <input required type="number" value={productForm.basePrice} onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })} className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Primary Material *</label>
                  <input required type="text" value={productForm.material} onChange={(e) => setProductForm({ ...productForm, material: e.target.value })} className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Stock Status</label>
                  <select value={productForm.stockStatus} onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value })} className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]">
                    <option>In Stock</option><option>Low Stock</option><option>Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Dimensions</label>
                  <input type="text" value={productForm.dimensions} onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })} className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Finish Treatment</label>
                  <input type="text" value={productForm.finish} onChange={(e) => setProductForm({ ...productForm, finish: e.target.value })} className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Warranty</label>
                  <input type="text" value={productForm.warranty} onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })} className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Badge</label>
                  <select value={productForm.badge} onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })} className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]">
                    <option value="">None</option><option value="NEW">NEW</option><option value="BESTSELLER">BESTSELLER</option><option value="CUSTOM ORDER">CUSTOM ORDER</option>
                  </select>
                </div>
              </div>

              {/* Product Images with Cloudinary upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-semibold text-[#3A2A1C]">Product Images (Cloudinary) *</label>
                  <button type="button" onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''], imagePublicIds: [...productForm.imagePublicIds, null] })} className="text-xs text-[#B4863A] font-bold hover:text-[#3A2A1C]">
                    + Add Slot
                  </button>
                </div>
                <div className="space-y-3">
                  {productForm.images.length === 0 && (
                    <p className="text-[10px] text-[#8A8478] italic">Click "+ Add Slot" then upload an image from Cloudinary.</p>
                  )}
                  {productForm.images.map((imgUrl, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={imgUrl || ''}
                          onChange={(e) => {
                            const n = [...productForm.images];
                            n[idx] = e.target.value;
                            setProductForm({ ...productForm, images: n });
                          }}
                          className="flex-1 bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]"
                          placeholder="Paste URL or upload →"
                        />
                        <label className="bg-[#3A2A1C] hover:bg-[#B4863A] text-white px-3 py-2 rounded cursor-pointer text-xs font-semibold flex items-center gap-1 transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#C9A45C]" />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleProductImageUpload(e, idx)} />
                        </label>
                        <button type="button" onClick={() => {
                          const ni = [...productForm.images]; ni.splice(idx, 1);
                          const np = [...productForm.imagePublicIds]; np.splice(idx, 1);
                          setProductForm({ ...productForm, images: ni, imagePublicIds: np });
                        }} className="p-2 text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                      </div>
                      {imgUrl && (
                        <img src={imgUrl} alt={`preview-${idx}`} className="h-16 rounded border border-[#E3DDCE] object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Description</label>
                <textarea rows={3} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full bg-white border border-[#E3DDCE] rounded p-2.5 text-xs text-[#3A2A1C]" />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E3DDCE]">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 border border-[#E3DDCE] rounded text-xs font-semibold">Cancel</button>
                <button type="submit" disabled={actionLoading} className="bg-[#2C2015] disabled:opacity-60 text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider">
                  {actionLoading ? 'Saving…' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: CREATE / EDIT WORK PROJECT
      ══════════════════════════════════════════════════════════════════════ */}
      {isWorkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F7F3E9] w-full max-w-2xl rounded-xl border border-[#E3DDCE] shadow-2xl p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-[#E3DDCE]">
              <h3 className="font-serif text-xl font-bold text-[#3A2A1C]">
                {editingWorkProject ? 'Edit Work Commission' : 'Add Work Commission'}
              </h3>
              <button onClick={() => setIsWorkModalOpen(false)}><X className="w-5 h-5 text-[#3A2A1C]" /></button>
            </div>

            {workFormError && <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700">⚠ {workFormError}</div>}

            <form onSubmit={handleSaveWorkProject} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Project Title *</label>
                <input required value={workForm.title} onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" placeholder="e.g. The Penthouse Living Pavilion" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Client / Location Tag</label>
                  <input value={workForm.clientLocation} onChange={(e) => setWorkForm({ ...workForm, clientLocation: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" placeholder="e.g. The Minimalist Villa — Zurich" />
                </div>
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Square Footage / Scale</label>
                  <input value={workForm.sqft} onChange={(e) => setWorkForm({ ...workForm, sqft: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" placeholder="e.g. 4,200 sq. ft." />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Room Type *</label>
                  <select value={workForm.roomType} onChange={(e) => setWorkForm({ ...workForm, roomType: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]">
                    {['Living Room', 'Dining Room', 'Home Office', 'Master Suite', 'Outdoor & Pavilion'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Completed Year *</label>
                  <input type="number" value={workForm.completedYear} onChange={(e) => setWorkForm({ ...workForm, completedYear: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Dimensions / Scale</label>
                  <input value={workForm.dimensions} onChange={(e) => setWorkForm({ ...workForm, dimensions: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" placeholder="e.g. 4,200 sq. ft. Residence" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Scope of Work *</label>
                <input required value={workForm.scope} onChange={(e) => setWorkForm({ ...workForm, scope: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" placeholder="e.g. Interior Architecture & Custom Paneling" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ImageUploadField
                  label="Before Image *"
                  required
                  url={workForm.beforeImage}
                  onUrlChange={(url) => setWorkForm({ ...workForm, beforeImage: url })}
                  onUpload={(url, pid) => setWorkForm({ ...workForm, beforeImage: url, beforeImagePublicId: pid })}
                />
                <ImageUploadField
                  label="After Image (Hero) *"
                  required
                  url={workForm.afterImage}
                  onUrlChange={(url) => setWorkForm({ ...workForm, afterImage: url })}
                  onUpload={(url, pid) => setWorkForm({ ...workForm, afterImage: url, afterImagePublicId: pid })}
                />
              </div>

              {/* MULTI-PHOTO GALLERY SECTION */}
              <div className="p-3 bg-white border border-[#E3DDCE] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-[#3A2A1C]">Visual Gallery Showcase Photos (Close-ups, Materials, Lighting)</label>
                    <span className="text-[10px] text-[#8A8478]">Displayed in the interactive horizontal-scroll case study gallery.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWorkForm({ ...workForm, gallery: [...workForm.gallery, ''] })}
                    className="text-xs text-[#B4863A] font-bold hover:text-[#3A2A1C]"
                  >
                    + Add Gallery Image Slot
                  </button>
                </div>
                <div className="space-y-3">
                  {workForm.gallery.length === 0 && (
                    <p className="text-[10px] text-[#8A8478] italic">No extra gallery photos added yet. Click "+ Add Gallery Image Slot" to upload close-ups.</p>
                  )}
                  {workForm.gallery.map((gUrl, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <ImageUploadField
                          label={`Gallery Photo #${idx + 1}`}
                          url={gUrl}
                          onUrlChange={(url) => {
                            const ng = [...workForm.gallery];
                            ng[idx] = url;
                            setWorkForm({ ...workForm, gallery: ng });
                          }}
                          onUpload={(url) => {
                            const ng = [...workForm.gallery];
                            ng[idx] = url;
                            setWorkForm({ ...workForm, gallery: ng });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const ng = [...workForm.gallery];
                          ng.splice(idx, 1);
                          setWorkForm({ ...workForm, gallery: ng });
                        }}
                        className="p-2 text-red-500 hover:text-red-700 mt-5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CUSTOM FURNITURE ITEMS SECTION */}
              <div className="p-3 bg-white border border-[#E3DDCE] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-[#3A2A1C]">Custom Furniture Crafted For This Space</label>
                    <span className="text-[10px] text-[#8A8478]">Direct links to bespoke furniture items showcased in the case study modal.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWorkForm({
                      ...workForm,
                      customFurnitureItems: [
                        ...workForm.customFurnitureItems,
                        { title: '', category: 'Seating', material: '', image: '' }
                      ]
                    })}
                    className="text-xs text-[#B4863A] font-bold hover:text-[#3A2A1C]"
                  >
                    + Add Furniture Item
                  </button>
                </div>
                <div className="space-y-4">
                  {workForm.customFurnitureItems.length === 0 && (
                    <p className="text-[10px] text-[#8A8478] italic">No custom furniture items added yet. Click "+ Add Furniture Item" to attach bespoke pieces.</p>
                  )}
                  {workForm.customFurnitureItems.map((item, idx) => (
                    <div key={idx} className="p-3 border border-[#E3DDCE] rounded bg-[#F7F3E9]/50 space-y-2 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const ni = [...workForm.customFurnitureItems];
                          ni.splice(idx, 1);
                          setWorkForm({ ...workForm, customFurnitureItems: ni });
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block font-semibold text-[#3A2A1C] text-[10px] mb-1">Item Title</label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => {
                              const ni = [...workForm.customFurnitureItems];
                              ni[idx] = { ...ni[idx], title: e.target.value };
                              setWorkForm({ ...workForm, customFurnitureItems: ni });
                            }}
                            className="w-full p-2 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]"
                            placeholder="e.g. Kobe Ergonomic Armchair"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#3A2A1C] text-[10px] mb-1">Category</label>
                          <input
                            type="text"
                            value={item.category || ''}
                            onChange={(e) => {
                              const ni = [...workForm.customFurnitureItems];
                              ni[idx] = { ...ni[idx], category: e.target.value };
                              setWorkForm({ ...workForm, customFurnitureItems: ni });
                            }}
                            className="w-full p-2 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]"
                            placeholder="e.g. Seating"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#3A2A1C] text-[10px] mb-1">Material</label>
                          <input
                            type="text"
                            value={item.material || ''}
                            onChange={(e) => {
                              const ni = [...workForm.customFurnitureItems];
                              ni[idx] = { ...ni[idx], material: e.target.value };
                              setWorkForm({ ...workForm, customFurnitureItems: ni });
                            }}
                            className="w-full p-2 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]"
                            placeholder="e.g. Walnut & Bouclé"
                          />
                        </div>
                      </div>
                      <ImageUploadField
                        label="Furniture Item Photo"
                        url={item.image || ''}
                        onUrlChange={(url) => {
                          const ni = [...workForm.customFurnitureItems];
                          ni[idx] = { ...ni[idx], image: url };
                          setWorkForm({ ...workForm, customFurnitureItems: ni });
                        }}
                        onUpload={(url) => {
                          const ni = [...workForm.customFurnitureItems];
                          ni[idx] = { ...ni[idx], image: url };
                          setWorkForm({ ...workForm, customFurnitureItems: ni });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Materials Used (comma-separated)</label>
                <input value={workForm.materialsUsed} onChange={(e) => setWorkForm({ ...workForm, materialsUsed: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" placeholder="Smoked Oak, Brushed Brass, Italian Travertine" />
              </div>

              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Architectural Narrative / Description</label>
                <textarea rows={4} value={workForm.description} onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" placeholder="Detailing vision, handcrafted joinery techniques, and interior design story..." />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E3DDCE]">
                <button type="button" onClick={() => setIsWorkModalOpen(false)} className="px-4 py-2 border border-[#E3DDCE] rounded text-xs font-semibold">Cancel</button>
                <button type="submit" disabled={actionLoading} className="bg-[#2C2015] disabled:opacity-60 text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider">
                  {actionLoading ? 'Saving…' : (editingWorkProject ? 'Update Work Entry' : 'Save Work Entry')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: CREATE TIMELINE EVENT
      ══════════════════════════════════════════════════════════════════════ */}
      {isTimelineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F7F3E9] w-full max-w-lg rounded-xl border border-[#E3DDCE] p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-2 border-[#E3DDCE]">
              <h3 className="font-serif text-lg font-bold text-[#3A2A1C]">Add Timeline Milestone</h3>
              <button onClick={() => setIsTimelineModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            {timelineFormError && <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700">⚠ {timelineFormError}</div>}

            <form onSubmit={handleSaveTimelineEvent} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Year *</label>
                  <input required type="number" min="1900" max="2100" value={timelineForm.year} onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#3A2A1C] mb-1">Location</label>
                  <input value={timelineForm.location} onChange={(e) => setTimelineForm({ ...timelineForm, location: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" placeholder="Jodhpur Atelier" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Milestone Title *</label>
                <input required value={timelineForm.title} onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" />
              </div>

              <div>
                <label className="block font-semibold text-[#3A2A1C] mb-1">Description *</label>
                <textarea required rows={3} value={timelineForm.description} onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })} className="w-full p-2.5 border border-[#E3DDCE] rounded bg-white text-[#3A2A1C]" />
              </div>

              <ImageUploadField
                label="Milestone Image"
                required
                url={timelineForm.imageUrl}
                onUrlChange={(url) => setTimelineForm({ ...timelineForm, imageUrl: url })}
                onUpload={(url, pid) => setTimelineForm({ ...timelineForm, imageUrl: url, imagePublicId: pid })}
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isArchival"
                  checked={timelineForm.isArchival}
                  onChange={(e) => setTimelineForm({ ...timelineForm, isArchival: e.target.checked })}
                  className="accent-[#B4863A] w-4 h-4"
                />
                <label htmlFor="isArchival" className="font-semibold text-[#3A2A1C] cursor-pointer">
                  Mark as Historical Archival Photo
                </label>
              </div>

              <button type="submit" disabled={actionLoading} className="w-full bg-[#2C2015] disabled:opacity-60 text-white py-2.5 rounded font-bold uppercase text-xs tracking-wider">
                {actionLoading ? 'Saving…' : 'Save Milestone'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
