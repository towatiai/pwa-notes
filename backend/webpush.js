const webpush = require("web-push");

const publicVapidKey = 'BKg--YK7EoOKiNweaiRgbJwstL7zpxYhpuXdjXl1LHLNWT9QM-zxbOWrsE4GNSmDywq7qDIM3Yjs8qLzB2EWvbs';
const privateVapidKey = '9Opx_GfEFwEBcseSZrQ5mv1_F7zRPuJ40LLrmNZy5-8';

module.exports = () => {
  webpush.setVapidDetails(
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey,
  );
};
