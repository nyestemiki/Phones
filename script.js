const brands = document.querySelector('.brands');
const logo = document.querySelector('.logo img');

let isAnimating = false;
let isBrandSelected = false;
let isExpanded = false;

let modelDisplayGlobal;

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
                    <span class="brand_name">${data.brands[brand].brandname}</span>
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
    if (isAnimating || isBrandSelected) {
        return;
    }

    isBrandSelected = true;
    removeBrandHovers();
    hideBrandsExceptFor(brand);
    changeTitleTo(brand);
    setTimeout(() => {
        brand.classList.add('brand_selected');
        brand.classList.add('change_order');
        setTimeout(() => {
            initializeModelsDisplayArea();
            moreModelsTo(brand);
            updateTitleTag(brand);
        }, 2000);
    }, 500);
}

function initializeModelsDisplayArea() {
    document.querySelector('.brand_selected').innerHTML += "<div class='models' id='more_phones'></div>";
}

function moreModelsTo(brand) {
    let html = "";
    $.getJSON("data.json", data => {
        const modellist = data.brands[brand.dataset.brand].modelList;
        Object.keys(modellist)
            .map(key => {
                html += `
                    <div class="model">
                        <img src="${modellist[key].img}">
                    </div>
                `;
            });
        brand.querySelector('.models').innerHTML = html || '<div class="models">No other models available</div>';
        // Next model listeners
        brand.querySelector('.models').addEventListener('mousedown', nextModel);
        brand.querySelector('.models').addEventListener('mousewheel', nextModel);
        // Disabling default scrolling
        brand.querySelector('.models').addEventListener('scroll', () => {
            brand.querySelector('.models').scrollTo(0, 0);
        });
    });
}

function nextModel() {
    // Set's current model to next one and calls updateBrandName and updateModelList

    // Set the current model 
    // Set the modelname (.brand_name textContent) => more button works properly
    // Scroll in other model's list (always show models following the displayed model)

    console.log('next model');
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
            brand.querySelector('.title').innerHTML += '<div class="more_btn">More</div>';
            brand.querySelector('.more_btn').addEventListener('click', handelMoreInfoButton);
            brand.querySelector('.title').classList.add('flex_column');
        });
    });
}

// Resets the event listeners
function resetEventListeners() {
    document.querySelector('.brand_selected .models').addEventListener('click', nextModel);
}

// Toggels information/models
function handelMoreInfoButton() {
    let brand = document.querySelector('.brand_selected');
    let modelname = document.querySelector('.brand_selected .brand_name').textContent;

    if (isExpanded) {
        document.querySelector('#more_phones').innerHTML = moreModelsTo(brand) || "More Models";
        document.querySelector('.more_btn').textContent = "More";
        document.querySelector('#more_phones').classList.add('models');
        document.querySelector('#more_phones').classList.remove('info_display');
        resetEventListeners();
    } else {
        modelDisplayGlobal = moreInfoOn(brand.dataset.brand, modelname);
        document.querySelector('.more_btn').textContent = "Less";
        document.querySelector('#more_phones').classList.add('info_display');
        document.querySelector('#more_phones').classList.remove('models');
    }

    isExpanded = !isExpanded;
}

// Switches display of models to display of information about the selected one
// Returns innerHTML of the model container
function moreInfoOn(brand, modelname) {
    const displayArea = document.querySelector('#more_phones'); // Area for models/information
    const modelDisplay = displayArea.innerHTML; // Storing models before switching to displaying the information

    displayArea.innerHTML = "";

    // All phones from data.JSON
    $.getJSON("data.json", data => {
        Object.keys(data.brands)
        // Selecting the current brand
        .filter(key => key === brand)
        .map(currentBrand => {     
            Object.keys(data.brands[currentBrand].modelList)
                // Selecting the current model
                .filter(model => model === modelname)
                .map(currentModel => { 
                    const modelDataObject = data.brands[currentBrand].modelList[currentModel];
                    displayArea.classList.add('info_display');
                    if (!modelDataObject.body) {
                        displayArea.textContent = "No info";
                        return;
                    }
                    displayArea.innerHTML += `
                        <div class="info_box">
                            <div>
                                <span class="spec_type">Display</span> | 
                                <span class="spec_word">${modelDataObject.display.size}</span> inch
                                <span class="spec_word">${modelDataObject.display.type}</span> with a resolution of
                                <span class="spec_word">${modelDataObject.display.resolution}</span> in a ratio of
                                <span class="spec_word">${modelDataObject.display.ratio}</span> protected by 
                                <span class="spec_word">${modelDataObject.display.protection}</span>
                            </div>
                        </div>
                        <div class="info_box">
                            <div>
                                <span class="spec_type">Body</span> | 
                                <span class="spec_word">${modelDataObject.body.size}</span> mm
                                (<span class="spec_word">${modelDataObject.body.weight}</span>g)
                            </div>
                        </div>
                        <div class="info_box">
                            <div>
                                <span class="spec_type">OS</span> | 
                                <span class="spec_word">${modelDataObject.os}</span>
                            </div>
                        </div>
                        <div class="info_box">
                            <div>
                                <span class="spec_type">Processor</span> | 
                                <span class="spec_word">${modelDataObject.cpu.name}</span> with
                                <span class="spec_word">${modelDataObject.cpu.cores}</span> cores
                            </div>
                        </div>
                        <div class="info_box">
                            <div>
                                <span class="spec_type">Storage</span> | 
                                <span class="spec_word">${modelDataObject.ram}</span> GB RAM,
                                <span class="spec_word">${modelDataObject.storage}</span> GB internal storage
                            </div>
                        </div>
                        <div class="info_box">
                            <div>
                                <span class="spec_type">Camera</span> | 
                                <span class="spec_word">${modelDataObject.camera}</span> main lens and
                                <span class="spec_word">${modelDataObject.selfie}</span> for selfies
                            </div>
                        </div>
                        <div class="info_box">
                            <div>
                                <span class="spec_type">Battery</span> | 
                                <span class="spec_word">${modelDataObject.battery}</span> mAh
                            </div>
                        </div>
                    `;
                });
        });
    });

    return modelDisplay;
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

    isBrandSelected = false;

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