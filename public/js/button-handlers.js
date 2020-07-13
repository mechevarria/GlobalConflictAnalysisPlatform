class ButtonHandlers {
    constructor() {
        this.searchModal = new coreui.Modal(document.getElementById('searchModal'));
        this.mapCollapse = new coreui.Collapse(document.getElementById('map-info'));
        this.eventCollapse = new coreui.Collapse(document.getElementById('event-info'));
        this.noteCollapse = new coreui.Collapse(document.getElementById('note-info'));
        this.busyIcon = document.getElementById('busy-icon');
        this.searchBtn = document.getElementById('search');
        this.cancelBtn = document.getElementById('cancel');
        this.updateBtn = document.getElementById('update');
        this.mapHeader = document.getElementById('map-header');
        this.eventHeader = document.getElementById('event-header');
        this.noteHeader = document.getElementById('note-header');
    }
    toggleBusy() {
        this.busyIcon.classList.toggle('invisible');
        this.searchBtn.disabled = !this.searchBtn.disabled;
    }
    init() {
        // turn off busy indicator by default
        this.busyIcon.classList.toggle('invisible');

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

        // accordian actions
        this.mapHeader.onclick = () => {
            this.mapCollapse.toggle();
        };
        this.eventHeader.onclick = () => {
            this.eventCollapse.toggle();
        };
        this.noteHeader.onclick = () => {
            this.noteCollapse.toggle();
        };
    }
}

const btnHandlers = new ButtonHandlers();
btnHandlers.init();