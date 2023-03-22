import 'leaflet/dist/leaflet.css';
import classnames from 'classnames';
import { Icon, Marker } from 'leaflet';
import { Offers, City } from '../../types/offers';
import useMap from '../../hooks/use-map';
import { useEffect, useRef } from 'react';
import { URL_MARKER_CURRENT, URL_MARKER_DEFAULT } from './constants';

type MapProps = {
  className: string;
  city: City;
  offers: Offers[];
  selectedOfferId?: number | null;
};

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

const Map = ({ className, city, offers, selectedOfferId }: MapProps) => {
  const mapRef = useRef(null);

  const map = useMap(mapRef, city);

  useEffect(() => {
    if (map) {
      offers.forEach((offer) => {
        const marker = new Marker({
          lat: offer.location.latitude,
          lng: offer.location.longitude,
        });

        marker
          .setIcon(
            selectedOfferId && offer.id === selectedOfferId
              ? currentCustomIcon
              : defaultCustomIcon
          )
          .addTo(map);
      });
    }
  }, [map, offers, selectedOfferId]);

  return (
    <section
      className={classnames('map', className)}
      style={{ height: '562px' }}
      ref={mapRef}
    >
    </section>
  );
};

export default Map;
