import { apiClient } from '@/shared/api/client';
import { 
  ProductDto as Product, 
  CreateProductDto as CreateProductInput,
  UpdateProductDto as UpdateProductInput,
  ProductFilters,
  ProductsResponse
} from '@gsnake/shared-types';

// Re-export types for convenience
export type { 
  Product, 
  CreateProductInput, 
  UpdateProductInput, 
  ProductFilters, 
  ProductsResponse 
};

class ProductService {
  /**
   * Get all products with filters
   */
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);

    // apiClient.get() already unwraps response.data, so response is already the data
    const response = await apiClient.get<ProductsResponse>(`/products?${params.toString()}`);
    return response;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    // apiClient.get() already unwraps response.data, so response is already the data
    const response = await apiClient.get<{ products: Product[] }>(`/products/featured?limit=${limit}`);
    return response.products;
  }

  /**
   * Get product by ID (public - only published)
   */
  async getProduct(id: string): Promise<Product> {
    // apiClient.get() already unwraps response.data, so response is already the data
    const response = await apiClient.get<{ product: Product }>(`/products/${id}`);
    return response.product;
  }

  /**
   * Get seller's own product by ID (can access drafts)
   */
  async getMyProduct(id: string): Promise<Product> {
    // apiClient.get() already unwraps response.data, so response is already the data
    const response = await apiClient.get<{ product: Product }>(`/products/my/${id}`);
    return response.product;
  }

  /**
   * Get seller's products
   */
  async getMyProducts(includeDrafts: boolean = true): Promise<Product[]> {
    // apiClient.get() already unwraps response.data, so response is already the data
    const response = await apiClient.get<{ products: Product[] }>(`/products/my?include_drafts=${includeDrafts}`);
    return response.products;
  }

  /**
   * Create new product
   * Note: Backend expects snake_case, so we convert camelCase to snake_case
   */
  async createProduct(data: CreateProductInput): Promise<Product> {
    // Convert camelCase to snake_case for backend
    const backendData = {
      title: data.title,
      description: data.description,
      long_description: data.longDescription,
      type: data.type,
      tags: data.tags,
      workflow_file_url: data.workflowFileUrl,
      thumbnail_url: data.thumbnailUrl,
      preview_image_url: data.previewImageUrl,
      is_free: data.isFree,
      price: data.price,
      version: data.version,
      requirements: data.requirements,
      features: data.features,
      install_guide: data.installGuide,
      metadata: data.metadata,
    };
    // apiClient.post() already unwraps response.data, so response is already the data
    const response = await apiClient.post<{ product: Product }>('/products', backendData);
    return response.product;
  }

  /**
   * Update product
   * Note: Backend expects snake_case, so we convert camelCase to snake_case
   */
  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    // Convert camelCase to snake_case for backend
    const backendData: any = {};
    if (data.title !== undefined) backendData.title = data.title;
    if (data.description !== undefined) backendData.description = data.description;
    if (data.longDescription !== undefined) backendData.long_description = data.longDescription;
    if (data.type !== undefined) backendData.type = data.type;
    if (data.tags !== undefined) backendData.tags = data.tags;
    if (data.workflowFileUrl !== undefined) backendData.workflow_file_url = data.workflowFileUrl;
    if (data.thumbnailUrl !== undefined) backendData.thumbnail_url = data.thumbnailUrl;
    if (data.previewImageUrl !== undefined) backendData.preview_image_url = data.previewImageUrl;
    if (data.isFree !== undefined) backendData.is_free = data.isFree;
    if (data.price !== undefined) backendData.price = data.price;
    if (data.version !== undefined) backendData.version = data.version;
    if (data.requirements !== undefined) backendData.requirements = data.requirements;
    if (data.features !== undefined) backendData.features = data.features;
    if (data.installGuide !== undefined) backendData.install_guide = data.installGuide;
    if (data.metadata !== undefined) backendData.metadata = data.metadata;
    
    // apiClient.put() already unwraps response.data, so response is already the data
    const response = await apiClient.put<{ product: Product }>(`/products/${id}`, backendData);
    return response.product;
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  }

  /**
   * Publish product
   */
  async publishProduct(id: string): Promise<Product> {
    // apiClient.post() already unwraps response.data, so response is already the data
    const response = await apiClient.post<{ product: Product }>(`/products/${id}/publish`);
    return response.product;
  }

  /**
   * Unpublish product
   */
  async unpublishProduct(id: string): Promise<Product> {
    // apiClient.post() already unwraps response.data, so response is already the data
    const response = await apiClient.post<{ product: Product }>(`/products/${id}/unpublish`);
    return response.product;
  }

  /**
   * Record download
   */
  async recordDownload(id: string): Promise<void> {
    await apiClient.post(`/products/${id}/download`);
  }
}

export default new ProductService();

