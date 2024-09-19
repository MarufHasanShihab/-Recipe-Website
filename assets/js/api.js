"use strict";

window.ACCESS_POINT = " https://api.edamam.com/api/recipes/v2";
const API_ID = "3ccee09e";
const API_KEY = "302b7c800b12ffab2be3b34bed08acf6";
const TYPE = "public";

export const fetchData = async function (queries, successCallback) {
  const query = queries
    ?.join("&")
    .replace(/,/g, "=")
    .replace(/ /g, "%20")
    .replace(/\+/g, "%2B");
  const url = `${ACCESS_POINT}?app_id=${API_ID}&app_key=${API_KEY}&type=${TYPE}&${
    query ? `${query}` : ""
  }`;
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    successCallback(data);
    console.log(data);
  }
};
