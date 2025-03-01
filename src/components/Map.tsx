
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';

interface MapProps {
  className?: string;
  coordinates?: [number, number] | null;
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ className, coordinates, zoom }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGxxZ3ljemowMHd3MmpxcjRxc2xtZm1sIn0.qHQqRNvuGwn_2CsGh0CCQQ';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      zoom: zoom || 1.5,
      center: coordinates || [30, 15],
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.scrollZoom.disable();

    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(20, 20, 20)',
        'high-color': 'rgb(40, 40, 45)',
        'horizon-blend': 0.2,
      });
    });

    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !coordinates) return;

    marker.current?.remove();
    marker.current = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map.current);

    map.current.flyTo({
      center: coordinates,
      zoom: zoom || map.current.getZoom(),
      duration: 2000,
      essential: true
    });
  }, [coordinates, zoom]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-full h-full ${className}`}
    >
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </motion.div>
  );
};

export default Map;
