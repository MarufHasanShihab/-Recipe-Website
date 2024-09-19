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
})