document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('propertyModal');
    const closeBtn = document.querySelector('.close-modal');
    const addPropertyLinks = document.querySelectorAll('a[href="/owner/add-property"]');

    addPropertyLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});