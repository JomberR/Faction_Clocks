class Faction_Clock extends HTMLElement{
    constructor(){
        super();
    }

    async fetchTemplate(){
        let template = fetch("./web_components/faction_clock/faction_clock.html")
        .then((response) => response.text());
        
        return template;
    }

    toggleLabel(input, label, defaultLabel){
        if(label.hidden === false){
            label.hidden = true;

            input.value = label.innerHTML;
            input.hidden = false;
            input.focus();
        }
        else{
            input.hidden = true;
            label.hidden = false;

            if(input.value){
                label.innerHTML = input.value;
            }
            else{
                label.innerHTML = defaultLabel;
            }
        }
    }

    clockListener(){
        let button = this.shadowRoot.getElementById("button-add-clock");
        let clockList = this.shadowRoot.getElementById("clocks");

        button.addEventListener("click", function(){
            let clock = document.createElement("sub-clock");
            clockList.appendChild(clock);
        });
    }

    factionNameListener(){
        let factionName = this.shadowRoot.getElementById("faction-name");
        let input = this.shadowRoot.getElementById("faction-name-input");

        const toggleLabelBind = this.toggleLabel.bind(this, input, factionName, "Faction Name");

        factionName.addEventListener("click", toggleLabelBind);
        input.addEventListener("blur", toggleLabelBind);

        input.addEventListener("keypress", function(event){
            if(event.key === "Enter"){
                toggleLabelBind();
            }
        });
    }

    

    diceListener(){
        let dice = this.shadowRoot.getElementById("dice");
        let input = this.shadowRoot.getElementById("dice-input");

        const toggleLabelBind = this.toggleLabel.bind(this, input, dice, "1");

        dice.addEventListener("click", toggleLabelBind);
        input.addEventListener("blur", toggleLabelBind);

        input.addEventListener("keypress", function(event){
            if(event.key === "Enter"){
                toggleLabelBind();
            }
        });
    }

    setListeners(){
        this.clockListener();
        this.factionNameListener();
        this.diceListener();
    }

    async init(){
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = await this.fetchTemplate();
        this.setListeners();
    }

    connectedCallback(){
        this.init();
    }
}

customElements.define("faction-clock", Faction_Clock);