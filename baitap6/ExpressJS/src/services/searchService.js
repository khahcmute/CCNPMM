const { client } = require("../config/elasticsearch");
const { Product, Category } = require("../models");
const { Op } = require("sequelize");

class SearchService {
  async indexProduct(product) {
    try {
      await client.index({
        index: "products",
        id: product.id,
        body: {
          id: product.id,
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          salePrice: product.salePrice,
          sku: product.sku,
          categoryId: product.categoryId,
          categoryName: product.category?.name,
          tags: product.tags,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          views: product.views,
          rating: product.rating,
          stock: product.stock,
          createdAt: product.createdAt,
        },
      });
    } catch (error) {
      console.error("Error indexing product:", error);
    }
  }

  async deleteProduct(productId) {
    try {
      await client.delete({
        index: "products",
        id: productId,
      });
    } catch (error) {
      console.error("Error deleting product from index:", error);
    }
  }

  async fuzzySearch(query, filters = {}, page = 1, limit = 20) {
    try {
      const must = [];
      const filter = [{ term: { isActive: true } }];

      // Fuzzy search query
      if (query) {
        must.push({
          multi_match: {
            query: query,
            fields: ["name^3", "description^2", "shortDescription", "tags^2"],
            fuzziness: "AUTO",
            operator: "or",
          },
        });
      }

      // Category filter
      if (filters.categoryId) {
        filter.push({ term: { categoryId: filters.categoryId } });
      }

      // Price range filter
      if (filters.minPrice || filters.maxPrice) {
        const priceRange = {};
        if (filters.minPrice) priceRange.gte = parseFloat(filters.minPrice);
        if (filters.maxPrice) priceRange.lte = parseFloat(filters.maxPrice);
        filter.push({ range: { price: priceRange } });
      }

      // Sale products filter
      if (filters.onSale) {
        filter.push({ exists: { field: "salePrice" } });
      }

      // Featured products filter
      if (filters.featured) {
        filter.push({ term: { isFeatured: true } });
      }

      // In stock filter
      if (filters.inStock) {
        filter.push({ range: { stock: { gt: 0 } } });
      }

      // Rating filter
      if (filters.minRating) {
        filter.push({
          range: { rating: { gte: parseFloat(filters.minRating) } },
        });
      }

      // Sort options
      let sort = [];
      switch (filters.sortBy) {
        case "price_asc":
          sort = [{ price: { order: "asc" } }];
          break;
        case "price_desc":
          sort = [{ price: { order: "desc" } }];
          break;
        case "rating":
          sort = [{ rating: { order: "desc" } }];
          break;
        case "views":
          sort = [{ views: { order: "desc" } }];
          break;
        case "newest":
          sort = [{ createdAt: { order: "desc" } }];
          break;
        default:
          sort = [
            { _score: { order: "desc" } },
            { createdAt: { order: "desc" } },
          ];
      }

      const searchBody = {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter: filter,
          },
        },
        sort: sort,
        from: (page - 1) * limit,
        size: limit,
        highlight: {
          fields: {
            name: {},
            description: {},
            shortDescription: {},
          },
        },
      };

      const result = await client.search({
        index: "products",
        body: searchBody,
      });

      const products = result.body.hits.hits.map((hit) => ({
        ...hit._source,
        score: hit._score,
        highlight: hit.highlight,
      }));

      return {
        products,
        total: result.body.hits.total.value,
        page,
        limit,
        totalPages: Math.ceil(result.body.hits.total.value / limit),
      };
    } catch (error) {
      console.error("Error in fuzzy search:", error);
      throw error;
    }
  }

  async getSuggestions(query, limit = 5) {
    try {
      const result = await client.search({
        index: "products",
        body: {
          suggest: {
            product_suggest: {
              prefix: query,
              completion: {
                field: "name.suggest",
                size: limit,
                skip_duplicates: true,
              },
            },
          },
        },
      });

      return result.body.suggest.product_suggest[0].options.map((option) => ({
        text: option.text,
        source: option._source,
      }));
    } catch (error) {
      console.error("Error getting suggestions:", error);
      return [];
    }
  }

  async reindexAllProducts() {
    try {
      const products = await Product.findAll({
        include: [{ model: Category, as: "category" }],
      });

      for (const product of products) {
        await this.indexProduct(product);
      }

      console.log(`Reindexed ${products.length} products`);
    } catch (error) {
      console.error("Error reindexing products:", error);
    }
  }
}

module.exports = new SearchService();
