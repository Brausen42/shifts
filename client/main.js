// from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

// custom date utilities
const dates = {
  asString: function(date) {
    return `${date.toDateString()} @ ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  },
  asPOSIX: function(date) {
    return date.getTime();
  }
}

Vue.component('modal', {
  template: `
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-body">
              <button class="modal-close-button" @click="$emit('close')">&times;</button>
              <slot name="body">
                default body
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  `
})

// Define a new component called button-counter
Vue.component('date-selector', {
  data: function () {
    return {
      date: (new Date()).toLocaleDateString('en-CA'),
      date_guid: uuidv4(),
      time: `${(new Date()).getHours()}:${(new Date()).getMinutes()}`,
      time_guid: uuidv4()
    }
  },
  computed: {
    date_object: function() {
      const date = new Date(this.date);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      if(this.time) {
        date.setHours(this.time.split(":")[0]);
        date.setMinutes(this.time.split(":")[1]);
      }
      return date;
    },
    date_as_string: function(){
      return dates.asString(this.date_object);
    },
    date_as_POSIX: function() {
      return dates.asPOSIX(this.date_object);
    }
  },
  template: `
  <div v-bind:value="date_as_POSIX">
    <input v-bind:id="date_guid" v-model="date" type="date"/>
    <input v-bind:id="time_guid" v-model="time" type="time"/>
    <p> {{ date_as_string }} </p>
  </div>
  `
});

Vue.component('shift-creator', {
  methods: {
    createShift: function() {
      $.ajax ({
        url: "http://localhost:8080/api/v1/shifts",
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
          start_time: $("#start-date-selector").attr("value"),
          end_time: $("#end-date-selector").attr("value")
        }),
        success: function (e) {
            // Success callback
            alert("Successfully created shift!");
        },
        error: function(e) {
          alert(JSON.stringify(e.responseJSON.error));
        }
      });
    }
  },
  template: `
  <div class="create-shift">
    <h2>Create a Shift</h2>
    <div class="even-spacing">
      <div class="pane">
        <h4>Start Date</h4>
        <date-selector id="start-date-selector"></date-selector>
      </div>
      <div class="pane">
        <h4>End Date</h4>
        <date-selector id="end-date-selector"></date-selector>
      </div>
    </div>
    <br/>
    <button v-on:click="createShift()">Create Shift</button>
  </div>
  `
});

Vue.component('shift-viewer', {
  data: function() {
    return {
      dates: dates, // scope these utils in
      shifts: []
    }
  },
  methods: {
    getShifts: function() {
      const self = this;
      $.ajax ({
        url: "http://localhost:8080/api/v1/shifts",
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            // clear array and repopulate
           self.shifts.length = 0;
           for (const shift of res.shifts) {
             self.shifts.push(shift);
           }
        },
        error: function(e) {
          alert(JSON.stringify(e.responseJSON.error));
        }
      });
    }
  },
  created: function() {
    const self = this;
    // update shifts every second
    setInterval(() => {
      self.getShifts();
    }, 1000);
  },
  template: `
  <div class="shift-viewer pane">
    <h2>All Shifts</h2>
    <table v-if="shifts.length > 0">
      <tr>
        <th>Start</th>
        <th>End</th>
      </tr>
      <tr v-for="shift in shifts">
        <td>{{ dates.asString(new Date(+shift.start_time)) }}</td>
        <td>{{ dates.asString(new Date(+shift.end_time)) }}</td>
      </tr>
    </table>
    <i v-if="shifts.length === 0"> - No shifts found - </i>
  </div>
  `
});

var app = new Vue({
  el: '#app',
  data: function() {
    return {
      show_modal: false
    }
  }
})