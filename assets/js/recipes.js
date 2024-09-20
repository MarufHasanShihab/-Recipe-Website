"use strict";

/* 
 * Import
 */
import { fetchData } from "./api.js";
import { cardQueries, skeletonCard } from "./global.js";
import { getTime } from "./module.js";


/* 
 * Accordion
 */

const accorions = document.querySelectorAll("[data-accordion]");

const inintAccordion = function(element){
    const button = element.querySelector("[ data-accordion-btn]");

    let isExpanded = false;
    button.addEventListener("click", function(){
        isExpanded = isExpanded ? false : true;
        this.setAttribute("aria-expanded", isExpanded);
    })
}

for(const accordion of accorions)inintAccordion(accordion)


/* 
* Filter bar toggle for mobile screen
 */
const filterBar = document.querySelector("[data-filter-bar]");
const filterToggler = document.querySelectorAll("[data-filter-toggler]");
const overlay = document.querySelector("[data-overlay]");

addEventOnElements(filterToggler, "click", function(){
    filterBar.classList.toggle("active");
    overlay.classList.toggle("active");
    const bodyOverflow = document.body.style.overflow;
    document.body.style.bodyOverflow === "hidden" ? "visible" : "hidden";
});


/* 
 * Filter submit and clear
 */
const filterSubmit = document.querySelector("[data-filter-submit]");
const filterClear = document.querySelector("[data-filter-clear]");
const filterSearch = filterBar.querySelector("input[type='search']");

filterSubmit.addEventListener("click", function(e){
    const filterCheckboxes = filterBar.querySelectorAll("input:checked");
    const queries = [];
    if(filterSearch.value) queries.push(["q", filterSearch.value]);
    if(filterCheckboxes.length){
        for(const checkbox of filterCheckboxes){
            const key = checkbox.parentElement.parentElement.dataset.filter;
            queries.push([key, checkbox.value]);
        }
    }
    window.location = queries.length ?  `?${(queries.join("&").replace(/,/g, "="))}` : "/recipes.html"
});

filterSearch.addEventListener("keydown", e=>{
    if(e.key === "Enter") filterSubmit.click()
});

filterClear.addEventListener("click", function(){
    const filterCheckboxes = filterBar.querySelectorAll("input:checked");
    filterCheckboxes?.forEach(elem => elem.checked = false);
    filterSearch.value &&= "";
});


const queryStr = window.location.search.slice(1);
const queries = queryStr && queryStr.split("&").map(i => i.split("="));

const filterCount = document.querySelector("[data-filter-count]");
if(queries.length){
    filterCount.style.display = "block";
    filterCount.innerHTML = queries.length;
}else{
    filterCount.style.display = "none";
}

queryStr && queryStr.split("&").map(i => {
    if(i.split("=")[0] === "q"){
        filterBar.querySelector("input[type='search']").value = i.split("=")[1].replace(/%20/g, "");
    }else{
        filterBar.querySelector(`[value="${i.split("=")[1].replace(/%20/g, "")}"]`).checked = true;
    }
});


const filterBtn = document.querySelector("[data-filter-btn]");
window.addEventListener("scroll", e => {
    filterBtn.classList[window.scrollY >= 120 ? "add" : "remove"]("active");
})


/* 
 * Request recipes and render
 */
const gridList = document.querySelector("[data-grid-list]");
const loadMore = document.querySelector("[data-load-more]");

const defaultQueries = [
    ["mealType", "breakfast"],
    ["mealType", "dinner"],
    ["mealType", "lunch"],
    ["mealType", "snack"],
    ["mealType", "teatime"],
    ...cardQueries
];

gridList.innerHTML = skeletonCard.repeat(20);
let nextPageUrl = "";


const renderRecipe = data => {
    data.hits.map((item, index)=>{
        const {
            recipe: {
                image,
                label:title,
                totalTime: cookingTime,
                uri
            }
        } = item;
        const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
        const isSaved = window.localStorage.getItem(
          `cookio-recipe${recipeId}`);

          const card = document.createElement("div");
          card.classList.add("card");
          card.style.animationDelay = `${100* index}ms`

          card.innerHTML = `
          
          <figure class="card-media img-holder">
                  <img src="${image}" width="195" height="195" loading="lazy" class="img-cover" alt="${title}">
                </figure>
                <div class="card-body">
                  <h3 class="title-small">
                    <a href="./detail.html?recipe=${recipeId}" class="card-link">${
                      title ?? "Untitle"
                    }</a>
                  </h3>
                  <div class="meta-wrapper">
                    <div class="meta-item">
                      <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
                      <span class="label-medium">${
                        getTime(cookingTime).time || "<1"
                      } ${getTime(cookingTime).timeUnit}</span>
                    </div>
                    <button class="icon-btn ${
                      isSaved ? "saved" : "removed"
                    } has-state removed" onClick="onSaveRecipe(this, '${recipeId}')"   aria-label="Add to saved recipes">
                      <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
                      <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
                    </button>
                  </div>
                </div>
          `;
          gridList.appendChild(card);
    })
}

let requestedBefore = true;

fetchData(queries || defaultQueries, data =>{
    const {_links: {next}} = data;
    nextPageUrl = next?.href;
    gridList.innerHTML = "";
    requestedBefore = false;
    if(data.hits.length){
        renderRecipe(data)
    }else{
        loadMore.innerHTML = `<p class=" body-medium info-text">No recipe found</p>`
    }
});