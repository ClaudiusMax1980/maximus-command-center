import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const urls = {
      '9mm': 'https://www.bulkammo.com/handgun/bulk-9mm-ammo?dir=asc&order=cost_per_round',
      '5.56': 'https://www.bulkammo.com/rifle/bulk-5.56x45-ammo?dir=asc&order=cost_per_round',
      '.223': 'https://www.bulkammo.com/rifle/bulk-.223-ammo?dir=asc&order=cost_per_round'
    };

    const results = {};

    for (const [caliber, url] of Object.entries(urls)) {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(data);
      // BulkAmmo usually puts the price in a span with class "price" or similar.
      // We need to be specific. Based on typical Magento structures:
      // The first item in the list (since we sorted asc) is the cheapest.
      
      // Select the first price tag.
      // Note: This selector might need tuning if their DOM changes. 
      // Trying a robust selector for the product grid price.
      const priceText = $('.price-box .price').first().text().trim();
      
      results[caliber] = priceText || 'ERR';
    }

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch ammo prices' });
  }
}
