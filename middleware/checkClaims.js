const { claimCheck } = require('express-oauth2-jwt-bearer');

const checkClaims = (permissions) =>
  claimCheck((claims) => claims.permissions.includes(permissions));

module.exports = checkClaims;
