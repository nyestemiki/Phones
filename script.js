const brands = document.querySelector('.brands');
const logo = document.querySelector('.logo img');

let isAnimating = false;
let isBrandSelected = false;
let isExpanded = false;

let canScroll = true;

let modelDisplayGlobal;
let currentModelGlobal;

// Loading the brands + eventlisteners to select them
$.getJSON("data.json", data => {
    let index = 1;

    // Loading brands
    Object.keys(data.brands).forEach(brand => {
        brands.innerHTML += `
            <div class="brand brand_hover brand${index++}" data-brand="${data.brands[brand].brandname}">
                <div class="img" data-model="${data.brands[brand].covermodel}">
                    <img src="${data.brands[brand].cover}">
                </div>
                <div class="title">
                    <span class="brand_name">${data.brands[brand].brandname}</span>
                </div>
            </div>`;
    });

    setTimeout(() => {
        document.querySelectorAll('.brand').forEach(brand => {
            setBackground(brand)
        });
    }, 200);
    

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
            // initializeNextIndicator();
            moreModelsTo(brand);
            updateTitleTag(brand);
        }, 2000);
    }, 500); 
}

function adaptBackground() {
    const currentContainer = document.querySelector('.brand_selected');
    const colorThief = new ColorThief();
    const image = currentContainer.querySelector('.img img');
    const color = colorThief.getPalette(image);
    const gradient = `radial-gradient(circle, 
        rgb(${color[1][0]}, ${color[1][1]}, ${color[1][2]}),
        rgb(${color[0][0]}, ${color[0][1]}, ${color[0][2]})
    `;
    currentContainer.style.background = gradient;
}

function setBackground(brand) {
    let colorThief = new ColorThief();
    let image = brand.querySelector('.img img');
    let color = colorThief.getPalette(image);
    let gradient = `radial-gradient(circle, 
        rgb(${color[1][0]}, ${color[1][1]}, ${color[1][2]}) 10%,
        rgb(${color[0][0]}, ${color[0][1]}, ${color[0][2]})
    `;
    brand.style.background = gradient;
}

function initializeModelsDisplayArea() {
    document.querySelector('.brand_selected').innerHTML += "<div class='models models_hover' id='more_phones'></div>";
}

// function initializeNextIndicator() {
//     document.querySelector('.brand_selected').innerHTML += "<div class='next'>></div>";
// }

// function addArrowEffect() {
//     setTimeout(() => {
//         document.querySelector('.brand_selected .models').innerHTML += `<div class='arrow_effect'></div>`;
//     }, 300);
// }

function moreModelsTo(brand) {
    let html = "";
    let modelBeforeCurrent = true;

    $.getJSON("data.json", data => {
        const modellist = data.brands[brand.dataset.brand].modelList;
        Object.keys(modellist)
            .map(key => {       
                if (!modelBeforeCurrent) {
                    html += `
                        <div class="model" data-model="${key}">
                            <img src="${modellist[key].img}">
                        </div>
                    `;
                }
                if (key === brand.querySelector('.img').dataset.model) {
                    modelBeforeCurrent = false;
                }
            });
        // if (html) {
        //     addArrowEffect();
        // }
        html += '<div class="btn backToBeginning">Back to beginning</div>';
        brand.querySelector('.models').innerHTML = html || '<div class="models">No other models available</div>';
        // Next model listeners
        brand.querySelector('.models').addEventListener('mousedown', nextModel);
        
        // Scroll settings
    /*
        // Preventing overly fast scrolling 
        if (!canScroll) {
            setTimeout(() => {
                canScroll = true
            }, 600);
        }
        brand.querySelector('.models').addEventListener('mousewheel', () => {
            if (canScroll) {
                canScroll = false;
                nextModel();
            }
        });
        
        // Disabling default scrolling
        brand.querySelector('.models').addEventListener('scroll', () => {
            brand.querySelector('.models').scrollTo(0, 0);
        });
    */

        brand.querySelector('.backToBeginning').addEventListener('click', backToBeginning);
    });
}

function backToBeginning() {
    $.getJSON("data.json", data => {
        Object.keys(data.brands)
            .filter(key => key === document.querySelector('.brand_selected').dataset.brand)
            .map( b => {
                document.querySelector('.brand_selected .img').dataset.model = data.brands[b].covermodel;
                document.querySelector('.brand_selected .img img').src = data.brands[b].cover;
                document.querySelector('.brand_selected .title .brand_name').textContent = data.brands[b].covermodel;
            });    
    });
    document.querySelector('#more_phones').innerHTML = moreModelsTo(document.querySelector('.brand_selected'));
    // Animate new selected phone
    document.querySelector('.brand_selected .img img').classList.add('next_model_selected');
    setTimeout(() => {
        document.querySelector('.brand_selected .img img').classList.remove('next_model_selected');
    }, 1000);
    setTimeout(() => {
        adaptBackground();
    }, 100);
    const title = document.querySelector('.brand_selected .brand_name');
    title.classList.add('title_modified');
    setTimeout(() => {
        if (title.classList.contains('title_modified')) {
            title.classList.remove('title_modified');
        }
    }, 500);
    // Animate virtual scroll
    document.querySelector('.brand_selected .models').classList.toggle('next_model');
}

function nextModel() {
    currentModelGlobal = document.querySelectorAll('.brand_selected .model')[0]; 
    // No more models to display
    if (!currentModelGlobal) {
        return;
    }
    // Animate virtual scroll
    document.querySelector('.brand_selected .models').classList.toggle('next_model');

    let brand = document.querySelector('.brand_selected').dataset.brand;
    document.querySelector('.brand_selected .img').dataset.model = currentModelGlobal.dataset.model;
    $.getJSON("data.json", data => {
        document.querySelector('.brand_selected .img img').src = data.brands[brand].modelList[currentModelGlobal.dataset.model].img;
        document.querySelector('.brand_selected .img').dataset.model = currentModelGlobal.dataset.model;
        document.querySelector('.brand_selected .title .brand_name').textContent = currentModelGlobal.dataset.model;
    });
    moreModelsTo(document.querySelector('.brand_selected'));

    // Animate new selected phone
    document.querySelector('.brand_selected .img img').classList.add('next_model_selected');
    setTimeout(() => {
        document.querySelector('.brand_selected .img img').classList.remove('next_model_selected');
    }, 1000);

    setTimeout(() => {
        adaptBackground();
    }, 50);

    const title = document.querySelector('.brand_selected .brand_name');
    title.classList.add('title_modified');
    setTimeout(() => {
        if (title.classList.contains('title_modified')) {
            title.classList.remove('title_modified');
        }
    }, 500);
}

// Sets brand's title to the modelname and appends more button
function updateTitleTag(brand) {
    let title = brand.querySelector('.title span');
    title.classList.add('title_modified');
    setTimeout(() => {
        if (title.classList.contains('title_modified')) {
            title.classList.remove('title_modified');
        }
    }, 500);
    $.getJSON("data.json", data => {
        Object.keys(data.brands)
        .filter(key => key === brand.dataset.brand)
        .map(b => { 
            // Setting the modelname
            const modelname = brand.querySelector('.title span');
            modelname.textContent = document.querySelector('.brand_selected .img').dataset.model; 
            // Appending more button
            brand.querySelector('.title').innerHTML += '<div class="more_btn">Learn more</div>';
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
        document.querySelector('.more_btn').textContent = "Learn more";
        document.querySelector('#more_phones').classList.add('models');
        document.querySelector('#more_phones').classList.remove('info_display');
        resetEventListeners();
    } else {
        modelDisplayGlobal = moreInfoOn(brand.dataset.brand, modelname);
        document.querySelector('.more_btn').textContent = "More models";
        document.querySelector('#more_phones').classList.add('info_display');
        document.querySelector('#more_phones').classList.remove('models');
        document.querySelector('#more_phones').classList.remove('models_hover');
        document.querySelector('#more_phones').classList.remove('next_model');
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
                        displayArea.innerHTML = "<div class='info_box'>No info</div>";
                        return;
                    }
                    Object.keys(modelDataObject)
                        .filter(spec => spec !== "img")
                        .map(spec => {
                            displayArea.innerHTML += `
                                <div class="info_box">
                                    <div class="spec_word">${spec}</div>${modelDataObject[spec]}
                                </div>
                            `;
                        });
                    displayArea.innerHTML += `<div class="btn">Buy</div>`;
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
        // Setting back the brand's title
        let title = document.querySelector('.brand_selected .brand_name');
        title.textContent = title.parentElement.parentElement.dataset.brand;

        document.querySelector('.brand_selected').classList.remove('brand_selected');
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


// DROPDOWN
const triggers = document.querySelectorAll('.tiles .tile');
const background = document.querySelector('.dropdownBackground');
const nav = document.querySelector('.nav');
const navOptions = document.querySelectorAll('.tile_content');
const hoverBackground = document.querySelector('.dropdownOptionHover');

function handleEnter() {
    this.classList.add('trigger-enter');
    setTimeout(() => this.classList.contains('trigger-enter') && 
            this.classList.add('trigger-enter-active'), 300);
    background.classList.add('dropdown_open');

    const dropdown = this.querySelector('.tile_container');           
    const dropdownCoords = dropdown.getBoundingClientRect();
    const navCoords = nav.getBoundingClientRect();
    const coords = {
        height: dropdownCoords.height,
        width: dropdownCoords.width,
        top: dropdownCoords.top - navCoords.top,
        left: dropdownCoords.left - navCoords.left
    };
    background.style.setProperty('width', `${coords.width}px`);
    background.style.setProperty('height', `${coords.height}px`);  
    background.style.setProperty('transform', `translate(${coords.left}px, ${coords.top}px`);
}

function handleLeave() {
    this.classList.remove('trigger-enter');
    setTimeout(() => this.classList.remove('trigger-enter-active'), 150);
    background.classList.remove('dropdown_open');
}

function optionHoverEnter() {
    const thisCoords = this.getBoundingClientRect();
    const backgroundCoords = background.getBoundingClientRect();
    const coords = {
        height: thisCoords.height,
        width: backgroundCoords.width,
        top: thisCoords.top,
        left: backgroundCoords.left
    };
    if (this.parentElement.parentElement.classList.contains('trigger-enter-active'))  {
        this.style.color = "rgba(255, 255, 255, .75)";
        hoverBackground.style.opacity = "1";  
        hoverBackground.style.setProperty('width', `${coords.width+1}px`);
        hoverBackground.style.setProperty('height', `${coords.height+1}px`);  
        hoverBackground.style.setProperty('transform', `translate(${coords.left-0.5}px, ${coords.top-0.5}px`);
    }
}

function optionHoverLeave() {
    this.style.color = "black";
    hoverBackground.style.opacity = "0";
}

triggers.forEach(trigger => trigger.addEventListener('mouseenter', handleEnter));
triggers.forEach(trigger => trigger.addEventListener('mouseleave', handleLeave));
navOptions.forEach(navOption => navOption.addEventListener('mouseenter', optionHoverEnter));
navOptions.forEach(navOption => navOption.addEventListener('mouseleave', optionHoverLeave));