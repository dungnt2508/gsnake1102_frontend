'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/marketplace/Navbar';
import Footer from '@/components/marketplace/Footer';
import productService, { UpdateProductInput } from '@/services/product.service';
import { ProductType } from '@gsnake/shared-types';
import { Upload, X, Check, AlertCircle, ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import WorkflowUploadSection from '@/components/product/WorkflowUploadSection';

type FormState = {
  title: string;
  description: string;
  long_description: string;
  type: ProductType;
  tags: string[];
  is_free: boolean;
  price?: number;
  version: string;
  requirements: string[];
  features: string[];
  install_guide: string;
  workflow_file_url: string;
  thumbnail_url: string;
  preview_image_url: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const productId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormState>({
    title: '',
    description: '',
    long_description: '',
    type: ProductType.WORKFLOW,
    tags: [],
    is_free: true,
    price: undefined,
    version: '',
    requirements: [],
    features: [],
    install_guide: '',
    workflow_file_url: '',
    thumbnail_url: '',
    preview_image_url: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push(`/login?returnTo=/seller/edit/${productId}`);
    }
  }, [user, router, productId]);

  // Load product data
  useEffect(() => {
    if (user && productId) {
      loadProduct();
    }
  }, [user, productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      // Use getMyProduct to access seller's own products (including drafts)
      const product = await productService.getMyProduct(productId);
      
      // API trả về camelCase (workflowFileUrl, thumbnailUrl, previewImageUrl)
      setFormData({
        title: product.title,
        description: product.description,
        long_description: (product as any).long_description ?? product.longDescription ?? '',
        type: product.type as ProductType,
        tags: product.tags || [],
        is_free: (product as any).is_free ?? product.isFree,
        price: product.price,
        version: (product as any).version ?? product.version ?? '',
        requirements: (product as any).requirements ?? product.requirements ?? [],
        features: (product as any).features ?? product.features ?? [],
        install_guide: (product as any).install_guide ?? product.installGuide ?? '',
        workflow_file_url: (product as any).workflow_file_url ?? product.workflowFileUrl ?? '',
        thumbnail_url: (product as any).thumbnail_url ?? product.thumbnailUrl ?? '',
        preview_image_url: (product as any).preview_image_url ?? product.previewImageUrl ?? '',
      });
    } catch (error: any) {
      toast.error('Không thể tải thông tin sản phẩm');
      router.push('/seller/dashboard');
    } finally {
      setLoading(false);
    }
  };

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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
    
    if (!formData.title?.trim() || (formData.title && formData.title.length < 3)) {
      missing.push('title');
    }
    
    if (!formData.description?.trim() || (formData.description && formData.description.length < 10)) {
      missing.push('description');
    }
    
    if (formData.type === 'workflow' && !formData.workflow_file_url?.trim()) {
      missing.push('workflow_file_url');
    }
    
    if (!formData.thumbnail_url?.trim()) {
      missing.push('thumbnail_url');
    }
    
    if (!formData.is_free && (!formData.price || formData.price <= 0)) {
      missing.push('price');
    }
    
    return missing;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.title && formData.title.length < 3) {
      newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
    }

    if (formData.description && formData.description.length < 10) {
      newErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    }

    if (formData.is_free === false && (!formData.price || formData.price <= 0)) {
      newErrors.price = 'Giá phải lớn hơn 0 cho sản phẩm trả phí';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const missingFields = getMissingFields();
  const isFieldMissing = (fieldName: string) => missingFields.includes(fieldName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setSaving(true);
    try {
      // Prepare data with proper types
      const submitData: UpdateProductInput = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.long_description?.trim() || undefined,
        type: formData.type,
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
      };

      await productService.updateProduct(productId, submitData);
      toast.success('Cập nhật sản phẩm thành công!');
      router.push('/seller/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Cập nhật sản phẩm thất bại';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0C10] text-gray-900 dark:text-slate-200 font-sans">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-slate-400">Đang tải...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chỉnh sửa sản phẩm</h1>
            <p className="text-gray-600 dark:text-slate-400">Cập nhật thông tin sản phẩm của bạn</p>
            {missingFields.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                  ⚠️ Các trường còn thiếu để có thể publish:
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  {missingFields.map(field => {
                    const labels: Record<string, string> = {
                      title: 'Tiêu đề',
                      description: 'Mô tả ngắn',
                      workflow_file_url: 'Workflow File URL',
                      thumbnail_url: 'Thumbnail URL',
                      price: 'Giá',
                    };
                    return <li key={field}>{labels[field] || field}</li>;
                  })}
                </ul>
              </div>
            )}
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
                      errors.title || isFieldMissing('title') 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-200 dark:border-slate-700'
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
                      errors.description || isFieldMissing('description')
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-200 dark:border-slate-700'
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
                  <label className="text-gray-900 dark:text-slate-200">Sản phẩm miễn phí</label>
                </div>

                {!formData.is_free && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                      Giá (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      className={`w-full rounded-lg border ${
                        errors.price || isFieldMissing('price')
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-200 dark:border-slate-700'
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

            {/* Workflow-specific upload section */}
            {formData.type === 'workflow' && (
              <section className="bg-gray-50 dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Workflow Files & Details
                </h2>
                <WorkflowUploadSection
                  productId={productId}
                  onFilesUploaded={(files) => {
                    if (files.workflow) {
                      setFormData(prev => ({ ...prev, workflow_file_url: files.workflow! }));
                    }
                  }}
                />
              </section>
            )}

            {/* Files & Media */}
            <section className="bg-gray-50 dark:bg-[#111218] border border-gray-200 dark:border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Files & Media</h2>
              
              <div className="space-y-4">
                {formData.type !== 'workflow' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                      Workflow File URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="workflow_file_url"
                      value={formData.workflow_file_url}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        isFieldMissing('workflow_file_url')
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-200 dark:border-slate-700'
                      } bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                      placeholder="https://example.com/workflow.json"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                    Thumbnail URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      isFieldMissing('thumbnail_url')
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                    placeholder="https://example.com/thumbnail.png"
                  />
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
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="https://example.com/preview.png"
                  />
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
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-900 dark:text-slate-200">
                    <Check className="h-4 w-4 text-primary" />
                    {req}
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-auto text-slate-400 hover:text-red-400 transition-colors"
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
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-900 dark:text-slate-200">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-auto text-slate-400 hover:text-red-400 transition-colors"
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
                disabled={saving}
                className="flex-1 bg-primary hover:bg-[#FF8559] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Lưu thay đổi</span>
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

