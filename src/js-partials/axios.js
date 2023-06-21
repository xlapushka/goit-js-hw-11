
import axios from "axios";

const BASE_URL ='https://pixabay.com/api/';
const API_KEY = '37474712-2dac32f03878bab58bae809d9';

let per_page = 40;

async function getImages(page=1, keyWord) { 
  try {
      const params = new URLSearchParams ({
        image_type : 'photo',
        orientation : 'horizontal',
        safesearch : true 
      });

      const options = {
        method: 'GET',
        headers: {
        }
      };
    
    return axios.get(`${BAS1E_URL}?key=${API_KEY}&q=${keyWord}&${params}&page=${page}&per_page=${per_page}`)
  } catch (err) {
    console.log (err)
  } 
}

export { getImages }