'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/marketplace/Navbar';
import Footer from '@/components/marketplace/Footer';
import productService, { CreateProductInput } from '@/services/product.service';
import { Upload, X, Check, AlertCircle, ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    long_description: '',
    type: 'workflow',
    tags: [],
    is_free: true,
    price: undefined as number | undefined,
    version: '',
    requirements: [] as string[],
    features: [] as string[],
    install_guide: '',
    workflow_file_url: '',
    thumbnail_url: '',
    preview_image_url: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  // Redirect if not logged in or not approved seller
  useEffect(() => {
    if (!user) {
      router.push('/login?returnTo=/seller/upload');
      return;
    }
    // Check if user is approved seller
    if (user.role !== 'seller' && user.seller_status !== 'approved') {
      if (user.seller_status === 'pending') {
        toast.error('Đơn đăng ký seller của bạn đang chờ duyệt. Vui lòng đợi admin phê duyệt.');
        router.push('/seller/apply');
      } else if (user.seller_status === 'rejected') {
        toast.error('Đơn đăng ký seller của bạn đã bị từ chối. Vui lòng kiểm tra và gửi lại đơn.');
        router.push('/seller/apply');
      } else {
        toast.error('Bạn cần đăng ký làm seller trước khi tạo sản phẩm.');
        router.push('/seller/apply');
      }
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convert price to number if it's a number input
    let processedValue: any = value;
    if (name === 'price' && type === 'number') {
      processedValue = value === '' ? undefined : parseFloat(value);
      if (isNaN(processedValue)) {
        processedValue = undefined;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time URL validation
    if (name === 'workflow_file_url' || name === 'thumbnail_url' || name === 'preview_image_url') {
      if (value.trim()) {
        const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
        if (!urlPattern.test(value.trim())) {
          setErrors(prev => ({ ...prev, [name]: 'URL không hợp lệ. Phải là URL đầy đủ bắt đầu với http:// hoặc https://' }));
        } else {
          setErrors(prev => ({ ...prev, [name]: '' }));
        }
      } else {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const addTag = () => {
    if (tagInput.trim() && formData.tags!.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags!.filter((_, i) => i !== index),
    }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), requirementInput.trim()],
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements!.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features!.filter((_, i) => i !== index),
    }));
  };

  // Check what fields are missing for publishing
  const getMissingFields = (): string[] => {
    const missing: string[] = [];
    
    if (!formData.title.trim() || formData.title.length < 3) {
      missing.push('Tiêu đề');
    }
    
    if (!formData.description.trim() || formData.description.length < 10) {
      missing.push('Mô tả ngắn');
    }
    
    if (formData.type === 'workflow' && !formData.workflow_file_url?.trim()) {
      missing.push('Workflow File URL');
    }
    
    if (!formData.thumbnail_url?.trim()) {
      missing.push('Thumbnail URL');
    }
    
    if (!formData.is_free && (!formData.price || formData.price <= 0)) {
      missing.push('Giá (cho sản phẩm trả phí)');
    }
    
    return missing;
  };

  const validate = (strict: boolean = false): boolean => {
    const newErrors: Record<string, string> = {};

    // Only validate required fields if strict mode (for publishing)
    if (strict) {
      if (!formData.title.trim()) {
        newErrors.title = 'Tiêu đề là bắt buộc';
      } else if (formData.title.length < 3) {
        newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Mô tả là bắt buộc';
      } else if (formData.description.length < 10) {
        newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
      }

      if (!formData.is_free && (!formData.price || formData.price <= 0)) {
        newErrors.price = 'Giá phải lớn hơn 0 cho sản phẩm trả phí';
      }
    }

    // Always validate URL format if provided
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    
    if (formData.workflow_file_url && formData.workflow_file_url.trim()) {
      if (!urlPattern.test(formData.workflow_file_url.trim())) {
        newErrors.workflow_file_url = 'URL không hợp lệ. Phải là URL đầy đủ bắt đầu với http:// hoặc https://';
      }
    }

    if (formData.thumbnail_url && formData.thumbnail_url.trim()) {
      if (!urlPattern.test(formData.thumbnail_url.trim())) {
        newErrors.thumbnail_url = 'URL không hợp lệ. Phải là URL đầy đủ bắt đầu với http:// hoặc https://';
      }
    }

    if (formData.preview_image_url && formData.preview_image_url.trim()) {
      if (!urlPattern.test(formData.preview_image_url.trim())) {
        newErrors.preview_image_url = 'URL không hợp lệ. Phải là URL đầy đủ bắt đầu với http:// hoặc https://';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL format only (not required fields for draft)
    if (!validate(false)) {
      toast.error('Vui lòng kiểm tra lại định dạng URL');
      return;
    }

    setLoading(true);
    try {
      // Prepare data with proper types
      // Convert empty strings to undefined for optional URL fields
      // Map form (snake_case) -> DTO camelCase expected bởi shared types
      const submitData: CreateProductInput = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.long_description?.trim() || undefined,
        type: formData.type as any,
        tags: formData.tags || [],
        isFree: formData.is_free,
        price: formData.price ? parseFloat(formData.price.toString()) : undefined,
        version: formData.version?.trim() || undefined,
        requirements: formData.requirements || [],
        features: formData.features || [],
        installGuide: formData.install_guide?.trim() || undefined,
        workflowFileUrl: formData.workflow_file_url?.trim() || undefined,
        thumbnailUrl: formData.thumbnail_url?.trim() || undefined,
        previewImageUrl: formData.preview_image_url?.trim() || undefined,
        // currency / priceType / metadata không hiển thị nên bỏ trống
      };

      const product = await productService.createProduct(submitData);
      
      // Check missing fields and show notification
      const missingFields = getMissingFields();
      if (missingFields.length > 0) {
        toast.success(
          `Đã lưu draft thành công! Còn thiếu: ${missingFields.join(', ')}. Bạn có thể chỉnh sửa sau để publish.`,
          { duration: 6000 }
        );
      } else {
        toast.success('Tạo sản phẩm thành công!');
      }
      
      router.push(`/seller/dashboard`);
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const newErrors: Record<string, string> = {};
        const errorMessages: string[] = [];
        
        backendErrors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0];
            const fieldLabel: Record<string, string> = {
              title: 'Tiêu đề',
              description: 'Mô tả',
              workflow_file_url: 'Workflow File URL',
              thumbnail_url: 'Thumbnail URL',
              preview_image_url: 'Preview Image URL',
              price: 'Giá',
              type: 'Loại sản phẩm',
            };
            
            const label = fieldLabel[fieldName] || fieldName;
            const message = err.message || 'Giá trị không hợp lệ';
            newErrors[fieldName] = message;
            errorMessages.push(`${label}: ${message}`);
          }
        });
        
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          
          // Show detailed error message
          const errorText = errorMessages.length > 0 
            ? `Lỗi validation:\n${errorMessages.join('\n')}`
            : 'Vui lòng kiểm tra lại các trường đã đánh dấu';
          
          toast.error(errorText, { duration: 6000 });
          
          // Scroll to first error
          const firstErrorField = Object.keys(newErrors)[0];
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (element as HTMLElement).focus();
          }
        } else {
          const message = error.response?.data?.message || error.message || 'Tạo sản phẩm thất bại';
          toast.error(message);
        }
      } else {
        const message = error.response?.data?.message || error.message || 'Tạo sản phẩm thất bại';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0C10] text-gray-900 dark:text-slate-200 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại dashboard
        </Link>

        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tải lên sản phẩm mới</h1>
            <p className="text-gray-600 dark:text-slate-400">Tạo workflow, tool hoặc integration pack mới cho marketplace</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <section className="bg-gray-50 dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Thông tin cơ bản</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Tiêu đề <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.title ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                    placeholder="Ví dụ: Workflow tóm tắt đa nguồn"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Loại sản phẩm <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="workflow">Workflow</option>
                    <option value="tool">Tool</option>
                    <option value="integration">Integration Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Mô tả ngắn <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full rounded-lg border ${
                      errors.description ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none`}
                    placeholder="Mô tả ngắn gọn về sản phẩm (tối thiểu 10 ký tự)"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    name="long_description"
                    value={formData.long_description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Mô tả chi tiết về sản phẩm, cách hoạt động, use cases..."
                  />
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="bg-gray-50 dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Giá</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_free"
                    checked={formData.is_free}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900/40 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <label className="text-gray-700 dark:text-slate-200">Sản phẩm miễn phí</label>
                </div>

                {!formData.is_free && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                      Giá (VNĐ) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                    className={`w-full rounded-lg border ${
                      errors.price ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      placeholder="0"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.price}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Files & Media */}
            <section className="bg-gray-50 dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Files & Media</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Workflow File URL
                  </label>
                  <input
                    type="url"
                    name="workflow_file_url"
                    value={formData.workflow_file_url}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.workflow_file_url ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                    placeholder="https://example.com/workflow.json"
                  />
                  {errors.workflow_file_url && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.workflow_file_url}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">URL đến file workflow JSON hoặc package</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    name="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.thumbnail_url ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                    placeholder="https://example.com/thumbnail.png"
                  />
                  {errors.thumbnail_url && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.thumbnail_url}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">URL đến ảnh thumbnail (bắt buộc khi publish)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Preview Image/Video URL
                  </label>
                  <input
                    type="url"
                    name="preview_image_url"
                    value={formData.preview_image_url}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.preview_image_url ? 'border-red-500' : 'border-gray-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                    placeholder="https://example.com/preview.png"
                  />
                  {errors.preview_image_url && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.preview_image_url}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Tags */}
            <section className="bg-gray-50 dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Thêm tag (Enter để thêm)"
                  disabled={formData.tags!.length >= 10}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={formData.tags!.length >= 10}
                  className="px-4 py-2 bg-primary hover:bg-[#FF8559] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thêm
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags!.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-slate-800 rounded-lg text-sm text-gray-700 dark:text-slate-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-slate-500">Tối đa 10 tags ({formData.tags!.length}/10)</p>
            </section>

            {/* Requirements */}
            <section className="bg-gray-50 dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Yêu cầu tích hợp</h2>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  className="flex-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Ví dụ: n8n 1.0+, OpenAI API key"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-2 bg-primary hover:bg-[#FF8559] text-white rounded-lg transition-colors"
                >
                  Thêm
                </button>
              </div>
              
              <ul className="space-y-2">
                {formData.requirements!.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200">
                    <Check className="h-4 w-4 text-primary" />
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-auto text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Features */}
            <section className="bg-gray-50 dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tính năng chính</h2>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Ví dụ: GPT-4 Integration, Auto-posting"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-primary hover:bg-[#FF8559] text-white rounded-lg transition-colors"
                >
                  Thêm
                </button>
              </div>
              
              <ul className="space-y-2">
                {formData.features!.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-auto text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Install Guide */}
            <section className="bg-gray-50 dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hướng dẫn cài đặt</h2>
              
              <textarea
                name="install_guide"
                value={formData.install_guide}
                onChange={handleChange}
                rows={6}
                className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Hướng dẫn từng bước để cài đặt workflow/tool..."
              />
            </section>

            {/* Version */}
            <section className="bg-gray-50 dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Thông tin phiên bản</h2>
              
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Ví dụ: 1.0.0"
              />
            </section>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-[#FF8559] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Đang tạo...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Tạo sản phẩm (Draft)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

