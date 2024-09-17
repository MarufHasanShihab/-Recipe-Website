"use strict";

// Home page Search
const searchField = document.querySelector("[data-search-field]");
const searchBtn = document.querySelector("[data-search-btn]");

searchBtn.addEventListener("click", ()=>{
    if(searchField.value) window.location = `/recipes.html?q=${searchField.value}`;
})

// search submit when press "Enter" key
searchField.addEventListener("keydown", e =>{
    if(e.key === "Enter") searchBtn.click();
})


// Tab panel navigation
const tabBtns = document.querySelectorAll("[data-tab-btn]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");

let [lastActiveTabPanel] = tabPanels;
let [lastActiveTabBtn] = tabBtns;


addEventOnElements(tabBtns, "click", function(){
    lastActiveTabPanel.setAttribute("hidden", "");
    lastActiveTabBtn.removeAttribute("aria-selected"), false;
    lastActiveTabBtn.setAttribute("tabindex", -1);
    const currentTabPanel = document.querySelector(`#${this.getAttribute("aria-controls")}`);
    currentTabPanel.removeAttribute("hidden");
    this.setAttribute("aria-selected", true);
    this.setAttribute("tabindex", 0);
    lastActiveTabPanel = currentTabPanel
    lastActiveTabBtn = this;
});


// Navigate Tab With arrow key
addEventOnElements(tabBtns, "keydown", function(e){
    const newxtElement = this.nextElementSibling;
    const previousElement = this.previousElementSibling;
    if(e.key === "ArrowRight" && newxtElement){
        this.setAttribute("tabindex", -1)
        newxtElement.setAttribute("tabindex", 0);
        newxtElement.focus();
    }else if(e.key === "ArrowLeft" && previousElement){
        this.setAttribute("tabindex", -1)
        previousElement.setAttribute("tabindex", 0);
        previousElement.focus();
    }else if(e.key === "Tab"){
        this.setAttribute("tabindex", -1);
        lastActiveTabBtn.setAttribute("tabindex", 0)
    }
})