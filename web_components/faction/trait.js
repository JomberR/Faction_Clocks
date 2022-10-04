class Trait extends HTMLElement{
    constructor(){
        super();
    }

    async fetchTemplate(){
        let template = fetch("./web_components/faction/trait.html")
        .then((response) => response.text());
        
        return template;
    }

    //Allows the user to edit text entries by swapping between an input and the static text
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

    traitNameListener(){
        let traitName = this.shadowRoot.getElementById("trait-name");
        let input = this.shadowRoot.getElementById("trait-name-input");

        const toggleLabelBind = this.toggleLabel.bind(this, input, traitName, "Trait Name");

        traitName.addEventListener("click", toggleLabelBind);
        input.addEventListener("blur", toggleLabelBind);

        input.addEventListener("keypress", function(event){
            if(event.key === "Enter"){
                toggleLabelBind();
            }
        });
    }

    deleteListener(){
        let deleteBtn = this.shadowRoot.getElementById("button-delete-trait");
        let self = this;

        deleteBtn.addEventListener("click", function(){
            self.remove();
        });
    }

    setListeners(){
        this.traitNameListener();
        this.deleteListener();
    }

    //We're saving our attributes so we can reinstate ourselves later when we're saved/loaded.
    //We call a custom event save so that our parent can save us.
    saveAttributes(){
        let name = this.shadowRoot.getElementById("trait-name");
        this.setAttribute("name", name.innerHTML);
        this.dispatchEvent(new CustomEvent("save", {bubbles: true, composed: true}));
    }

    //We've been loaded and may have values preloaded
    setInitialValues(){
        let traitName = this.shadowRoot.getElementById("trait-name");
        traitName.innerHTML = this.getAttribute("name") || "Trait Name";
    }

    async init(){
        const shadow = this.attachShadow({mode: "open"});
        shadow.innerHTML = await this.fetchTemplate();
        this.setInitialValues();
        this.setListeners();
    }

    connectedCallback(){
        this.init();
    }

}

customElements.define("custom-trait", Trait);