class Sub_Clock extends HTMLElement{
    constructor(){
        super();
    }

    async fetchTemplate(){
        let template = fetch("./web_components/faction_clock/sub_clock.html")
        .then((response) => response.text());
        
        return template;
    }

    async init(){
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = await this.fetchTemplate();
    }

    connectedCallback(){
        this.init();
    }
    
}

customElements.define("sub-clock", Sub_Clock);