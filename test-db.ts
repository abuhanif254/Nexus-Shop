import { db } from './src/db';
import { products, categories } from './src/db/schema';

async function main() {
  const cats = await db.select().from(categories);
  const prods = await db.select().from(products);

  console.log("Categories:", cats.map(c => ({ id: c.id, name: c.name, slug: c.slug })));
  console.log("Products Categories:", [...new Set(prods.map(p => p.category))]);
  console.log("Products sample:");
  for (const p of prods.slice(0, 5)) {
    console.log(`- ${p.title} (cat: ${p.category})`);
  }
}

main().catch(console.error).then(() => process.exit(0));
