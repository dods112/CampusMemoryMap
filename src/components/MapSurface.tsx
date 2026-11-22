import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import type { Pin } from '../types'
import { CAMPUS_CENTER } from '../store'

type Props = {
  pins?: Pin[]
  onSelect?: (pin: Pin) => void
  onLocationClick?: (lat: number, lng: number) => void
  pickedLocation?: { lat: number; lng: number } | null
  heatmap?: boolean
  compact?: boolean
}

export function MapSurface({ pins = [], onSelect, onLocationClick, pickedLocation, heatmap = false, compact = false }: Props) {
  const elementRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const pickedRef = useRef<L.Marker | null>(null)
  const heatRef = useRef<L.LayerGroup | null>(null)
  const clickHandler = useRef(onLocationClick)
  const selectHandler = useRef(onSelect)
  clickHandler.current = onLocationClick
  selectHandler.current = onSelect

  useEffect(() => {
    if (!elementRef.current || mapRef.current) return
    const map = L.map(elementRef.current, {
      center: CAMPUS_CENTER,
      zoom: compact ? 15 : 16,
      zoomControl: !compact,
      attributionControl: true,
    })
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(map)
    map.on('click', event => clickHandler.current?.(event.latlng.lat, event.latlng.lng))
    mapRef.current = map
    window.setTimeout(() => map.invalidateSize(), 0)
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [compact])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    clusterRef.current?.remove()
    const clusters = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 55,
      iconCreateFunction: cluster => L.divIcon({
        html: `<div><strong>${cluster.getChildCount()}</strong><span>memories</span></div>`,
        className: 'echo-cluster',
        iconSize: L.point(58, 58),
      }),
    })
    pins.forEach(pin => {
      const icon = L.divIcon({
        html: `<span style="--pin:${pin.color}"><i></i></span>`,
        className: 'echo-pin',
        iconSize: L.point(36, 44),
        iconAnchor: L.point(18, 42),
      })
      const marker = L.marker([pin.lat, pin.lng], { icon, title: pin.title })
      marker.bindTooltip(pin.title, { direction: 'top', offset: L.point(0, -35), className: 'echo-tooltip' })
      marker.on('click', () => selectHandler.current?.(pin))
      clusters.addLayer(marker)
    })
    clusters.addTo(map)
    clusterRef.current = clusters
    return () => {
      clusters.remove()
      if (clusterRef.current === clusters) clusterRef.current = null
    }
  }, [pins])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    pickedRef.current?.remove()
    pickedRef.current = null
    if (pickedLocation) {
      pickedRef.current = L.marker([pickedLocation.lat, pickedLocation.lng], {
        icon: L.divIcon({ html: '<span><i></i></span>', className: 'echo-pin picked', iconSize: L.point(40, 48), iconAnchor: L.point(20, 46) }),
      }).addTo(map)
      map.panTo([pickedLocation.lat, pickedLocation.lng])
    }
  }, [pickedLocation])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    heatRef.current?.remove()
    heatRef.current = null
    if (heatmap) {
      const layer = L.layerGroup(pins.map(pin => L.circle([pin.lat, pin.lng], {
        radius: 85,
        stroke: false,
        fillColor: pin.color,
        fillOpacity: .22,
        className: 'memory-heat',
      }))).addTo(map)
      heatRef.current = layer
    }
  }, [heatmap, pins])

  return <div ref={elementRef} className={`leaflet-surface ${compact ? 'compact-map' : ''}`}/>
}
