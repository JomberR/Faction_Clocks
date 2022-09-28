
class Faction_Clock extends HTMLElement{
    constructor(){
        super();
        //console.log(this.fetchTemplate());
    }

    async fetchTemplate(){
        let template = fetch("./web_components/faction_clock.html")
        .then((response) => response.text());
        
        return template;
    }

    async init(){
        this.innerHTML = await this.fetchTemplate();
    }

    connectedCallback(){
        this.init();
    }
}

customElements.define("faction-clock", Faction_Clock);