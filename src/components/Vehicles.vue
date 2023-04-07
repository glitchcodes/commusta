<template>
  <div v-show="route.distance === 0" class="text-danger small mb-2">
    <font-awesome-icon :icon="['fas', 'circle-info']"></font-awesome-icon>
    Currently in default setting, values will vary each entered data
  </div>

  <div v-if="!isSummaryShown" class="d-flex justify-content-between">
    <div class="category">
      Service Type Available
    </div>
    <div class="category">
      Minimum Fare Cost
    </div>
  </div>

  <div v-if="!isSummaryShown" class="vehicles">

    <div class="card item my-2" @click="showSummary('puj')">
      <div class="card-body d-flex gap-3">
        <div class="item-icon">
          <img src="/images/10.png" alt="PUJ" />
        </div>
        <div class="flex-1">
          <div>PUJ (Public Utility Jeepney)</div>
          <div v-if="route.distance !== 0" class="badge bg-primary">
            ETA: {{ route.eta }} mins
          </div>
        </div>
        <div>
          <p class="item-price">&#8369;12.00</p>
        </div>
      </div>
    </div>

    <div class="card item my-2" @click="showSummary('tricycle')">
      <div class="card-body d-flex gap-3">
        <div class="item-icon">
          <img src="/images/15.png" alt="Tricycle" />
        </div>
        <div class="flex-1">
          <div>Tricycle</div>
          <div v-if="route.distance !== 0" class="badge bg-primary">
            ETA: {{ route.eta }} mins
          </div>
        </div>
        <div>
          <p v-if="route.distance === 0" class="item-price">&#8369;15.00 (per km)</p>
          <p v-else class="item-price">
            &#8369;{{ calculatePrice('tricycle') }}
          </p>
        </div>
      </div>
    </div>

    <div class="card item my-2" @click="showSummary('motorcycle')">
      <div class="card-body d-flex gap-3">
        <div class="item-icon">
          <img src="/images/14.png" alt="Motorcycle" />
        </div>
        <div class="flex-1">
          <div>Motorcycle</div>
          <div v-if="route.distance !== 0" class="badge bg-primary">
            ETA: {{ route.eta }} mins
          </div>
        </div>
        <div>
          <p v-if="route.distance === 0" class="item-price">&#8369;9.00 (per km)</p>
          <p v-else class="item-price">
            &#8369;{{ calculatePrice('motorcycle') }}
          </p>
        </div>
      </div>
    </div>

    <div class="card item my-2" @click="showSummary('express')">
      <div class="card-body d-flex gap-3">
        <div class="item-icon">
          <img src="/images/12.png" alt="Taxi/FX/UV Express" />
        </div>
        <div class="flex-1">
          <div>Taxi/FX/UV Express</div>
          <div v-if="route.distance !== 0" class="badge bg-primary">
            ETA: {{ route.eta }} mins
          </div>
        </div>
        <div>
          <p v-if="route.distance === 0" class="item-price">&#8369;35.00 - &#8369;55.00 (per km)</p>
          <p v-else class="item-price">
            &#8369;{{ calculatePrice('express') }}
          </p>
        </div>
      </div>
    </div>

  </div>

  <div v-else class="summary">
    <div class="summary-head">
      <button class="back-button" @click="closeSummary">
        <font-awesome-icon :icon="['fas', 'arrow-left']"></font-awesome-icon>
      </button>

      <h5>Results</h5>
      <h5>{{ route.origin }} <font-awesome-icon :icon="['fas', 'arrow-right']"></font-awesome-icon> {{ route.destination }}</h5>

      <p>
        <font-awesome-icon :icon="['fas', 'clock']"></font-awesome-icon>
        {{ route.eta }} mins
      </p>
    </div>

    <div class="summary-info">
      <div class="d-flex gap-3">
        <div class="route w-100">
          <div class="heading d-flex justify-content-between">
            Route 1 Overview
            <span class="badge bg-primary" style="margin-top: 2px">Best</span>
          </div>

          <div class="location-marker d-flex gap-2">
            <img :src="routeImage" />
            <p class="small">{{ route.origin }}</p>
          </div>

          <div class="instructions">
            <div>via {{ route.bestRoute.name }}</div>
          </div>

          <div class="location-marker d-flex gap-2 mb-3">
            <img src="/images/41.png" />
            <p class="small">{{ route.destination }}</p>
          </div>

          <div class="meta-info">
            <span class="fw-bold">Price: </span> &#8369;{{ routeOnePrice }}
          </div>

          <div class="meta-info">
            <span class="fw-bold">ETA: </span> {{ routeOneETA }} mins
          </div>

        </div>
        <div class="route w-100">
          <div class="heading">Route 2 Overview</div>

          <div class="location-marker d-flex gap-2">
            <img :src="routeImage" />
            <p class="small">{{ route.origin }}</p>
          </div>

          <div class="instructions">
            <div>via {{ route.altRoute.name }}</div>
          </div>

          <div class="location-marker d-flex gap-2 mb-3">
            <img src="/images/41.png" />
            <p class="small">{{ route.destination }}</p>
          </div>

          <div class="meta-info">
            <span class="fw-bold">Price: </span> &#8369;{{ routeTwoPrice }}
          </div>

          <div class="meta-info">
            <span class="fw-bold">ETA: </span> {{ routeTwoETA }} mins
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
  import { computed, ref } from "vue";

  const emit = defineEmits(['show-summary']);

  const props = defineProps({
    route: Object
  });

  const isSummaryShown = ref(false);
  const summaryChosen = ref("");

  const calculatePrice = (type) => {
    let initialPrice = 0;

    switch (type) {
      case 'tricycle':
        initialPrice = 15 * props.route.distance;
        break;
      case 'motorcycle':
        initialPrice = 9 * props.route.distance;
        break;
      case 'express':
        initialPrice = 35 * props.route.distance;
        break;
    }

    console.log(props.route.distance)
    console.log(initialPrice)

    return Math.round(initialPrice);
  }

  const routeImage = computed(() => {
    let image = "/images/10.png";

    switch (summaryChosen.value) {
      case 'puj':
        image = "/images/10.png";
        break;
      case 'tricycle':
        image = "/images/15.png";
        break;
      case 'motorcycle':
        image = "/images/14.png";
        break;
      case 'express':
        image = "/images/12.png";
        break;
    }

    return image;
  });

  const routeOnePrice = computed(() => {
    const route = props.route.bestRoute;
    console.log(route)

    const distance = round(route.summary.totalDistance / 1000, 1);
    let price = 0;

    switch (summaryChosen.value) {
      case 'puj':
        price = 12;
        break;
      case 'tricycle':
        price = 15 * distance;
        break;
      case 'motorcycle':
        price = 9 * distance;
        break;
      case 'express':
        price = 35 * distance;
        break;
    }

    return Math.round(price);
  });

  const routeOneETA = computed(() => {
    const summary = props.route.bestRoute.summary;
    return Math.round(summary.totalTime / 60);
  })

  const routeTwoPrice = computed(() => {
    const route = props.route.altRoute;
    const distance = round(route.summary.totalDistance / 1000, 1);
    let price = 0;

    switch (summaryChosen.value) {
      case 'puj':
        price = 12;
        break;
      case 'tricycle':
        price = 15 * distance;
        break;
      case 'motorcycle':
        price = 9 * distance;
        break;
      case 'express':
        price = 35 * distance;
        break;
    }

    return Math.round(price);
  });

  const routeTwoETA = computed(() => {
    const summary = props.route.altRoute.summary;
    return Math.round(summary.totalTime / 60);
  })

  const showSummary = (type) => {
    if (props.route.distance === 0) return;

    isSummaryShown.value = true;
    summaryChosen.value = type;

    // Emit an event to CommuteView
    emit('show-summary', true);
  }

  const closeSummary = () => {
    isSummaryShown.value = false;

    // Emit an event to CommuteView
    emit('show-summary', false);
  }

  // Round the given value with given precision
  //
  // Ex. A value of 80.433333 with precision of 1 will be rounded to 80.4
  const round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
</script>

<style scoped>
  .category {
    padding: 5px 20px;
    background-color: #fbc114;
    color: white;
    border-radius: 8px;
  }

  .item-icon img {
    width: 50px;
  }

  .item-price {
    margin-bottom: 0;
    position: absolute;
    bottom: 5px;
    right: 10px;
  }

  .vehicles .item:hover {
    cursor: pointer;
    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important;
  }

  .summary .summary-head {
    background: #fbc114;
    color: white;
    padding: 1.5rem 1.5rem 4rem;
  }

  .summary .summary-info {
    background-color: white;
    padding: 1rem;
    margin-top: -65px;
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important;
  }

  .summary-info .route .heading {
    background-color: #fbc114;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .location-marker img {
    width: 55px;
    height: 55px;
  }

  .instructions {
    border-left: 4px solid #145da0;
    padding: 1rem;
    margin: 1rem 0;
  }

  .meta-info {
    background-color: #8e8e8e;
    color: white;
    padding: 0.3rem 1rem;
    border-radius: 15px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .back-button {
    background: none;
    border: 1px solid #e1b01e;
    color: white;
    margin-bottom: 1rem;
    border-radius: 8px;
    padding: 5px 10px;
  }
</style>