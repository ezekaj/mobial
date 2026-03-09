/**
 * Products API Routes
 * GET /api/products - List all active products with filtering and pagination
 */

import { NextRequest } from 'next/server';
import { fetchProducts as fetchMobiMatterProducts } from '@/lib/mobimatter';
import { successResponse, errorResponse } from '@/lib/auth-helpers';

/**
 * GET /api/products
 * List all active products with filtering and pagination
 * Fetches directly from MobiMatter API
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const country = searchParams.get('country') || undefined;
    const provider = searchParams.get('provider') || undefined;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || undefined;
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Parse numeric values
    const limit = Math.min(Math.max(parseInt(limitParam || '20') || 20, 1), 100);
    const offset = Math.max(parseInt(offsetParam || '0') || 0, 0);
    const minPriceNum = minPrice ? parseFloat(minPrice) : undefined;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined;

    // Fetch products from MobiMatter API
    const allProducts = await fetchMobiMatterProducts({
      country: country || undefined,
      provider: provider || undefined,
    });
    
    // Filter products
    let filteredProducts = allProducts.filter(p => {
      if (minPriceNum && p.price < minPriceNum) return false;
      if (maxPriceNum && p.price > maxPriceNum) return false;
      return true;
    });
    
    // Sort products
    if (sortBy === 'price_asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name' && a.name && b.name) {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: sortBy price (lowest first)
      filteredProducts.sort((a, b) => a.price - b.price);
    }
    
    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);
    
    return successResponse({
      products: paginatedProducts,
      pagination: {
        total: filteredProducts.length,
        limit,
        offset,
        hasMore: offset + limit < filteredProducts.length,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return errorResponse('Failed to fetch products', 500);
  }
}
