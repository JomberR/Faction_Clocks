
class Faction_Clock extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        //Our template
        //IDs will need to be replaced with attributes. We'll have a bunch of duplicate IDs otherwise.
        this.innerHTML = 
        `
        <!--The clock for each faction-->
        <div class="box-container">
            <div class="flex-container-row">
                <span><b>Faction Name</b></span>
            </div>
            <div class="flex-container-row">
                <span id="level">Level: X</span>
            </div>
            <div class="flex-container-row">
                <span id="clock">X/X:</span>
                <span id="topic">A generic topic!</span>
            </div>
        </div>
        `;
    }

}

customElements.define("faction-clock", Faction_Clock);