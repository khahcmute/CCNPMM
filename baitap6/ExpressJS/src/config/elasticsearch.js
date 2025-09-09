const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
});

const createProductIndex = async () => {
  try {
    const indexExists = await client.indices.exists({ index: "products" });

    if (!indexExists.body) {
      await client.indices.create({
        index: "products",
        body: {
          mappings: {
            properties: {
              id: { type: "integer" },
              name: {
                type: "text",
                analyzer: "standard",
                fields: {
                  suggest: {
                    type: "completion",
                  },
                },
              },
              description: { type: "text" },
              shortDescription: { type: "text" },
              price: { type: "float" },
              salePrice: { type: "float" },
              sku: { type: "keyword" },
              categoryId: { type: "integer" },
              categoryName: { type: "keyword" },
              tags: { type: "keyword" },
              isActive: { type: "boolean" },
              isFeatured: { type: "boolean" },
              views: { type: "integer" },
              rating: { type: "float" },
              stock: { type: "integer" },
              createdAt: { type: "date" },
            },
          },
        },
      });
      console.log("Products index created");
    }
  } catch (error) {
    console.error("Error creating Elasticsearch index:", error);
  }
};

module.exports = { client, createProductIndex };
