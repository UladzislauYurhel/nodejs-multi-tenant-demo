var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hi', (req, res, next) => {
  try {
    const tenantLogonName = req.authInfo.getLogonName();
    const tenantSubdomain = req.authInfo.getSubdomain();
    const tenantZoneId = req.authInfo.getZoneId();
    const response = `Hi ${tenantLogonName}, your tenant sub-domain is "${tenantSubdomain}", zone is "${tenantZoneId}"`
    res.send(response);
  } catch (e) {
    const message = 'No tenant information found!';
    console.log(message);
    res.send(message);
  }
});

//******************************** API Callbacks for multitenancy ********************************
/**
 * Request Method Type - PUT
 * When a consumer subscribes to this application, SaaS Provisioning invokes this API.
 * We return the SaaS application url for the subscribing tenant.
 * This URL is unique per tenant and each tenant can access the application only through its URL.
 */
router.put('/callback/v1.0/tenants/*', (req, res) => {
  const consumerSubdomain = req.body.subscribedSubdomain;
  const customDomain = 'cfapps.us10.hana.ondemand.com'
  const tenantAppURL  = `https://${consumerSubdomain}-dev-nodeapp.${customDomain}`
  res.status(200).send(tenantAppURL);
});
/**
 * Request Method Type - DELETE
 * When a consumer unsubscribes this application, SaaS Provisioning invokes this API.
 * We delete the consumer entry in the SaaS Provisioning service.
 */
router.delete('/callback/v1.0/tenants/*', (req, res) => {
  console.log(req.body);
  res.status(200).send("deleted");
});
//************************************************************************************************

module.exports = router;
