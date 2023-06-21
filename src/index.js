
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import { getImages } from './js-partials/axios';
import "simplelightbox/dist/simple-lightbox.min.css";

let per_page = 40;
let currentPage = 1;
let keyWord = '';
let resp;

const refs = {
  formSubmit : document.querySelector('#search-form'),
  formSubmitInput : document.querySelector('#search-form input'),
  list : document.querySelector('.js-list'),
  loadMoreBtn : document.querySelector('.btn')
};

  
refs.loadMoreBtn.addEventListener('click', onLoadMoreButtonClick);
refs.formSubmit.addEventListener('submit', onFormSubmit);

refs.list.innerHTML = '';



async function onFormSubmit(evt) {
  evt.preventDefault();

  // ====================name у submit = searchQuery, додається в elements у currentTarget==================
  keyWord = evt.currentTarget.elements.searchQuery.value.trim();

  if (!keyWord) {
    refs.list.innerHTML = '';
    Notiflix.Notify.warning('Please enter something to search!');
    return
  }

  refs.list.innerHTML = '';
  currentPage = 1;

  try {
   resp = await getImages(currentPage, keyWord);

   if (resp.data.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
    };
    
   refs.list.insertAdjacentHTML('beforeend', createMarkUp(resp.data.hits));

   if (currentPage <= Math.floor(resp.data.total/per_page)) {
      refs.loadMoreBtn.hidden = false;
    };

    let lightbox = new SimpleLightbox('.gallery a');
    let gallery = document.querySelector('.gallery');
    
    await gallery.addEventListener('click', showGallery);
    
    function showGallery(evt) {
      evt.preventDefault();
      console.log(lightbox);
      // lightbox.open()
    
    }  
  } catch (err) {
    Notiflix.Notify.failure("Something went wrong! Please try to reload.");
    console.log(err)
  }; 

} 


function createMarkUp(arr) {
  if (arr.length === 0) {
    refs.loadMoreBtn.hidden = true;
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  };

  return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
 
  <a class="card" href="${largeImageURL}>
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
  </a>    
  `).join('')
} 


async function onLoadMoreButtonClick() {
  currentPage += 1;
  
  try {
    resp = await getImages(currentPage, keyWord);

    if (currentPage > Math.floor(resp.data.total/per_page)) {
      // console.log(resp);
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.hidden = true;
    }
    refs.list.insertAdjacentHTML('beforeend', createMarkUp(resp.data.hits))
  } catch (err) {
    Notiflix.Notify.failure("Something went wrong! Please try to reload.");
    console.log(err)
  }
}


