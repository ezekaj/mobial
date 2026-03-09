#!/usr/bin/env node
/**
 * Product Sync Script
 * Syncs products from MobiMatter API to local database
 * 
 * Usage: bun run sync:products
 * 
 * Requires MOBIMATTER_MERCHANT_ID and MOBIMATTER_API_KEY in .env.local
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const MOBIMATTER_BASE_URL = 'https://api.mobimatter.com/mobimatter';

async function syncProducts() {
  console.log('🔄 Syncing products from MobiMatter...\n');
  
  // Check credentials
  const merchantId = process.env.MOBIMATTER_MERCHANT_ID;
  const apiKey = process.env.MOBIMATTER_API_KEY;
  
  if (!merchantId || !apiKey) {
    console.error('❌ Missing MobiMatter credentials!');
    console.error('\nAdd to your .env.local:');
    console.error('   MOBIMATTER_MERCHANT_ID=your-merchant-id');
    console.error('   MOBIMATTER_API_KEY=your-api-key');
    console.error('\nYou can get these from: https://mobimatter.com\n');
    process.exit(1);
  }
  
  try {
    // Fetch products from MobiMatter
    console.log('📡 Fetching products from MobiMatter API...');
    
    const response = await fetch(`${MOBIMATTER_BASE_URL}/api/v2/products`, {
      headers: {
        'merchantId': merchantId,
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`MobiMatter API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    const mobimatterProducts = data.result || [];
    
    console.log(`✅ Found ${mobimatterProducts.length} products\n`);
    
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    // Process each product
    for (const mp of mobimatterProducts) {
      try {
        const id = mp.productId || mp.uniqueId;
        const name = mp.productFamilyName || mp.title || "";
        const provider = mp.providerName || "";
        const category = mp.productCategory || "";

        // FILTER OUT TEST PRODUCTS
        const isTestProduct = 
          name.toLowerCase().includes('test') || 
          provider.toLowerCase().includes('test') ||
          category.toLowerCase().includes('test') ||
          id === '75b98dc7-c026-48c1-9fee-465681382d39'; // Known test ID

        if (isTestProduct) {
          skipped++;
          continue;
        }

        // Generate slug from product name
        const slug = name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Extract data from productDetails
        const details = Object.fromEntries(
          (mp.productDetails || []).map(d => [d.name, d.value])
        );

        // Parse data amount from PLAN_DATA_LIMIT (in MB)
        let dataAmount = null;
        const dataLimitStr = details.PLAN_DATA_LIMIT;
        if (dataLimitStr) {
          dataAmount = parseInt(dataLimitStr) / 1000;
        }

        // Parse validity from PLAN_VALIDITY (in hours)
        let validityDays = null;
        const validityStr = details.PLAN_VALIDITY;
        if (validityStr) {
          validityDays = Math.floor(parseInt(validityStr) / 24);
        }

        // Check if product exists
        const existing = await prisma.product.findUnique({
          where: { mobimatterId: id },
        });
        
        const productData = {
          mobimatterId: id,
          name: name,
          description: mp.description || details.PLAN_DETAILS || null,
          provider: mp.providerName,
          category: mp.productCategory || null,
          countries: mp.countries ? JSON.stringify(mp.countries) : null,
          regions: mp.regions ? JSON.stringify(mp.regions) : null,
          dataAmount: dataAmount,
          dataUnit: 'GB',
          validityDays: validityDays,
          price: mp.retailPrice || mp.price,
          currency: mp.currencyCode || 'USD',
          originalPrice: mp.retailPrice || null,
          features: mp.features ? JSON.stringify(mp.features) : null,
          isUnlimited: dataAmount >= 999,
          supportsHotspot: true,
          supportsCalls: false,
          supportsSms: false,
          isActive: true,
          isFeatured: false,
          slug: slug + '-' + id.slice(0, 4), // Make unique
          metaTitle: null,
          metaDescription: null,
          syncedAt: new Date(),
        };
        
        if (existing) {
          // Update existing product
          await prisma.product.update({
            where: { id: existing.id },
            data: productData,
          });
          updated++;
          process.stdout.write('📝');
        } else {
          // Create new product
          await prisma.product.create({
            data: productData,
          });
          created++;
          process.stdout.write('➕');
        }
      } catch (err) {
        errors++;
        console.error(`\n❌ Error processing product ${mp.id}:`, err.message);
      }
    }
    
    console.log('\n\n✅ Sync completed!\n');
    console.log('📊 Results:');
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors:  ${errors}`);
    console.log(`   Total:   ${mobimatterProducts.length}\n`);
    
    if (created + updated > 0) {
      console.log('🎉 Products are now available at: http://localhost:3000/products\n');
    }
    
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
}

syncProducts()
  .finally(async () => {
    await prisma.$disconnect();
  });
