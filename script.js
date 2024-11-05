const apiKey = "KaUUMH2XXMtJWyyN01dCuWpkAYXD4v7qWZEGoWKP";

const btn=document.getElementById("btn");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const currentImageContainer = document.getElementById("current-image-container");
const searchHistoryList = document.getElementById("search-history");

// Fetch and display the current Image of the Day
async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    await getImageOfTheDay(currentDate);
}

// Fetch and display the Image of the Day for a selected date
async function getImageOfTheDay(date) {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`);
        if (!response.ok) throw new Error("Failed to fetch data from NASA API");
        
        const data = await response.json();
        displayImage(data);
        saveSearch(date);
        addSearchToHistory(date);
    } catch (error) {
        console.error("Error fetching image:", error);
        currentImageContainer.innerHTML = `<p>Error fetching image: ${error.message}</p>`;
    }
}

// Display image details in the current image container
function displayImage(data) {
    currentImageContainer.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.date}</p>
        <img src="${data.url}" alt="${data.title}">
        <p>${data.explanation}</p>
    `;
}

// Save a date to local storage
function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

// Load search history from local storage and display it
function loadSearchHistory() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.forEach(date => addSearchToHistory(date));
}

// Add a date to the search history list in the UI
function addSearchToHistory(date) {
    const listItem = document.createElement("li");
    listItem.textContent = date;
    listItem.addEventListener("click", () => getImageOfTheDay(date));
    searchHistoryList.appendChild(listItem);
}

// Event listener for the form submission
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    const selectedDate = searchInput.value;
    if (selectedDate) getImageOfTheDay(selectedDate);
});

// Load current image and search history on page load
window.addEventListener("DOMContentLoaded", () => {
    getCurrentImageOfTheDay();
    loadSearchHistory();
});
