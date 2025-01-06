import Rentals from '../models/Rentals.js';
import Payments from '../models/Payments.js';

export const paymentPage = async (req, res) => {
    const user = req.session.user;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    try {
        let tenantPayments = [];
        let tenantData = null;

        if (user.o_flag) {
            const ownedRentals = await Rentals.find({ owner_username: user.username });
            tenantPayments = await Promise.all(ownedRentals.map(async rental => {
                const payments = await Payments.find({
                    rental_id: rental.rental_id,
                    payment_month: currentMonth,
                    payment_year: currentYear,
                });
                
                const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
                return {
                    tenant_username: rental.tenant_username,
                    rent_amount: rental.rent_amount,
                    totalPaid,
                    status: totalPaid >= rental.rent_amount ? 'Paid' : 'Unpaid'
                };
            }));
        }

        const userRental = await Rentals.findOne({ tenant_username: user.username });
        if (userRental) {
            const payments = await Payments.find({
                rental_id: userRental.rental_id,
                payment_month: currentMonth,
                payment_year: currentYear,
            });

            const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
            const remainingAmount = userRental.rent_amount - totalPaid;

            tenantData = {
                rental: userRental,
                payments,
                totalPaid,
                remainingAmount
            };
        }

        res.render('paymentPage', {
            user,
            tenantPayments,
            tenantData,
            isOwner: user.o_flag,
            isTenant: !!userRental 
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const handlePayment = async (req, res) => {
    try {
        const user = req.session.user;
        const { amount } = req.body;
        
        const rental = await Rentals.findOne({ tenant_username: user.username });
        if (!rental) {
            return res.status(404).send('No rental agreement found for this user.');
        }

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const existingPayments = await Payments.find({
            rental_id: rental.rental_id,
            payment_month: currentMonth,
            payment_year: currentYear,
            tenant_username: user.username,
        });

        const totalPaid = existingPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const remainingAmount = rental.rent_amount - totalPaid;

        if (amount > remainingAmount) {
            return res.status(400).send(`Payment exceeds the remaining amount. You owe $${remainingAmount}.`);
        }

        const newPayment = new Payments({
            rental_id: rental.rental_id,
            amount: Number(amount),
            payment_month: currentMonth,
            payment_year: currentYear,
            paid_date: new Date(),
            owner_username: rental.owner_username,
            tenant_username: rental.tenant_username,
        });

        await newPayment.save();
        res.redirect('/payment');
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).send('Internal server error');
    }
};