const searchBar = document.querySelector(".search-bar");
const searchItem = document.querySelector(".search-item");
const suggestionsBox = document.querySelector(".search-suggestion");
const suggestionItems = document.querySelectorAll(".suggestion-item");
const searchBtn = document.querySelector(".search-button");

document.querySelector("body").addEventListener("click", (event)=>{
    searchItem.children[1].classList.remove("remove");
    searchItem.children[0].classList.remove("increase-size");
    searchBar.classList.remove("search-bar-suggestions-opened");

    //closing the suggestion box
    searchBar.classList.remove("search-bar-suggestions-opened");
    suggestionsBox.style.display = "none";
})

searchBar.addEventListener("click", function(event){
    event.stopPropagation();
    searchItem.children[0].focus();
    searchItem.children[1].classList.add("remove");
    searchItem.children[0].classList.add("increase-size");
    

});


//showing the relevant suggestions in suggestion box

searchItem.children[0].addEventListener("input", async function () {
    let query = this.value.trim();

    try {
        const response = await fetch(`/listings/api/search-suggestions?q=${query}`);
        const suggestions = await response.json();

        if(query.length === 0){
            suggestionsBox.style.display = "none";
            searchBar.classList.remove("search-bar-suggestions-opened");
        }

        if ((query.length > 0 && query.length < 2) || suggestions.length===0) {
            suggestionsBox.innerHTML = "<p>No Search Suggestions</p>";
            return;
        }

        searchBar.classList.add("search-bar-suggestions-opened");
        suggestionsBox.style.display = "flex";
    

        suggestionsBox.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">
                <i class="fa-solid fa-magnifying-glass" style="margin-right:5px;"></i> ${suggestion}
            </div>
        `).join("");
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
});


window.selectSuggestion = function (suggestion) {
    searchItem.children[0].value = suggestion;
    suggestionsBox.style.display = "none";
    searchBar.classList.remove("search-bar-suggestions-opened");
};



//now fetching the relvant listings and displaying them

searchBtn.addEventListener("click", function () {
    let query = searchItem.children[0].value.trim();
    if (!query) return;

    suggestionsBox.style.display = "none";
    searchBar.classList.remove("search-bar-suggestions-opened");

    fetchListingsForSearch(query);
});

async function fetchListingsForSearch(query) {
    try {
        const response = await fetch(`/listings/api/search-listings?q=${query}`);
        const listings = await response.json();
        updateListingsForSearch(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

function updateListingsForSearch(listings) {
    
    const listingsContainer = document.getElementById("listings-container");
    listingsContainer.innerHTML = "";

    if (listings.length === 0) {
        listingsContainer.innerHTML = "<p>No listings found.</p>";
        return;
    }

    let listingsHtml = `<div class="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 mt-5 pt-3" style="width: 90vw;">`;

    listings.forEach(listing => {
        // ✅ Calculate rating average dynamically
        let sum = 0, ratingAvg = 5.0; // Default to 5.0 if no reviews
        if (listing.reviews && listing.reviews.length > 0) {
            sum = listing.reviews.reduce((acc, review) => acc + review.rating, 0);
            ratingAvg = sum / listing.reviews.length;
        }

        listingsHtml += `
        <div class="col d-flex w-auto">
            <a href="/listings/${listing._id}" class="listing-anchors">
                <div class="card listing-card" style="width: 100%; min-height: 100%;">
                    <img src="${listing.image.url}" class="card-img-top" alt="listing_image" style="height: 18rem; border-radius: 1rem;">
                    <div class="card-body">

                        <div class="row row1">

                            <div class="col-10 col1 p-0">
                                <p class="card-text"><b style="font-weight: 800;">${listing.title}</b></p>
                            </div>

                            <!-- ✅ Rating Box -->
                            <div class="col-2 col2" style="font-size: 12px;">
                                <div class="row" id="rating-box">
                                    <div class="col-6 p-0 col2-1"><i class="fa-solid fa-star"></i></div>
                                    <div class="col-6 p-0 col2-2">
                                        ${ratingAvg.toFixed(1)}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <p class="card-text location-box">${listing.location}, ${listing.country}</p>
                        <p class="card-text price-box">
                            <b style="font-weight: 800;">&#8377; ${listing.price.toLocaleString('en-IN')} <i class="tax" style="display: none;"> + 18% GST</i></b> /night
                        </p>
                    </div>
                </div>
            </a>
        </div>
    `;
    });

    listingsHtml += `</div>`;


    listingsContainer.innerHTML = listingsHtml;

}