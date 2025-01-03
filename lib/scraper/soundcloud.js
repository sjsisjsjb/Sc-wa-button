/*
⚠️ PERINGATAN ⚠️  
Script bot WhatsApp Mora AI ini dibuat oleh Khalid untuk keperluan pribadi dan pembelajaran.  
Dilarang keras untuk memperjualbelikan, mendistribusikan ulang, atau mengklaim sebagai milik sendiri.  

Hak Cipta © 2024 Khalid & Mora AI  
*/

const axios = require('axios')
const cheerio = require('cheerio')

const scrapeSoundCloud = async (query) => {
     try {
          const url = `https://m.soundcloud.com/search?q=${encodeURIComponent(query)}`;
          const { data } = await axios.get(url);
        
          const $ = cheerio.load(data);
        
          let results = [];
        
            $('.List_VerticalList__2uQYU li').each((index, element) => {
                const title = $(element).find('.Cell_CellLink__3yLVS').attr('aria-label');
                const musicUrl = 'https://m.soundcloud.com' + $(element).find('.Cell_CellLink__3yLVS').attr('href');
            
                if (title && musicUrl) {
                    results.push({ title, url: musicUrl });
                }
            });

            return results.slice(0, 5); // Ambil hanya yang teratas
        } catch (error) {
            console.error('Error fetching SoundCloud data:', error);
            return [];
       }
   };

module.exports = scrapeSoundCloud;