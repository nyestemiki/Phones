const brands = document.querySelector('.brands');
const logo = document.querySelector('.logo img');
let isAnimating = false;

// Loading the brands + eventlisteners to select them
$.getJSON("data.json", data => {
    let index = 1;

    // Loading brands
    Object.keys(data.brands).forEach(brand => {
        brands.innerHTML += `
            <div class="brand brand_hover brand${index}" data-brand="${index++}">
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
    // Waiting for animation to terminate
    if (isAnimating) {
        return;
    }

    removeBrandHovers();
    hideBrandsExceptFor(brand);
    changeTitleTo(brand);
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
    window.title = "Phones";

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