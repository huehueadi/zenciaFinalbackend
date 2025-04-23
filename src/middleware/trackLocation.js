import axios from 'axios';
import IpLocation from '../models/ipLocation.js';
const IPINFO_API_TOKEN = process.env.IPINFO_API_TOKEN || 'eb327d51a73b1b'; // Use env variable

export const trackUserLocation = async (req, res, next) => {
  console.log('trackUserLocation middleware started');
  try {
    // Step 1: Extract client-provided location
    let location = null;
    if (req.headers['x-user-location']) {
      console.log('Client location header received:', req.headers['x-user-location']);
      try {
        location = JSON.parse(req.headers['x-user-location']);
        if (!location.latitude || !location.longitude) {
          console.log('Invalid client location data: missing latitude/longitude');
          location = null;
        } else {
          console.log('Valid client location:', location);
        }
      } catch (error) {
        console.error('Error parsing client location:', error.message);
      }
    } else {
      console.log('No client location header provided');
    }

    // Step 2: Fetch IP address
    let ip = req.ip || '';
    if (req.headers['x-forwarded-for']) {
      ip = req.headers['x-forwarded-for'].split(',')[0].trim();
    }
    console.log('IP address:', ip);

    // Validate IP
    if (!ip || ip === '::1' || ip === '127.0.0.1') {
      console.log('Invalid or localhost IP detected');
      if (!location) {
        console.log('No valid location data, skipping storage');
        return next();
      }
    }

    // Step 3: Fetch IP-based location if no client location
    let ipData = {};
    if (!location && ip) {
      console.log('Fetching IP-based location from IPInfo');
      try {
        const url = `https://ipinfo.io/${ip}/json?token=${IPINFO_API_TOKEN}`;
        const response = await axios.get(url);
        ipData = response.data;
        console.log('IPInfo response:', ipData);
      } catch (error) {
        console.error('Error fetching IPInfo data:', error.message);
      }
    }

    // Step 4: Prepare location data
    const finalLocation = location || (ipData.loc ? {
      latitude: parseFloat(ipData.loc.split(',')[0]),
      longitude: parseFloat(ipData.loc.split(',')[1])
    } : null);

    if (!finalLocation) {
      console.log('No valid location data available, skipping storage');
      return next();
    }
    console.log('Final location data:', finalLocation);

    // Step 5: Store location data in database
    const newIpLocation = new IpLocation({
      ip: ipData.ip || ip,
      hostname: ipData.hostname || 'unknown',
      city: ipData.city || 'unknown',
      region: ipData.region || 'unknown',
      country: ipData.country || 'unknown',
      latitude: finalLocation.latitude,
      longitude: finalLocation.longitude,
      org: ipData.org || 'unknown',
      postal: ipData.postal || 'unknown',
      timezone: ipData.timezone || 'unknown',
      source: location ? 'client' : 'ipinfo'
    });

    try {
      await newIpLocation.save();
      console.log('Location data stored successfully:', {
        ip: newIpLocation.ip,
        latitude: newIpLocation.latitude,
        longitude: newIpLocation.longitude,
        source: newIpLocation.source
      });
    } catch (error) {
      console.error('Error saving to IpLocation:', error.message);
      throw error; // Rethrow to catch in outer try-catch
    }

    // Step 6: Attach location to request
    req.location = finalLocation;
    console.log('trackUserLocation middleware completed');
    next();

  } catch (error) {
    console.error('Error in trackUserLocation middleware:', error.message);
    next(error); // Pass to error-handling middleware
  }
};