// eslint-disable-next-line no-unused-vars
class ButtonHandlers {
    constructor() {
        this.searchModal = new coreui.Modal(document.getElementById('searchModal'));
        this.mapCollapse = new coreui.Collapse(document.getElementById('map-info'));
        this.eventCollapse = new coreui.Collapse(document.getElementById('event-info'));
        this.noteCollapse = new coreui.Collapse(document.getElementById('note-info'));
    }
    init() {
        // modal actions
        document.getElementById('search').onclick = () => {
            this.searchModal.show();
        };
        document.getElementById('cancel').onclick = () => {
            this.searchModal.hide();
        };
        document.getElementById('update').onclick = () => {
            fsi_polygon_get();
            this.searchModal.hide();
        };

        // accordian actions
        document.getElementById('map-header').onclick = () => {
            this.mapCollapse.toggle();
        };
        document.getElementById('event-header').onclick = () => {
            this.eventCollapse.toggle();
        };
        document.getElementById('note-header').onclick = () => {
            this.noteCollapse.toggle();
        };
    }
}