const brands = document.querySelectorAll('.brand');
const logo = document.querySelector('.logo img');
const images = document.querySelectorAll('.phones img');

function selectPhone() {
    this.style.width =  document.body.getBoundingClientRect() + "px";
    brands.forEach(brand => {
        if (brand !== this)
           brand.style.width = 0;
    });
    setTimeout(() => {
        brands.forEach(brand => {
            if (brand !== this) {
                brand.style.display = "none";
            }
        })
    }, 1500); // Change to transition of fullscreening
}

function startPage() {
    brands.forEach(brand => {
        if (brand !== this)
            brand.style.display = "grid";
    });
    setTimeout(() => {
        brands.forEach(brand => {
            brand.style.width = "100%";
        })
    }, 200); 
}

brands.forEach(brand => brand.addEventListener('click', selectPhone));
logo.addEventListener('click', startPage);