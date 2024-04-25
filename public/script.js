'use strict';


// Login Register
const wrapper = document.querySelector('.login-wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnlogin-popup');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active-pop');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active-pop');
});

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});


/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

const navToggleEvent = function (elem) {
  for (let i = 0; i < elem.length; i++) {
    elem[i].addEventListener("click", function () {
      navbar.classList.toggle("active");
      overlay.classList.toggle("active");
    });
  }
}

navToggleEvent(navElemArr);
navToggleEvent(navLinks);



/**
 * header sticky & go to top
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

  if (window.scrollY >= 200) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }

});

//show less button
document.addEventListener('DOMContentLoaded', function () {
  const loadMoreBtn = document.getElementById('load-more');
  const showLessBtn = document.getElementById('show-less');
  let currentItem = 3;

  // Function to hide all elements
  function hideAllElements() {
    const elementList = document.querySelectorAll('.popular-list li');
    elementList.forEach((element, index) => {
      if (index >= currentItem) {
        element.style.display = 'none';
      } else {
        element.style.display = 'flex';
      }
    });
  }







  // Ambil semua elemen gambar
  const images = document.querySelectorAll('.promo-list img');

  
  document.querySelectorAll('.promo-card').forEach(function(card) {
    card.addEventListener('click', function() {
      alert('Successfully redeemed!');
    });
  });




  // Initial hide for all elements except the first 3
  hideAllElements();

  // Event listener for Load More button
  loadMoreBtn.addEventListener('click', () => {
    const elementList = document.querySelectorAll('.popular-list li');
    
    for (let i = currentItem; i < currentItem + 3 && i < elementList.length; i++) {
      elementList[i].style.display = 'flex';
    }
    
    currentItem += 3;

    if (currentItem >= elementList.length) {
      loadMoreBtn.style.display = 'none';
      showLessBtn.style.display = 'flex'; // Show the "Show Less" button
    }
  });

  // Event listener for Show Less button
  showLessBtn.addEventListener('click', () => {
    currentItem = 3; // Reset the currentItem to 3
    hideAllElements(); // Hide all elements
    loadMoreBtn.style.display = 'flex'; // Show the "Load More" button
    showLessBtn.style.display = 'none'; // Hide the "Show Less" button
  });
});

//LOAD MORE BAGIAN PACKAGES

document.addEventListener('DOMContentLoaded', function () {
  const viewMoreBtn = document.getElementById('view-more');
  const viewLessBtn = document.getElementById('view-less');
  let currentItem = 8;

  // Function to hide all elements
  function hideAllElement() {
    const elementList = document.querySelectorAll('.package-list li');
    elementList.forEach((element, index) => {
      if (index >= currentItem) {
        element.style.display = 'none';
      } else {
        element.style.display = 'flex';
      }
    });
  }

  // Initial hide for all elements except the first 3
  hideAllElement();

  // Event listener for Load More button
  viewMoreBtn.addEventListener('click', () => {
    const elementList = document.querySelectorAll('.package-list li');
    
    for (let i = currentItem; i < currentItem + 12 && i < elementList.length; i++) {
      elementList[i].style.display = 'flex';
    }
    
    currentItem += 12 ;

    if (currentItem >= elementList.length) {
      viewMoreBtn.style.display = 'none';
      viewLessBtn.style.display = 'block'; // Show the "Show Less" button
    }
  });

  // Event listener for Show Less button
  viewLessBtn.addEventListener('click', () => {
    currentItem = 8; // Reset the currentItem to 3
    hideAllElement(); // Hide all elements
    viewMoreBtn.style.display = 'flex'; // Show the "Load More" button
    viewLessBtn.style.display = 'none'; // Hide the "Show Less" button
  });
});


app.controller('promoCtrl', function($scope) {
  $scope.promoImage = 'images/PROMOCUL.jpg';
  $scope.promoTitle = 'Special Promo!';
  $scope.promoDescription = 'Get exclusive discounts on our amazing Vacation.';
  $scope.promoLink = 'https://www.ancol.com/promo';
  $scope.promoButton = 'Redeem Now !!';
});

//carousel
var slideIndex = 1;
        showSlide(slideIndex);

        function nextSlide(n){
            showSlide(slideIndex += n);
        }

        function dotSlide(n){
            showSlide(slideIndex = n);
        }

        function showSlide(n){
            var i;
            var slides = document.getElementsByClassName("imgslide");
            var dots = document.getElementsByClassName("dot");

            if (n > slides.length){
                slideIndex = 1;
            }

            if (n < 1){
                slideIndex = slides.length;
            }

            for (i = 0; i < slides.length; i++){
                slides[i].style.display = "none";
            }

            for (i = 0; i < dots.length; i++){
                dots[i].className = dots[i].className.replace(" active", "");
            }

            slides[slideIndex - 1].style.display = "block";
            dots[slideIndex - 1].className += " active";
        }


        

// Test JS
$(document).ready(function() {
  $('#myForm').submit(function(event) {
      event.preventDefault(); // Mencegah form untuk langsung di-submit

      // Mengambil data dari form
      var formData = {
          name: $('#name').val(),
          email: $('#email').val()
      };

      // Mengirim data ke server menggunakan AJAX
      $.ajax({
          type: 'POST',
          url: '/simpan-data', // URL endpoint server
          data: formData,
          success: function(response) {
              console.log('Data berhasil disimpan ke MongoDB:', response);
          },
          error: function(error) {
              console.error('Gagal menyimpan data:', error);
          }
      });
  });
});

    // Menangkap tombol "Book Now"
    var bookNowBtn = document.getElementById('bookNowBtn');
    // Menambahkan event listener untuk menanggapi klik
    bookNowBtn.addEventListener('click', function() {
        // Menampilkan alert ketika tombol diklik
        alert('Success booking!');
    });

