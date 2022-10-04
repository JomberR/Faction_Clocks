class Clock extends HTMLElement{
    constructor(){
        super();
    }

    async fetchTemplate(){
        let template = fetch("./web_components/faction/clock.html")
        .then((response) => response.text());
        
        return template;
    }

    //Allows the user to input values
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

            this.saveAttributes();
        }
    }

    //We're saving our attributes so we can reinstate ourselves later when we're saved/loaded.
    //We call a custom event save so that our parent can save us.
    saveAttributes(){
        let clockName = this.shadowRoot.getElementById("clock-name");
        this.setAttribute("name", clockName.innerHTML);

        let clockSize = this.shadowRoot.getElementById("clock-size");
        this.setAttribute("size", clockSize.value);

        let clockProgress = this.shadowRoot.getElementById("clock-progress");
        this.setAttribute("progress", clockProgress.innerHTML);

        this.dispatchEvent(new CustomEvent("save", {bubbles: true, composed: true}));
    }

    //We've been loaded and may have values preloaded
    setInitialValues(){
        let clockName = this.shadowRoot.getElementById("clock-name");
        clockName.innerHTML = this.getAttribute("name") || "Clock Name";

        let clockSize = this.shadowRoot.getElementById("clock-size");
        clockSize.value = this.getAttribute("size") || 4;

        let clockProgress = this.shadowRoot.getElementById("clock-progress");
        clockProgress.innerHTML = this.getAttribute("progress") || 0;
    }

    setClockDisplay(){
        let clockSize = this.shadowRoot.getElementById("clock-size");
        let clockProgress = this.shadowRoot.getElementById("clock-progress");
        let clockDisplay = this.shadowRoot.getElementById("clock-display");

        if(parseInt(clockProgress.innerHTML) > clockSize.value){
            clockProgress.innerHTML = clockSize.value;
        }

        clockDisplay.innerHTML = `${clockProgress.innerHTML} / ${clockSize.value}`;

        //While it might seem to make a lot of sense to save here, this is function is called when first initializing, and therefore gets called a bunch
        //of times when loading in.
    }

    clockProgressListener(){
        let clockSize = this.shadowRoot.getElementById("clock-size");
        let clockProgress = this.shadowRoot.getElementById("clock-progress");
        let clockAdd = this.shadowRoot.getElementById("clock-add");
        let clockSubtract = this.shadowRoot.getElementById("clock-subtract");

        const setClockDisplayBind = this.setClockDisplay.bind(this);
        const saveAttributesBind = this.saveAttributes.bind(this);

        clockSize.addEventListener("change", function(){
            setClockDisplayBind();
            saveAttributesBind();
        });

        clockAdd.addEventListener("click", function(){
            let progress = parseInt(clockProgress.innerHTML);
            if(progress < clockSize.value){
                progress++;
                clockProgress.innerHTML = progress;
                setClockDisplayBind();
                saveAttributesBind();
            }
        });

        clockSubtract.addEventListener("click", function(){
            let progress = parseInt(clockProgress.innerHTML);
            if(progress > 0){
                progress--;
                clockProgress.innerHTML = progress;
                setClockDisplayBind();
                saveAttributesBind();
            }
        });
        
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

    async setListeners(){
        this.clockNameListener();
        this.deleteListener();
        this.clockProgressListener();
    }

    async init(){
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = await this.fetchTemplate();
        this.setInitialValues();
        this.setListeners();
        this.setClockDisplay();
    }

    connectedCallback(){
        this.init();
    }

    
    
}

customElements.define("custom-clock", Clock);