const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");
const categoryList = document.querySelector(".category-list");

leftBtn.addEventListener("click", () => {
    categoryList.scrollBy({ left: -200, behavior: "smooth" });
});

rightBtn.addEventListener("click", () => {
    categoryList.scrollBy({ left: 200, behavior: "smooth" });
});



//category-filter funcitonality---------------------------------------------------

//getting the selected category
document.querySelectorAll(".category-item").forEach( item => {

    //getting the selected category
    item.addEventListener("click", function(){

        // Remove "active" class from all items before adding to the clicked one
        document.querySelectorAll(".category-item").forEach(el => el.classList.remove("active"));

        this.classList.add("active");
        const selectedCategory = this.getAttribute("data-category");

        //fetching the related lising data from api call
        fetchListingsByCategory(selectedCategory);
    });
});


//function to get the response from api call
function fetchListingsByCategory(category){
    fetch(`/listings?category=${category}`)
        .then(response => response.json())
        .then(data => {updateListingsForCategory(data)})
        .catch(error => console.error("error fetching listings:", error));
}


//updating the listings that are to be displayed
function updateListingsForCategory(listings) {
    const listingsContainer = document.getElementById("listings-container");
    //clearing previous listings
    listingsContainer.innerHTML = "";

    if (listings.length === 0) {
        listingsContainer.innerHTML = "<p>No listings found for this category.</p>";
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


//total after tax funcitonality---------------------------------------------------

const toggleContainer = document.getElementById("flexSwitchCheckDefault");

toggleContainer.addEventListener("click", ()=>{
    let taxInfo = document.getElementsByClassName("tax");
    
    for(info of taxInfo){
        if(info.style.display != "inline"){
            info.style.display = "inline";
        }
        else{
            info.style.display = "none";
        }
        
    }
})