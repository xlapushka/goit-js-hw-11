const axios = require('axios').default;
import Notiflix from 'notiflix';


const BASE_URL ='https://pixabay.com/api/';
const API_KEY = '37474712-2dac32f03878bab58bae809d9';

let per_page = 40;
let currentPage = 1;
let keyWord = '';

const refs = {
  formSubmit : document.querySelector('#search-form'),
  formSubmitInput : document.querySelector('#search-form input'),
  list : document.querySelector('.js-list'),
  loadMoreBtn : document.querySelector('.btn')
};

refs.loadMoreBtn.addEventListener('click', loadMore);
refs.formSubmit.addEventListener('submit', impactWord);

refs.list.innerHTML = '';

function impactWord(evt) {
  evt.preventDefault();
  // ====================name у submit = searchQuery, додається в elements у currentTarget==================
  keyWord = evt.currentTarget.elements.searchQuery.value;
  refs.list.innerHTML = '';
  currentPage = 1;

  getImages(currentPage, keyWord)
  .then(resp => {
    if (currentPage <= Math.floor(resp.total/per_page)) {
      refs.loadMoreBtn.hidden = false;
    };

    if (resp.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${resp.totalHits} images.`);
    };
    
    refs.list.insertAdjacentHTML('beforeend', createMarkUp(resp.hits));
  })
  .catch(err => console.log(err));
} 


// $.getJSON(URL, function(data){
// if (parseInt(data.totalHits) > 0)
//     $.each(data.hits, function(i, hit){ console.log(hit.pageURL); });
// else
//     console.log('No hits');
// });


function getImages(page=1, keyWord) { 
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
  

  return fetch(`${BASE_URL}?key=${API_KEY}&q=${keyWord}&${params}&page=${page}&per_page=${per_page}`)
    .then(resp => {
      if (!resp.ok) {
      throw new Error(resp.statusText)
      } 

      return resp.json();
    })
    .catch(err => console.log(err))
}

// getImages()
//   .then(resp => {
//     if (currentPage <= Math.floor(resp.total/per_page)) {
//       refs.loadMoreBtn.hidden = false;
//     };

//     if (resp.totalHits > 0) {
//       Notiflix.Notify.success(`Hooray! We found ${resp.totalHits} images.`);
//     };
//     refs.list.insertAdjacentHTML('beforeend', createMarkUp(resp.hits));
//   })
//   .catch(err => console.log(err));

function createMarkUp(arr) {
  if (arr.length === 0) {
    refs.loadMoreBtn.hidden = true;
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  };

  return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
  <li class="card">
    <div class="card-thumb">
      <img src="${webformatURL}" alt="${tags}" width="100%" loading="lazy"/>
    </div>
  
    <div class="card-descr">
      <ul class="list img-info">
        <li class="likes">
          <p class="p">Likes</p>
          <span>${likes}</span>
        </li>
        <li class="views">
          <p>Views</p>
          <span>${views}</span>
        </li>
        <li class="comments">
          <p>Comments</p>
          <span>${comments}</span>
        </li>
        <li class="downloads">
          <p>Downloads</p>
          <span>${downloads}</span>
        </li>
      </ul>
    </div>
  </li> 
  `).join('')
} 

function loadMore() {
  
  currentPage += 1;

  getImages(currentPage, keyWord)
  .then(resp => {
    if (currentPage > Math.floor(resp.total/per_page)) {
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.hidden = true;
    }
    refs.list.insertAdjacentHTML('beforeend', createMarkUp(resp.hits))
  })
  .catch(err => console.log(err));
}



