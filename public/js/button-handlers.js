class ButtonHandlers {
    constructor() {
        this.searchModal = new coreui.Modal(document.getElementById('search-modal'));
        this.eventModal = new coreui.Modal(document.getElementById('event-modal'));
        this.notesModal = new coreui.Modal(document.getElementById('notes-modal'));
        this.busyIcon = document.getElementById('busy-icon');
        this.searchBtn = document.getElementById('search');
        this.eventBtn = document.getElementById('event');
        this.notesBtn = document.getElementById('notes');
        this.cancelBtn = document.getElementById('cancel');
        this.updateBtn = document.getElementById('update');
        this.covidSwitch = document.getElementById('covid-switch');
        this.battlesCheck = document.getElementById('battles-check');
        this.explosionsCheck = document.getElementById('explosions-check');
        this.protestsCheck = document.getElementById('protests-check');
        this.riotsCheck = document.getElementById('riots-check');
        this.strategicCheck = document.getElementById('strategic-check');
        this.violenceCheck = document.getElementById('violence-check');
    }
    toggleBusy() {
        this.busyIcon.classList.toggle('invisible');
        this.searchBtn.disabled = !this.searchBtn.disabled;
    }
    init() {
        // turn off busy indicator and detail by default
        this.busyIcon.classList.toggle('invisible');
        this.eventBtn.disabled = true;
        this.notesBtn.disabled = true;

        // modal actions
        this.searchBtn.onclick = () => {
            this.searchModal.show();
        };
        this.cancelBtn.onclick = () => {
            this.searchModal.hide();
        };
        this.updateBtn.onclick = () => {
            fsi_polygon_get();
            this.searchModal.hide();
        };

        this.eventBtn.onclick = () => {
            this.eventModal.show();
        };

        this.notesBtn.onclick = () => {
            this.notesModal.show();
        };

        // set switch values to prevent value lost on page reload
        this.covidSwitch.checked ? this.covidSwitch.value = true : this.covidSwitch.value = false;
        this.battlesCheck.checked ? this.battlesCheck.value = true : this.battlesCheck.value = false;
        this.explosionsCheck.checked ? this.explosionsCheck.value = true : this.explosionsCheck.value = false;
        this.protestsCheck.checked ? this.protestsCheck.value = true : this.protestsCheck.value = false;
        this.riotsCheck.checked ? this.riotsCheck.value = true : this.riotsCheck.value = false;
        this.strategicCheck.checked ? this.strategicCheck.value = true : this.strategicCheck.value = false;
        this.violenceCheck.checked ? this.violenceCheck.value = true : this.violenceCheck.value = false;

        // set switch handlers
        this.covidSwitch.onclick = () => {
            this.covidSwitch.value = !this.covidSwitch.value;
        };
        this.battlesCheck.onclick = () => {
            this.battlesCheck.value = !this.battlesCheck.value;
        };
        this.explosionsCheck.onclick = () => {
            this.explosionsCheck.value = !this.explosionsCheck.value;
        };
        this.protestsCheck.onclick = () => {
            this.protestsCheck.value = !this.protestsCheck.value;
        };
        this.riotsCheck.onclick = () => {
            this.riotsCheck.value = !this.riotsCheck.value;
        };
        this.strategicCheck.onclick = () => {
            this.strategicCheck.value = !this.strategicCheck.value;
        };
        this.violenceCheck.onclick = () => {
            this.violenceCheck.value = !this.violenceCheck.value;
        };
    }
}

const btnHandlers = new ButtonHandlers();
btnHandlers.init();