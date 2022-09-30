class Clock extends HTMLElement{
    constructor(){
        super();
    }

    async fetchTemplate(){
        let template = fetch("./web_components/faction/clock.html")
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

    clockNameListener(){
        let clock = this.shadowRoot.getElementById("clock-name");
        let input = this.shadowRoot.getElementById("clock-name-input");

        const toggleLabelBind = this.toggleLabel.bind(this, input, clock, "Clock Name");

        clock.addEventListener("click", toggleLabelBind);
        input.addEventListener("blur", toggleLabelBind);

        input.addEventListener("keypress", function(event){
            if(event.key === "Enter"){
                toggleLabelBind();
            }
        });
    }

    deleteListener(){
        let deleteBtn = this.shadowRoot.getElementById("button-delete-clock");
        let self = this;

        deleteBtn.addEventListener("click", function(){
            self.remove();
        });
    }

    setListeners(){
        this.clockNameListener();
        this.deleteListener();
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

customElements.define("custom-clock", Clock);