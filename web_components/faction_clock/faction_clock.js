
class Faction_Clock extends HTMLElement{
    constructor(){
        super();
        //console.log(this.fetchTemplate());
    }

    async fetchTemplate(){
        let template = fetch("./web_components/faction_clock/faction_clock.html")
        .then((response) => response.text());
        
        return template;
    }

    async init(){
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = await this.fetchTemplate();
        
        /* shadow.getElementById("test").addEventListener("click", function(){
            console.log("DING!");
        }); */
    }

    connectedCallback(){
        this.init();
    }
}

customElements.define("faction-clock", Faction_Clock);