function distance(lat1,lat2, lon1, lon2) {
    // Mall Taman Anggrek
    // lat: -6.1785831
    // lng: 106.7922128

    // Grand Indonesia
    // lat: -6.1951801
    // lng: 106.8204412

    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.

    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
  
    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2),2);
  
    let c = 2 * Math.asin(Math.sqrt(a));
  
    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;
  
    // calculate the result
    return(c * r);
}

// function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
//     var R = 6371; // Radius of the earth in km
//     var dLat = deg2rad(lat2-lat1);  // deg2rad below
//     var dLon = deg2rad(lon2-lon1); 
//     var a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2)
//       ; 
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//     var d = R * c; // Distance in km
//     return d;
// }

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

const myHouse = (-6.2146223, 106.8957853);
const kemayoran = (-6.161683, 106.8415304);
const user = (-6.18983081903681, 106.79983291748873);
const TOWER = (-6.201799749472874, 106.80109242061691);
const PI = (-6.193994296143916, 106.82224202911836)
//   module.exports = { distance }

const result = distance(-6.2146223, -6.161683, 106.8957853, 106.8415304)
console.log(result);