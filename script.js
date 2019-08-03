const brands = document.querySelector('.brands');

// Loading the brands + eventlisteners to select them
$.getJSON("data.json", data => {
    let index = 1;
    // Loading brands
    Object.keys(data.brands).forEach(brand => {
        brands.innerHTML += `
            <div class="brand brand${index}" data-brand="${index++}">
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
        brand.addEventListener('click', () => hideBrandsExceptFor(brand));
    });
});

// Hides the brands except for the given 'brand'
function hideBrandsExceptFor(brand) {
    [...document.querySelectorAll('.brand')].map(instance => {
        if (instance !== brand) {
            instance.classList.add('brand_hide');
        }
    });
}