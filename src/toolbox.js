(function(b) {
    
    var defaultOptions = {
        markers: ["freeform"],
        saveBtn: true,
        clearAllBtn: true
    };
    
    function addMarkersOptions(options, toolbox, onTypeSelected) {
        for(var m in options) {
            var mType = options[m],
                mElem = document.createElement("div"),
                mStyle = mElem.style;
            mStyle.height = "32px";
            mStyle.width = "32px";
            mStyle.margin = "5px";
            mStyle.border = "1px solid black";
            mStyle.borderRadius = "4px";
            switch(mType) {
                case "freeform":
                    mElem.innerText = "F";
                    mStyle.textAlign = "center";
                    mElem.addEventListener("click", function(e) {
                        onTypeSelected("freeform");
                    });
                    break;
            }            
            toolbox.appendChild(mElem);
        }
    }
    
    function createToolboxElem(options) {
        var toolboxElem = document.createElement("div");
        tbStyle = toolboxElem.style;
        tbStyle.backgroundColor = "rgba(255,0,0,0.2)";
        tbStyle.width = "auto";
        tbStyle.height = "60px";
        tbStyle.padding = "5px";
        tbStyle.border = "1px solid black";
        tbStyle.borderRadius = "5px";
        tbStyle.position = "absolute";
        tbStyle.top = 0;
        tbStyle.right = 0;
        
        return toolboxElem;
    }
    
    b.Toolbox = function(options) {
        options = Object.assign(defaultOptions, options);
        
        var toolboxElem = createToolboxElem(options),
            allMarkers = [];
        if(options.hasOwnProperty("overlay")) {
            options.overlay.parentElement.appendChild(toolboxElem);
        } else {
            console.error("Toolbox: overlay property does not exists");
        }
        
        var actions = new b.actions(options.overlay);
        actions.attachActions();
        
        function onMarkerCreatedHandler(marker) {
            allMarkers.push(marker);
            alert(JSON.stringify(allMarkers));
        }
        
        function onTypeSelected(type) {
            var currentAction = null;
            switch(type) {
                case "freeform":
                    currentAction = new b.freeformAction();
                    break;
            }
            currentAction.setUpHandler(onMarkerCreatedHandler);
            actions.setBehavior(currentAction);
        }
        
        addMarkersOptions(options.markers, toolboxElem, onTypeSelected);
        
        b.Toolbox.prototype.get = function() {
            return toolboxElem;
        };
        
        b.Toolbox.prototype.show = function() {
            return toolboxElem.style.display = "block";
        };
        
        b.Toolbox.prototype.hide = function() {
            return toolboxElem.style.display = "none";
        };
    };
} (DrawingBoard));