import React, { useState, useEffect } from 'react';
import { getDistrictList } from '../api/ejmApi';

const { naver } = window;
const defaultLevel = 1;
const defaultBounds = {
  _ne: { _lat: 38.83004, _lng: 129.79947 },
  _sw: { _lat: 32.65807, _lng: 124.48013 },
};

export default function Map() {
  const [naverMap, setNaverMap] = useState({});
  const [bounds, setBounds] = useState(defaultBounds);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(36.4658, 127.96345),
      zoom: 8,
    });

    naver.maps.Event.addListener(map, 'init', function () {
      setNaverMap(map);
    });
  }, []);

  useEffect(() => makeMarker(), [bounds, naverMap]);

  const makeMarker = () => {
    getDistrictList(defaultLevel, bounds).then((dstrict) => {
      markers &&
        markers.map((marker) => {
          if (marker) marker.setMap(null);
        });

      const newMarker =
        dstrict &&
        dstrict.map((item) => {
          if (item.allCnt === 0) return;

          return new naver.maps.Marker({
            position: new naver.maps.LatLng(item.latitude, item.longitude),
            map: naverMap,
            title: item.districtNm,
            icon: {
              size: new naver.maps.Size(100, 32),
              anchor: new naver.maps.Point(16, 16),
              content: makeIconContent(item),
            },
          });
        });
      setMarkers(newMarker);
    });
  };

  naver.maps.Event.addListener(naverMap, 'dragend', function () {
    setBounds(naverMap.getBounds());
  });

  return <div id='map'></div>;
}

function makeIconContent(item) {
  return `
    <div class='marker'>
      <div class='title'>${item.districtNm}</div>
      <div class='content'>
        <ul>
          <li>전체 ${item.allCnt}</li>
          ${
            item.reDevelopmentCnt
              ? `<li>재개발 ${item.reDevelopmentCnt}</li>`
              : ''
          }  
          ${
            item.reConstructionCnt
              ? `<li>재건축 ${item.reConstructionCnt}</li>`
              : ''
          }  
          ${
            item.maintenanceSmallCnt
              ? `<li>가로주택 ${item.maintenanceSmallCnt}</li>`
              : ''
          }  
        </ul>              
      </div>
    </div>
  `;
}
