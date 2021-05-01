
export function getLngLat(e) {
    return {
        lng: e.lnglat.getLng(),
        lat: e.lnglat.getLat(),
        value: [e.lnglat.getLng(), e.lnglat.getLat()]
    }
}

// export function addressSetMapCenter(address, map) {
//     AMap.plugin('AMap.Geocoder', function () {
//         var geocoder = new AMap.Geocoder();
//         geocoder.getLocation(address, function (status, result) {
//             //提示error , INVALID_USER_KEY
//             console.log(status);
//             console.log(result);

//             if (status === 'complete' && result.info === 'OK') {
//                 console.log(result);
//                 let lat = result.geocodes[0].location.lat;
//                 let lng = result.geocodes[0].location.lng;
//                 map.setCenter([lng, lat]);
//             } else {
//                 console.error('获取失败');
//             }

//         })
//     })
// }

export function addressSetMapCenter(address, map) {
    var geocoder = new AMap.Geocoder();
    geocoder.getLocation(address, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
            let lat = result.geocodes[0].location.lat;
            let lng = result.geocodes[0].location.lng;
            map.setCenter([lng, lat]);
        } else {
            console.error('获取失败');
        }
    })
}