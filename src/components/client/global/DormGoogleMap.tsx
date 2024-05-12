'use client';

import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = (props: {
  lat: number;
  lng: number;
  text: string;
}) => (
  <div>
    <FontAwesomeIcon icon={faLocationDot} />
  </div>
);

const DormGoogleMap = () => {
  const defaultProps = {
    center: {
      lat: 10.8277387768551,
      lng: 106.70000250031529,
    },
    zoom: 17,
  };

  return (
    <div style={{ height: '350px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyAdjgjOOi8NWuDflG4tb__3UFWuV0FMSEg' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={10.8277387768551}
          lng={106.70000250031529}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
};

export default DormGoogleMap;
