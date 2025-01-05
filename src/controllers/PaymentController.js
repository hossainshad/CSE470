import Rentals from '../models/Rentals.js';
import Payments from '../models/Payments.js';

export const paymentPage = async (req, res) => {
    const user = req.session.user;

    try {
        if (user.o_flag) {
            // Fetch tenants' rent statuses for owners
            const tenants = await Rentals.find({ owner_username: user.username });
            const tenantPayments = await Promise.all(tenants.map(async rental => {
                // Fetch all payments for this tenant in the current month
                const payments = await Payments.find({
                    rental_id: rental.rental_id,
                    payment_month: new Date().getMonth() + 1,
                    payment_year: new Date().getFullYear(),
                });
                
                const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
                const status = totalPaid >= rental.rent_amount ? 'Paid' : 'Unpaid';

                return {
                    tenant_username: rental.tenant_username,
                    rent_amount: rental.rent_amount,
                    status,
                };
            }));
            res.render('paymentPage', { user, tenantPayments, isOwner: true });
        } else if (user.t_flag) {
            // Fetch tenant's own payment status
            const rental = await Rentals.findOne({ tenant_username: user.username });
            if (!rental) {
                return res.status(404).send('No rental agreement found for this user.');
            }

            // Fetch all payments for the tenant for the current month
            const payments = await Payments.find({
                rental_id: rental.rental_id,
                payment_month: new Date().getMonth() + 1,
                payment_year: new Date().getFullYear(),
            });

            const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
            const remainingAmount = rental.rent_amount - totalPaid;

            res.render('paymentPage', {
                user,
                rental,
                payment: payments,
                totalPaid,
                remainingAmount,
                isOwner: false,
            });
        } else {
            res.status(403).send('Access Denied');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const handlePayment = async (req, res) => {
    try {
        const user = req.session.user;

        if (!user.t_flag) {
            return res.status(403).send('Unauthorized access');
        }

        const { amount } = req.body;
        const rental = await Rentals.findOne({ tenant_username: user.username });
        if (!rental) {
            return res.status(404).send('No rental agreement found for this user.');
        }

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        // Check if the payment already exists for this month
        const existingPayments = await Payments.find({
            rental_id: rental.rental_id,
            payment_month: currentMonth,
            payment_year: currentYear,
            tenant_username: user.username,
        });

        // Calculate the total paid so far
        const totalPaid = existingPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const remainingAmount = rental.rent_amount - totalPaid;

        // Validate payment amount
        if (amount > remainingAmount) {
            return res.status(400).send(`Payment exceeds the remaining amount. You owe $${remainingAmount}.`);
        }

       
        await Payments.create({
            rental_id: rental.rental_id,
            amount,
            payment_month: currentMonth,
            payment_year: currentYear,
            paid_date: new Date(),
            owner_username: rental.owner_username,
            tenant_username: rental.tenant_username,
        });

        
        res.redirect('/payment');
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).send('Internal server error');
    }
};

