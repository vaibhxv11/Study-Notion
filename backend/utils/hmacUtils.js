const crypto = require("crypto");

function hmac_rawurlsafe_base64_string(distinct_id, secret) {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(distinct_id)
    .digest("base64url");
  return hash.trimEnd("=");
}


module.exports = { hmac_rawurlsafe_base64_string };
