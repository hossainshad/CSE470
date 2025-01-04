const rentalRequestsModal = {
    init: function() {
        document.addEventListener('DOMContentLoaded', function() {
            const showRequestsBtn = document.getElementById('showRequestsBtn');
            if (showRequestsBtn) {
                showRequestsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    rentalRequestsModal.show();
                });
            }

            const closeBtn = document.querySelector('#rentalRequestsModal .close-modal');
            if (closeBtn) {
                closeBtn.addEventListener('click', rentalRequestsModal.close);
            }
        });
    },

    show: function() {
        const modal = document.getElementById('rentalRequestsModal');
        if (modal) {
            modal.style.display = 'block';
            this.fetchRequests();
        }
    },

    close: function() {
        const modal = document.getElementById('rentalRequestsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },
    fetchRequests: function() {
        fetch('/owner/rental-requests')
            .then(function(response) {
                return response.json();
            })
            .then(function(requests) {
                rentalRequestsModal.displayRequests(requests);
            })
            .catch(function(error) {
                console.error('Error:', error);
            });
    },

    displayRequests: function(requests) {
        const requestsList = document.getElementById('requestsList');
        if (!requestsList) return;

        requestsList.innerHTML = requests.length === 0 ? 
            '<p>No pending requests</p>' : 
            requests.map(function(request) {
                return `
                    <div class="request-card">
                        <p><strong>Flat:</strong> ${request.flat_number}</p>
                        <p><strong>Requester:</strong> ${request.requester_name}</p>
                        <p><strong>Contact:</strong> ${request.requester_phone}</p>
                        <p><strong>Email:</strong> ${request.requester_email}</p>
                        <p><strong>Date:</strong> ${new Date(request.request_date).toLocaleDateString()}</p>
                        <div class="request-actions">
                            <button class="reject-btn" onclick="rentalRequestsModal.rejectRequest(${request.request_id})">
                                Reject Request
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
    },
    rejectRequest: function(requestId) {
        if (confirm('Are you sure you want to reject this request?')) {
            fetch(`/owner/reject-request/${requestId}`, {
                method: 'POST'
            })
            .then(function(response) {
                if (response.ok) {
                    rentalRequestsModal.fetchRequests();
                }
            })
            .catch(function(error) {
                console.error('Error:', error);
            });
        }
    }
};

rentalRequestsModal.init();