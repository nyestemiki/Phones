const brands = document.querySelectorAll('.brand');
const logo = document.querySelector('.logo img');
const images = [...document.querySelectorAll('.phones img')];

function selectPhone() {
    // Making the selected brand full-screen
    this.style.width =  document.body.getBoundingClientRect() + "px";
    // Hiding the not-selected brands
    brands.forEach(brand => {
        if (brand !== this) {
           brand.style.width = 0;
        }
    });
    // Animating out the images
    setTimeout(() => {
        images.forEach(image => {
            if(image.dataset.brand !== this.dataset.brand)
                image.style.opacity = 0;
        })
    }, 1000);
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
    // Display the hidden brands
    brands.forEach(brand => {
        if (brand !== this)
            brand.style.display = "grid";
    });
    // Animating in the hidden brands
    setTimeout(() => {
        brands.forEach(brand => {
            brand.style.width = "100%";
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