const { Router } = require('express');

const authRoutes         = require('./auth.routes');
const artistsRoutes      = require('./artists.routes');
const bookingsRoutes     = require('./bookings.routes');
const availabilityRoutes = require('./availability.routes');
const paymentsRoutes     = require('./payments.routes');
const reviewsRoutes      = require('./reviews.routes');
const clientsRoutes      = require('./clients.routes');

// Catalogs
const tattooStylesRoutes   = require('./tattooStyles.routes');
const tattooTypesRoutes    = require('./tattooTypes.routes');
const bodyZonesRoutes      = require('./bodyZones.routes');
const tattooSizesRoutes    = require('./tattooSizes.routes');
const paymentMethodsRoutes = require('./paymentMethods.routes');
const uploadRoutes         = require('./upload.routes');
const citiesRoutes         = require('./cities.routes');
const servicesRoutes     = require('./services.routes');
const portfolioRoutes    = require('./portfolio.routes');

const router = Router();

router.use('/auth',            authRoutes);
router.use('/artists',         artistsRoutes);
router.use('/bookings',        bookingsRoutes);
router.use('/payments',        paymentsRoutes);
router.use('/reviews',         reviewsRoutes);
router.use('/clients',         clientsRoutes);
router.use('/cities',         citiesRoutes);
router.use('/services',        servicesRoutes);
router.use('/portfolio',       portfolioRoutes);

// Availability is nested: /artists/:artist_id/availability/...
router.use('/artists',         availabilityRoutes);

// Catalogs
router.use('/tattoo-styles',   tattooStylesRoutes);
router.use('/tattoo-types',    tattooTypesRoutes);
router.use('/body-zones',      bodyZonesRoutes);
router.use('/tattoo-sizes',    tattooSizesRoutes);
router.use('/payment-methods', paymentMethodsRoutes);
router.use('/upload',          uploadRoutes);

module.exports = router;