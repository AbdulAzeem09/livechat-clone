const geoip = require('geoip-lite');

/**
 * Get geolocation data from IP address
 */
const getGeoLocation = (ip) => {
  try {
    // Remove localhost IPs
    if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
      return {
        country: 'Unknown',
        city: 'Unknown',
        timezone: 'UTC',
        ll: [0, 0],
      };
    }

    const geo = geoip.lookup(ip);
    
    if (!geo) {
      return {
        country: 'Unknown',
        city: 'Unknown',
        timezone: 'UTC',
        ll: [0, 0],
      };
    }

    return {
      country: geo.country || 'Unknown',
      city: geo.city || 'Unknown',
      timezone: geo.timezone || 'UTC',
      ll: geo.ll || [0, 0],
      region: geo.region || '',
    };
  } catch (error) {
    return {
      country: 'Unknown',
      city: 'Unknown',
      timezone: 'UTC',
      ll: [0, 0],
    };
  }
};

/**
 * Get IP address from request
 */
const getIpAddress = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip
  );
};

module.exports = {
  getGeoLocation,
  getIpAddress,
};
