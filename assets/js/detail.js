"use strict";
/* 
 * Import
*/
import { fetchData } from "./api.js";
import { cardQueries, skeletonCard } from "./global.js";
import { getTime } from "./module.js";

/* 
 * Render data
*/
const detailContainer = document.querySelector("[data-detail-container]");

ACCESS_POINT += `/${window.location.search.slice(window.location.search.indexOf("=") + 1)}`;

fetchData(null, data =>{
    console.log(data)

    const {
        images: { LARGE, REGULAE, SMALL, THUMBNAIL},
        label : title,
        source: author,
        ingredients = [],
        totalTIme: cookingTime =  0,
        calories = 0,
        cuisineType = [],
        dietLabels = [],
        dishType = [],
        yield: servings = 0,
        ingrendientlines = [],
        uri
    } = data.recipe;
    document.title = `${title} - cook.io`;

    const banner = LARGE ?? REGULAE ?? SMALL ?? THUMBNAIL ;
    const {url: bannerUrl, width, height} = banner;
    const tags = [...cuisineType, ...dietLabels, ...dishType];

    let tagElements = "";
    let ingredientItems = "";

    const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
    const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

    tags.map(tag => {
        let type = "";
        if(cuisineType.includes(tag)) {
            type = "cuisineType";
        }else if(dietLabels.includes(tag)){
            type = "diet";
        }else{
            type = "dishType"
        }
        tagElements += `
        <a href="./recipes.html?${type}=${tag.toLowerCase()}" class="filter-chip label-large">${tag}</a>
        `
    })

    ingrendientlines.map(ingredient =>{
        ingredientItems += `
        <li class="ingr-item">${ingredient}</li>
        `
    })
    detailContainer.innerHTML = `
     <figure class="detail-banner img-holder">
            <img src="${bannerUrl}" width="${width}" height="${height}" alt="${title}" class="img-cover">
          </figure>
          <div class="detail-content">
            <div class="title-wrapper">
                <h1 class="display-small">${title ?? "untitled"}</h1>
                <button class="btn btn-secondary has-state has-icon  ${isSaved ? "saved" : "removed"}" onclick(saveRecipe(this, '${recipeId}'))>
                    <span class="material-symbols-outlined" aria-hidden="true">bookmark</span>
                    <span class="label-large save-text">Save</span>
                    <span class="label-large unsave-text">Unsave</span>
                </button>
            </div>

            <div class="detail-author label-large">
                <span class="span">by</span> ${author}
            </div> 

            <div class="detai-stats">
                <div class="stats-item">
                    <span class="display-medium">${ingredients.length}</span>
                    <span class="label-medium">Ingredients</span>
                </div>
                <div class="stats-item">
                    <span class="display-medium">${getTime(cookingTime).time || "<1"}</span>
                    <span class="label-medium">${getTime(cookingTime).timeUnit}</span>
                </div>
                <div class="stats-item">
                    <span class="display-medium">${Math.floor(calories)}</span>
                    <span class="label-medium">Calories</span>
                </div>
            </div>

            ${tagElements ? `<div class="tag-list">${tagElements}</div>`: ""}

            <h2 class="title-medium ingr-title">Ingredients
                <span class="label-medium">for ${servings} Servings</span>
            </h2>

            ${ingredientItems ? `<ul class="body-large ingr-list">${ingredientItems}</ul>` : ""}

          </div>
    `
})