import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const url = 'https://www.ar15.com/forums/Equipment-Exchange/Optics-Sight-and-Sighting-Equipment-Used-/163/';
    
    // Fetch the HTML
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const listings = [];

    // Selector based on typical vBulletin/forum structure. 
    // AR15.com structure is table-based. We need to find the rows.
    // The previous fetch output shows author/views structure.
    // We will look for links that look like thread titles.
    
    // Looking for thread titles in the main table
    $('tr').each((i, el) => {
       // Typically the title is in a <td> with a link
       const titleEl = $(el).find('a[href*="/forums/Equipment-Exchange/"]').first();
       const title = titleEl.text().trim();
       const link = titleEl.attr('href');
       
       // Filter out empty or navigation links
       if (title && link && !title.includes('Page') && title.length > 5) {
         // Check if it matches our "Flip List" keywords
         const keywords = ['EOTech', 'Aimpoint', 'Trijicon', 'RMR', 'Surefire', 'Modlite', 'PVS-14'];
         const isHit = keywords.some(k => title.toLowerCase().includes(k.toLowerCase()));
         
         if (isHit) {
           listings.push({
             title: title,
             url: `https://www.ar15.com${link}`,
             id: link // Use link as unique ID
           });
         }
       }
    });

    // Return unique top 5
    const uniqueListings = [...new Map(listings.map(item => [item['url'], item])).values()].slice(0, 5);

    res.status(200).json(uniqueListings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to scan gear market' });
  }
}
