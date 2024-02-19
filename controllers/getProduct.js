const puppeteer = require('puppeteer');


const getProduct=(async(req,res)=>{
    const keyword = req.query.keyword;

        if (!keyword) {
          return res.status(400).json({ error: 'Keyword is required' });
        }
      
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
      
      
          await page.goto(`https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`);
      
       
          await page.waitForSelector('.s-result-item');
      

          const products = await page.evaluate(async() => {
            const results = [];
            const items = document.querySelectorAll('.s-result-item');
      
            for (let i = 0; i < Math.min(4, items.length); i++) {
              const name = items[i].querySelector('h2 span')?.innerText.trim() || 'N/A';
              const description = items[i].querySelector('.a-row.a-size-base.a-color-secondary span')?.innerText.trim() || 'N/A';
              const rating = items[i].querySelector('.a-icon-star-small')?.innerText.trim() || 'N/A';
              const reviews = items[i].querySelector('.a-size-base')?.innerText.trim() || 'N/A';
              const price = items[i].querySelector('.a-price .a-offscreen')?.innerText.trim() || 'N/A';
                
              await items[i].click();
      
              // for top 10 reviews
              const topReviews = Array.from(document.querySelectorAll('.a-spacing-medium .a-size-base')).slice(0, 10).map(review => review.innerText.trim());
              results.push({
                name,
                description,
                rating,
                reviews,
                topReviews,
                price,
              });
            }
      
            return results;
          });
      
          await browser.close();
      
          res.json(products);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
})

module.exports={
    getProduct
}