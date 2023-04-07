<template>
  <div class="content">
    <section class="hero">
      <img src="/images/9.png" class="hero-image" alt="hero-image" />
    </section>

    <!-- Location Input -->
    <Search @route-changed="getRoute" />
    <!-- END Location Input -->

    <!-- Main Content -->
    <div class="d-flex h-100">
      <div class="sidebar" :class="{ 'wide': isSummaryShown }">
        <Vehicles :route="route" @show-summary="showSummary" />
      </div>
      <div class="map">
        <div id="mapContainer"></div>
      </div>
    </div>
    <!-- END Main Content -->
  </div>
</template>

<script setup>
  import "leaflet/dist/leaflet.css";

  import { ref, reactive, onMounted } from "vue";
  import L from "leaflet"
  import "leaflet-routing-machine";

  import Search from "@/components/Search.vue";
  import Vehicles from "@/components/Vehicles.vue";

  const map = ref(null);
  const mapControl = ref(null);
  const mapCenter = reactive([14.6095196, 120.9880231]);

  const route = reactive({
    distance: 0,
    eta: 0,
    origin: "",
    destination: "",
    bestRoute: [],
    altRoute: []
  });

  const isSummaryShown = ref(false);

  const mapSetup = () => {
    map.value = L.map("mapContainer").setView(mapCenter, 17);
    L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
              'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: "mapbox/streets-v12",
          accessToken: "pk.eyJ1IjoidGhlZ2xpdGNoZWQiLCJhIjoiY2xmc29obGoyMDg3YzNpc2U4Zm1sMzRteSJ9.fJPTHQiUCZjRre17KPUXDA",
        }
    ).addTo(map.value);
  }

  onMounted(() => {
    mapSetup();
  })

  const getRoute = ($event) => {
    console.log($event)

    if (mapControl.value !== null) {
      map.value.removeControl(mapControl.value)
    }

    const waypoints = [
        L.latLng($event.origin[1], $event.origin[0]), // Origin
        L.latLng($event.destination[1], $event.destination[0]) // Destination
    ];

    const planOptions = {
      addWaypoints: false,
      draggableWaypoints: false
    };

    const plan = new L.Routing.Plan(waypoints, planOptions);

    mapControl.value = L.Routing.control({
      router: L.Routing.mapbox('pk.eyJ1IjoidGhlZ2xpdGNoZWQiLCJhIjoiY2xmc29obGoyMDg3YzNpc2U4Zm1sMzRteSJ9.fJPTHQiUCZjRre17KPUXDA'),
      plan: plan,
      lineOptions: {
        addWaypoints: false,
        styles: [{ color: '#145da0' }]
      },
      profile: 'driving-traffic',
      showAlternatives: true,
      altLineOptions: {
        styles: [{ color: '#145da0' }]
      }
    }).addTo(map.value);

    mapControl.value.on('routesfound', (e) => {
      console.log(e);

      let routes = e.routes;
      let summary = routes[0].summary;
      let summaryAlt = routes[1].summary;

      let bestRoute = null;
      let altRoute = null;

      // Determine the best route
      if (summary.totalDistance < summaryAlt.totalDistance) {
        bestRoute = routes[0];
        altRoute = routes[1]
      } else {
        bestRoute = routes[1];
        altRoute = routes[0]
      }

      // Assign the values to refs
      route.distance = round(bestRoute.summary.totalDistance / 1000, 1);
      route.eta = round(bestRoute.summary.totalTime / 60, 0);

      route.bestRoute = bestRoute;
      route.altRoute = altRoute;

      route.origin = $event.originName
      route.destination = $event.destinationName;

      console.log(route);
    });
  }

  // Round the given value with given precision
  //
  // Ex. A value of 80.433333 with precision of 1 will be rounded to 80.4
  const round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  const showSummary = (type) => {
    isSummaryShown.value = type === true;
  }

</script>

<style scoped>
.content {
  height: calc(100vh - 58px);
}

.hero .hero-image {
  width: 300px;
}

.sidebar {
  width: 620px;
  height: 100%;
  padding: 10px;
  transition: 0.3s;
}

.sidebar.wide {
  width: 1000px!important;
  padding: 0!important;
}

.map {
  width: 100%;
}

#mapContainer {
  height: 100%;
  width: 100%;
}
</style>
