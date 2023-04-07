<template>
  <div class="row p-3 me-0 shadow-sm">
    <div class="col-sm col-md-3">

      <div ref="originForm" class="input-group position-relative">
        <span class="input-group-text">
          <img src="/images/17.png" width="24"  alt="origin icon"/>
        </span>
        <input v-model="origin"
               type="text"
               class="form-control"
               placeholder="Enter your location here"
               aria-label="Origin"
               @input="debouncedOrigin"
               @focusin="showOriginAutocomplete = true">
        <div v-if="showOriginAutocomplete" class="autocomplete origin-selection shadow-sm">
          <div v-show="originAutocomplete.length === 0" class="p-3">
            Start searching for locations
          </div>
          <div class="item" v-for="feature in originAutocomplete" @click="selectLocation('origin', feature)">
            {{ feature.place_name }}
          </div>
        </div>
      </div>

    </div>

    <button class="btn btn-secondary" style="width: auto" @click="switchLocations">
      <font-awesome-icon :icon="['fas', 'right-left']" />
    </button>

    <div class="col-sm col-md-3">

      <div ref="destinationForm" class="input-group position-relative">
        <span class="input-group-text">
          <img src="/images/18.png" width="24" alt="destination icon" />
        </span>

        <input v-model="destination"
               type="text"
               class="form-control"
               placeholder="Enter your destination here"
               aria-label="Destination"
               @input="debouncedDestination"
               @focusin="showDestinationAutocomplete = true">

        <div v-if="showDestinationAutocomplete" class="autocomplete origin-selection shadow-sm">

          <div v-show="destinationAutocomplete.length === 0" class="p-3">
            Start searching for locations
          </div>

          <div class="item" v-for="feature in destinationAutocomplete" @click="selectLocation('destination', feature)">
            {{ feature.place_name }}
          </div>

        </div>
      </div>

    </div>

    <div class="col">
      <button class="btn btn-primary" @click="sendRoute">
        Search
      </button>
    </div>
  </div>
</template>

<script setup>
  import axios from "axios";
  import { debounce } from "lodash";
  import { ref, reactive } from "vue";

  import { onClickOutside } from "@vueuse/core";

  const emit = defineEmits(['route-changed']);

  const origin = ref('');
  const destination = ref('');
  const originCoords = ref([]);
  const destinationCoords = ref([]);

  const originForm = ref(null);
  const destinationForm = ref(null);

  const showOriginAutocomplete = ref(false);
  const showDestinationAutocomplete = ref(false);

  const originAutocomplete = ref([]);
  const destinationAutocomplete = ref([]);

  // Close dropdown results when clicked outside
  onClickOutside(originForm, () => showOriginAutocomplete.value = false);
  onClickOutside(destinationForm, () => showDestinationAutocomplete.value = false);

  const fetchOriginResults = () => {
    // Reset Autocomplete list
    originAutocomplete.value = [];

    const encodedOrigin = encodeURI(origin.value);

    return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${ encodedOrigin }.json?autocomplete=false&country=PH&place=Manila&access_token=pk.eyJ1IjoidGhlZ2xpdGNoZWQiLCJhIjoiY2xmc29obGoyMDg3YzNpc2U4Zm1sMzRteSJ9.fJPTHQiUCZjRre17KPUXDA`)
        .then((res) => {
          const features = res.data.features;

          for (let i = 0; i < features.length; i++) {
            originAutocomplete.value.push(features[i]);
          }
        })
  }

  const fetchDestinationResults = () => {
    // Reset Autocomplete list
    destinationAutocomplete.value = []

    const encodedDestination = encodeURI(destination.value);

    return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${ encodedDestination }.json?autocomplete=false&country=PH&place=Manila&access_token=pk.eyJ1IjoidGhlZ2xpdGNoZWQiLCJhIjoiY2xmc29obGoyMDg3YzNpc2U4Zm1sMzRteSJ9.fJPTHQiUCZjRre17KPUXDA`)
        .then((res) => {
          const features = res.data.features;

          for (let i = 0; i < features.length; i++) {
            destinationAutocomplete.value.push(features[i]);
          }
        })
  }

  const debouncedOrigin = debounce(() => {
    return fetchOriginResults()
  }, 500)

  const debouncedDestination = debounce(() => {
    return fetchDestinationResults()
  }, 500)

  const switchLocations = () => {
    const tmp = origin.value;

    origin.value = destination.value;
    destination.value = tmp;
  }

  const selectLocation = (type, feature) => {
    switch (type) {
      case 'origin':
        // Remove every item on the array on every search
        originCoords.value = [];

        // Set the input value into the selected location
        origin.value = feature.place_name;

        // Set the selected location's coordinates
        feature.geometry.coordinates.forEach(item => {
          originCoords.value.push(item);
        });

        showOriginAutocomplete.value = false
        break;
      case 'destination':
        // Remove every item on the array on every search
        destinationCoords.value = []

        destination.value = feature.place_name;

        feature.geometry.coordinates.forEach(item => {
          destinationCoords.value.push(item);
        })

        showDestinationAutocomplete.value = false
        break;
    }
  }

  const sendRoute = () => {
    emit('route-changed', {
      originName: origin.value,
      destinationName: destination.value,

      origin: originCoords.value,
      destination: destinationCoords.value
    })
  }


</script>

<style scoped>
  .autocomplete {
    position: absolute;
    background: white;
    border: 1px solid #e3e3e3;
    border-radius: 5px!important;
    width: 100%;
    top: 45px;
    z-index: 9999;
  }
  .autocomplete .item {
    padding: 10px;
    background: #f2f2f2;
    border-radius: 5px;
    margin: 10px;
  }
  
  .autocomplete .item:hover {
    cursor: pointer;
    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important;
  }
</style>