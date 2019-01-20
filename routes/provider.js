const express = require('express');
const router = express.Router();
const User = require('../src/User');
const Provider = require('../models/provider.model');
const pick = require('lodash/pick');

router.post('/create', async (req, res) => {
    let didAddToFirebase = false;
    try {
        const {email, password, phone, address, name} = req.body;
        const firebaseResult = await User.createUser(email, password);
        didAddToFirebase = true;
        const id = firebaseResult.user.uid;
        await Provider.addProvider({email, phone, address, name, id});
        const provider = await Provider.getProviderById(id);
        res.status(200).json({orgData: pick(provider, ['name', 'address', 'email', 'provider_id', 'phone'])});
    } catch (e) {
        console.log('e', e);
        if (didAddToFirebase) {
            await User.deleteUser();
        }
        res.status(500).send(e);
    }
});

// router.post('/getCurrentSignedInAccount', (req, res) => {
//     try {
//         User.getCurrentUser((err, user) => {
//             if (err) {
//                 throw err;
//             } else {
//                 res.json(user);
//             }
//         });
//     } catch (e) {
//         console.log('Error:', e);
//         res.status(500).send('An error occurred on the server. Check server log for more info.');
//     }
//
// });
// router.post('/createAccount', async (req, res) => {
//     try {
//         const {email, password} = req.body;
//         const result = await User.createUser(email, password);
//         res.json(result);
//     } catch (e) {
//         console.log('Error:', e);
//         res.status(500).send('An error occurred on the server. Check server log for more info.');
//     }
// });

module.exports = router;