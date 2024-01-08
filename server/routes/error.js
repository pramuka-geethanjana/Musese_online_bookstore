
const express = require('express');
const router = express.Router();

router.all(`*`, async (req, res) => {
    res.status(404).json({ message: 'Page Not Found!' });

});


module.exports = router;