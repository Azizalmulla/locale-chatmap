
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MapProps {
  className?: string;
  coordinates?: [number, number] | null;
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ className, coordinates, zoom }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYXppemFsbXVsbGEiLCJhIjoiY203cHN0cDZkMDcyZzJqc2J2bWpoY2FocCJ9.w3V37uLN8-_q19JDcc1oug';
    
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !map.current) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        
        marker.current?.remove();
        marker.current = new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map.current);

        map.current.flyTo({
          center: [longitude, latitude],
          zoom: 12,
          duration: 2000,
          essential: true
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-full h-full relative ${className}`}
    >
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      <div className="absolute top-4 left-4 right-4 z-10 flex">
        <form onSubmit={handleSearch} className="flex w-full max-w-md mx-auto gap-2 bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-gray-700">
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location..."
            className="flex-1 bg-transparent border-gray-700"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isSearching}
            className="bg-primary/80 hover:bg-primary"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default Map;
