/* global L */
import * as d3 from 'd3'

const map = L.map('mapid').setView([65.59333, -148.3916], 3)

L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

const markers = L.markerClusterGroup()

d3.csv(require('../data/dams_final.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  datapoints.forEach(function(d) {
    // console.log('I need dams', d.dam_name)
    const lat = d.longitude
    const long = d.latitude
    const name = d.dam_name
    const condition = d.condition_assessment_standardized
    const hazard = d.hazard_standardized
    const inspected = d.last_inspection_date
    const year = d.year_dam_completed

    const popup = L.popup().setContent(
      '</div>' +
        '<h3>' +
        name +
        '</h3>' +
        '<p>' +
        'Condition: ' +
        '<b>' +
        condition +
        '</b><br>' +
        'Hazard level: ' +
        '<b>' +
        hazard +
        '</b><br>' +
        'Last inspected: ' +
        inspected +
        '</b><br>' +
        'Year built: ' +
        year +
        '</b><br>' +
        '</p>' +
        '</div>'
    )

    const marker = L.marker([long, lat]).bindPopup(popup)
    // marker.bindPopup(name) // .openPopup()
    markers.addLayer(marker)
  })

  map.addLayer(markers)
  map.setView([39.8283, -98.5795], 4)

  window.addEventListener('resize', function(event) {
    // get the width of the screen after the resize event
    const width = window.innerWidth
    // tablets are between 768 and 922 pixels wide
    // phones are less than 768 pixels wide
    if (width < 600) {
      // set the zoom level to 10
      map.setView([39.8283, -98.5795], 2)
    } else if (width < 1000) {
      // set the zoom level to 10
      map.setView([39.8283, -98.5795], 3)
    } else {
      // set the zoom level to 8
      map.setView([39.8283, -98.5795], 4)
    }
  })
  // map.fitBounds(markers.getBounds())

  const nested = d3
    .nest()
    .key(d => d.state2)
    .key(d => d.county)
    .entries(datapoints)
  // console.log('init', e.features[0].properties.Neighborho)
  // console.log(nested)

  d3.select('#state-select')
    .selectAll('option')
    .data(nested)
    .enter()
    .append('option')
    .attr('value', d => d.key)
    .text(d => d.key)
    .text(function(d) {
      // console.log('fix', d.values.find(d => d.state2))
      return d.key
    })

  d3.select('#state-select').on('change', function() {
    const selected = d3.select(this).property('value')
    // console.log('selected is', selected)
    const county = nested.find(d => d.key === selected)
    // console.log('hey, hey', county)
    d3.select('#county-select')
      .selectAll('option')
      .remove()

    d3.select('#county-select')
      // .select('option')
      .append('option')
      .attr('value', '---')
      .text('County')

    d3.select('#county-select')
      .selectAll('option')
      .data(county.values)
      .enter()
      .append('option')
      .attr('value', d => d.key)
      .text(d => d.key.replace(/_[A-Z]{2}/, ''))

    markers.clearLayers()
    datapoints.forEach(function(d) {
      const place = d.state2
      console.log('hey, hey', selected, place)
      if (selected === place) {
        const name = d.dam_name
        const lat = d.longitude
        const long = d.latitude
        const condition = d.condition_assessment_standardized
        const hazard = d.hazard_standardized
        const inspected = d.last_inspection_date
        const year = d.year_dam_completed

        const popup = L.popup().setContent(
          '</div>' +
            '<h3>' +
            name +
            '</h3>' +
            '<p>' +
            'Condition: ' +
            '<b>' +
            condition +
            '</b><br>' +
            'Hazard level: ' +
            '<b>' +
            hazard +
            '</b><br>' +
            'Last inspected: ' +
            inspected +
            '</b><br>' +
            'Year built: ' +
            year +
            '</b><br>' +
            '</p>' +
            '</div>'
        )

        const marker = L.marker([long, lat]).bindPopup(popup)
        // marker.bindPopup(name) // .openPopup()
        markers.addLayer(marker)
      }
      map.addLayer(markers)
    })
    map.fitBounds(markers.getBounds())
    const zoom = map.getZoom()
    map.setZoom(zoom > 15 ? 15 : zoom)
  })

  d3.select('#county-select').on('change', function() {
    const selected = d3.select(this).property('value')
    markers.clearLayers()
    datapoints.forEach(function(d) {
      // console.log('hey, hey', selected)
      const place = d.county

      if (selected === place) {
        const name = d.dam_name
        const lat = d.longitude
        const long = d.latitude
        const condition = d.condition_assessment_standardized
        const hazard = d.hazard_standardized
        const inspected = d.last_inspection_date
        const year = d.year_dam_completed

        const popup = L.popup().setContent(
          '</div>' +
            '<h3>' +
            name +
            '</h3>' +
            '<p>' +
            'Condition: ' +
            '<b>' +
            condition +
            '</b><br>' +
            'Hazard level: ' +
            '<b>' +
            hazard +
            '</b><br>' +
            'Last inspected: ' +
            inspected +
            '</b><br>' +
            'Year built: ' +
            year +
            '</b><br>' +
            '</p>' +
            '</div>'
        )

        const marker = L.marker([long, lat]).bindPopup(popup)
        // marker.bindPopup(name) // .openPopup()
        markers.addLayer(marker)
      }
      map.addLayer(markers)
    })
    map.fitBounds(markers.getBounds())
    const zoom = map.getZoom()
    map.setZoom(zoom > 16 ? 16 : zoom)
  })
}
