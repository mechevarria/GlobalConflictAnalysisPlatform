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
    }
}

const btnHandlers = new ButtonHandlers();
btnHandlers.init();