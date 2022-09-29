
class Faction_Clock extends HTMLElement{
    constructor(){
        super();
    }

    async fetchTemplate(){
        let template = fetch("./web_components/faction_clock/faction_clock.html")
        .then((response) => response.text());
        
        return template;
    }

    addClockListener(shadow){
        let button = shadow.getElementById("button-add-clock");
        button.addEventListener("click", function(){
            let clockList = shadow.getElementById("clocks");
            let clock = document.createElement("sub-clock");
            clockList.appendChild(clock);
        });
    }

    setListeners(shadow){
        this.addClockListener(shadow);
    }

    async init(){
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = await this.fetchTemplate();
        this.setListeners(shadow);
    }

    connectedCallback(){
        this.init();
    }
}

customElements.define("faction-clock", Faction_Clock);