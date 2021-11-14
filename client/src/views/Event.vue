<template>
  <div class="flex flex-col mt-16">
    <div class="mt-14 w-screen flex justify-center">
      <input type="text" placeholder="e.g. Yoga Event" class="w-2/6 px-3 py-3 placeholder-gray-400 rounded-l-lg text-sm border border-gray-300 shadow focus:outline-none"/>
      <button type="text" class="text-center border border-blue-600 px-8 py-3 rounded-r-lg text-white shadow focus:outline-none bg-blue-600 hover:bg-blue-700 hover:border-blue-700">
        <font-awesome-icon icon="search" class="text-xl"/>
      </button>
    </div>
    <div class="mt-4 w-screen flex justify-center mb-8">
      <div>
        <div class="mt-1 relative">
          <button type="button" class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
            <span class="flex items-center">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="flex-shrink-0 h-6 w-6 rounded-full">
              <span class="ml-3 block truncate">
                Tom Cook
              </span>
            </span>
            <span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <!-- Heroicon name: solid/selector -->
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </span>
          </button>

          <!--
            Select popover, show/hide based on select state.

            Entering: ""
              From: ""
              To: ""
            Leaving: "transition ease-in duration-100"
              From: "opacity-100"
              To: "opacity-0"
          -->
          <ul class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
            <!--
              Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

              Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
            -->
            <li class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9" id="listbox-option-0" role="option">
              <div class="flex items-center">
                <img src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="flex-shrink-0 h-6 w-6 rounded-full">
                <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                <span class="font-normal ml-3 block truncate">
                  Wade Cooper
                </span>
              </div>

              <!--
                Checkmark, only display for selected option.

                Highlighted: "text-white", Not Highlighted: "text-indigo-600"
              -->
              <span class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                <!-- Heroicon name: solid/check -->
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </li>

            <!-- More items... -->
          </ul>
        </div>
      </div>
      <select class="text-center w-1/12 mx-4 px-3 py-3 text-white border shadow focus:outline-none bg-blue-400 hover:bg-blue-500">
        <option value="1">Damar</option>
        <option value="2">Gio</option>
        <option value="3">Nopal</option>
        <option value="4">Frengki</option>
        <option value="5">Far</option>
      </select>
      <select class="text-center w-1/12 mx-4 px-3 py-3 text-white border shadow focus:outline-none bg-blue-400 hover:bg-blue-500">
        <option value="1">Damar</option>
        <option value="2">Gio</option>
        <option value="3">Nopal</option>
        <option value="4">Frengki</option>
        <option value="5">Far</option>
      </select>
      <select class="text-center w-1/12 mx-4 px-3 py-3 text-white border shadow focus:outline-none bg-blue-400 hover:bg-blue-500">
        <option value="1">Damar</option>
        <option value="2">Gio</option>
        <option value="3">Nopal</option>
        <option value="4">Frengki</option>
        <option value="5">Far</option>
      </select>
    </div>
    <section class="flex items-center flex-col" v-for="index in 10" :key="index">
      <EventCard></EventCard>
    </section>
  </div>
</template>

<script>
import EventCard from '../components/EventCard.vue'
export default {
  name: 'Event',
  components: {
    EventCard
  }
}
</script>
