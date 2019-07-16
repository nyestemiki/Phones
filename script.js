const brands = document.querySelectorAll('.brand');
const logo = document.querySelector('.logo img');
const images = [...document.querySelectorAll('.phones img')];

let lastSelected;

// Hides not-selected brands
function selectPhone() {
    document.title = [...document.querySelectorAll('.brand__name')].
        filter(b => b.dataset.brand === this.dataset.brand)[0].textContent;

    // Hiding the not-selected brands
    brands.forEach(brand => {
        if (brand !== this) {
           brand.classList.add('brand_nowidth');
        }
    });

    // Animating out the images
    setTimeout(() => {
        images.forEach(image => {
            if(image.dataset.brand !== this.dataset.brand)
                image.classList.add('img_hide');
        })
    }, 300);

    setTimeout(() => {
        this.classList.add('phone_selected');
        this.querySelector('.brand__name').classList.add('brand_name_hide');
        this.querySelector('.info').classList.add('info_show');
        this.querySelector('.models').classList.add('models_show');
    }, 1000);

    lastSelected = this;

    const modelImages = [...this.querySelectorAll('img')];
    
    setTimeout(() => {
        modelImages.forEach(model => {
            model.classList.remove('img_hide');
        });
    }, 400);

    setTimeout(() => {
        this.querySelector('.models').style.display = "flex";
    }, 1000);

    
    this.classList.remove('brand_hover');
}

// Shows all the brands
function startPage() {
    document.title = "Phones";

    // Displaying the hidden brands
    brands.forEach(brand => {
        brand.classList.remove('brand_nowidth');
    });

    // Animating in the hidden images
    setTimeout(()=> {
        images.forEach(image => {
            if(image.style.opacity == 0)
                image.classList.remove('img_hide');
        });
    }, 300);

    lastSelected.classList.remove('phone_selected');
    lastSelected.querySelector('.brand__name').classList.remove('brand_name_hide');
    lastSelected.querySelector('.info').classList.remove('info_show');
    lastSelected.querySelector('.models').classList.remove('models_show');
    lastSelected.querySelector('.models').style.display = "none";

}

brands.forEach(brand => brand.addEventListener('click', selectPhone));
logo.addEventListener('click', startPage);