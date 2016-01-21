var express = require('express');
var router = express.Router();

router.get('', function( req, res ) {
  res.send('<html><body>' +
    '<p>It works! Now point your app and monitor app to connect to this server.</p>' +
    '</body></html>');
});

module.exports = router;
