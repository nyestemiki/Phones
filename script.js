const brands = document.querySelector('.brands');
const logo = document.querySelector('.logo img');
let isAnimating = false;
let brandSelected = false;

// Loading the brands + eventlisteners to select them
$.getJSON("data.json", data => {
    let index = 1;

    // Loading brands
    Object.keys(data.brands).forEach(brand => {
        brands.innerHTML += `
            <div class="brand brand_hover brand${index++}" data-brand="${data.brands[brand].brandname}">
                <div class="img">
                    <img src="${data.brands[brand].cover}">
                </div>
                <div class="title">
                    <span class="">${data.brands[brand].brandname}</span>
                </div>
            </div>`;
    });

    // Appending eventlisteners
    document.querySelectorAll('.brand').forEach(brand => {
        brand.addEventListener('click', () => selectBrand(brand));
    });
});

function selectBrand(brand) {
    // Waiting for animation to terminate | Already selected
    if (isAnimating || brandSelected) {
        return;
    }

    brandSelected = true;
    removeBrandHovers();
    hideBrandsExceptFor(brand);
    changeTitleTo(brand);
    setTimeout(() => {
        brand.classList.add('brand_selected');
        brand.classList.add('change_order');
        updateTitleTag(brand);
        brand.innerHTML += `
            <div id="more_phones">More Models</div>
        `;
    }, 500);
}

// Sets brand's title to the modelname and appends more button
function updateTitleTag(brand) {
    let title = brand.querySelector('.title span');
    title.classList.add('title_modified');

    $.getJSON("data.json", data => {
        Object.keys(data.brands)
        .filter(key => key === brand.dataset.brand)
        .map(b => { 
            // Setting the modelname
            const modelname = brand.querySelector('.title span');
            modelname.textContent = data.brands[b].covermodel; 
            // Appending more button
            brand.querySelector('.title').innerHTML += '<button class="more_btn">More</button>';
            brand.querySelector('.more_btn').addEventListener('click', () => { moreInfoOn(modelname.textContent) });
            brand.querySelector('.title').classList.add('flex_column');
        });
    });
}

// Switches display of models to display of information about the selected one
function moreInfoOn(modelname) {
    const displayArea = document.querySelector('#more_phones'); // Area for models/information
    const modelDisplay = displayArea.innerHTML; // Storing models before switching to displaying the information
    
    // Display the information
    displayArea.innerHTML = '<h1>Info</h1>';


    // setTimeout(() => {displayArea.innerHTML = modelDisplay}, 1000);
}

// Changes window's title to brandname
function changeTitleTo(brand) {
    document.title = brand.querySelector('.title').textContent;
}

// Removes hover effects from the brands
function removeBrandHovers() {
    [...document.querySelectorAll('.brand')].map(instance => {
        instance.classList.remove('brand_hover');
    });
}

// Reactivates hover effects on the brands
function addBrandHovers() {
    [...document.querySelectorAll('.brand')].map(instance => {
        instance.classList.add('brand_hover');
    });
}

// Hides the brands except for the given 'brand'
function hideBrandsExceptFor(brand) {
    //Animation started
    isAnimating = true;

    // Fading out content of brand container
    [...document.querySelectorAll('.brand')].map(instance => {
        if (instance !== brand) {
            instance.classList.add('content_fade');
        }
    });

    // Hiding the content of the brand container
    setTimeout(() => {
        [...document.querySelectorAll('.brand')].map(instance => {
            if (instance !== brand) {
                instance.classList.add('content_hide');
            }
        });
    }, 500);

    // Hiding the brand container
    setTimeout(() => {
        [...document.querySelectorAll('.brand')].map(instance => {
            if (instance !== brand) {
                instance.classList.add('brand_hide');
            }
        });
    }, 750);

    // Animation terminated
    setTimeout(() => {
        isAnimating = false;
    }, 2500);
}

// Displaying the main menu with all the brands
function mainMenu() {
    // Home button is disabled when in main menu
    if (document.title == "Phones") {
        return;
    }

    document.title = "Phones";

    brandSelected = false;

    // Removing other models from brand container
    let more_phones = document.querySelector('#more_phones');
    more_phones.parentNode.removeChild(more_phones);

    // Set order of title to initial position
    document.querySelector('.change_order').classList.remove('change_order');

    // Deleting more button
    document.querySelector('.more_btn').parentElement.removeChild(document.querySelector('.more_btn'));
    document.querySelector('.flex_column').classList.remove('flex_column');

    // Unselecting the brand
    setTimeout(() => {
        document.querySelector('.brand_selected').classList.remove('brand_selected');
        // Setting back the brand's title
        let title = document.querySelector('.title_modified');
        title.textContent = title.parentElement.parentElement.dataset.brand;
        title.classList.remove('title_modified');
    }, 260);
    
    // Animation started
    isAnimating = true;

    // Activating hidden brands
    [...document.querySelectorAll('.brand')].map(instance => {
        instance.classList.remove('brand_hide');
    });

    // Adding the content of the containers'
    setTimeout(() => {
        [...document.querySelectorAll('.brand')].map(instance => {
            instance.classList.remove('content_hide');
        });
    }, 700);

    // Fading in the containter
    setTimeout(() => {
        [...document.querySelectorAll('.brand')].map(instance => {
            instance.classList.remove('content_fade');
        });
    }, 1000);

    // Reactivating hover effects on brands 
    setTimeout(() => {
        addBrandHovers();
    }, 1200);

    // Animation terminated
    setTimeout(() => {
        isAnimating = false;
    }, 2500);
}

// Click on logo => back to main menu
logo.addEventListener('click', mainMenu);