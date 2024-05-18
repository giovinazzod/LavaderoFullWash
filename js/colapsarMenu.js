document.addEventListener('DOMContentLoaded', function () {
    var navbarToggler = document.getElementById('navbar-toggler');
    var navLinks = document.querySelectorAll('.nav-link');
    var navbarCollapse = document.getElementById('navbarNav');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
});