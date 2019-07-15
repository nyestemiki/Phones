const brands = document.querySelectorAll('.brand');
const logo = document.querySelector('.logo img');
const images = [...document.querySelectorAll('.phones img')];

function selectPhone() {
    document.title = [...document.querySelectorAll('.brand__name')].
        filter(b => b.dataset.brand === this.dataset.brand)[0].textContent;
    // Making the selected brand full-screen
    this.style.width =  document.body.getBoundingClientRect() + "px";
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
                image.style.opacity = 0;
        })
    }, 600);
    // Hiding the not-selected brands
    setTimeout(() => {
        brands.forEach(brand => {
            if (brand !== this) {
                brand.style.display = "none";
            }
        })
    }, 2000); // Change to transition of fullscreening
}

function startPage() {
    document.title = "Phones";

    // Display the hidden brands
    brands.forEach(brand => {
        if (brand !== this)
            brand.style.display = "grid";
    });
    // Animating in the hidden brands
    setTimeout(() => {
        brands.forEach(brand => {
            brand.classList.remove('brand_nowidth');
        });
    }, 200); 
    // Animating in the hidden images
    setTimeout(()=> {
        images.forEach(image => {
            if(image.style.opacity == 0)
                image.style.opacity = 1.0;
        });
    }, 500);
}

brands.forEach(brand => brand.addEventListener('click', selectPhone));
logo.addEventListener('click', startPage);