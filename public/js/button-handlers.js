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
    setCheckValue(element) {
        element.checked ? element.value = true : element.value = false;
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
        this.setCheckValue(this.covidSwitch);
        this.setCheckValue(this.battlesCheck);
        this.setCheckValue(this.explosionsCheck);
        this.setCheckValue(this.protestsCheck);
        this.setCheckValue(this.riotsCheck);
        this.setCheckValue(this.strategicCheck);
        this.setCheckValue(this.violenceCheck);

        // set switch handlers
        this.covidSwitch.onclick = () => {
            this.setCheckValue(this.covidSwitch);
        };
        this.battlesCheck.onclick = () => {
            this.setCheckValue(this.battlesCheck);
        };
        this.explosionsCheck.onclick = () => {
            this.setCheckValue(this.explosionsCheck);
        };
        this.protestsCheck.onclick = () => {
            this.setCheckValue(this.protestsCheck);
        };
        this.riotsCheck.onclick = () => {
            this.setCheckValue(this.riotsCheck);
        };
        this.strategicCheck.onclick = () => {
            this.setCheckValue(this.strategicCheck);
        };
        this.violenceCheck.onclick = () => {
            this.setCheckValue(this.violenceCheck);
        };
    }
}

const btnHandlers = new ButtonHandlers();
btnHandlers.init();