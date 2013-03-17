OpenLayers.Control.LayerSwitcher = OpenLayers.Class(OpenLayers.Control, {
    activeColor: "white",
    layerStates: null,
    useLegendGraphics: false,
    layersDiv: null,
    baseLayersDiv: null,
    baseLayers: null,
    dataLayersDiv: null,
    dataLayers: null,
    activeLayer: null,
    minimizeDiv: null,
    maximizeDiv: null,
    ascending: true,
    initialize: function (options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.layerStates = [];
    },
    destroy: function () {
        OpenLayers.Event.stopObservingElement(this.div);
        OpenLayers.Event.stopObservingElement(this.minimizeDiv);
        OpenLayers.Event.stopObservingElement(this.maximizeDiv);
        this.clearLayersArray("base");
        this.clearLayersArray("data");
        this.map.events.un({
            "addlayer": this.redraw,
            "changelayer": this.redraw,
            "removelayer": this.redraw,
            "changebaselayer": this.redraw,
            scope: this
        });
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    setMap: function (map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.map.events.on({
            "addlayer": this.redraw,
            "changelayer": this.redraw,
            "removelayer": this.redraw,
            "changebaselayer": this.redraw,
            scope: this
        });
    },
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this);
        this.loadContents();
        if (!this.outsideViewport) {
            this.minimizeControl();
        }
        this.redraw();
        return this.div;
    },
    clearLayersArray: function (layersType) {
        var layers = this[layersType + "Layers"];
        if (layers) {
            for (var i = 0, len = layers.length; i < len; i++) {
                var layer = layers[i];
                OpenLayers.Event.stopObservingElement(layer.inputElem);
                OpenLayers.Event.stopObservingElement(layer.labelSpan);
            }
        }
        this[layersType + "LayersDiv"].innerHTML = "";
        this[layersType + "Layers"] = [];
    },
    checkRedraw: function () {
        var redraw = false;
        if (!this.layerStates.length || (this.map.layers.length != this.layerStates.length)) {
            redraw = true;
        } else {
            for (var i = 0, len = this.layerStates.length; i < len; i++) {
                var layerState = this.layerStates[i];
                var layer = this.map.layers[i];
                if ((layerState.name != layer.name) || (layerState.inRange != layer.inRange) || (layerState.id != layer.id) || (layerState.visibility != layer.visibility)) {
                    redraw = true;
                    break;
                }
            }
        }
        return redraw;
    },
    redraw: function () {
    	try
    	{
        if (!this.checkRedraw()) {
            return this.div;
        }
        this.clearLayersArray("base");
        this.clearLayersArray("data");
        var containsOverlays = false;
        var containsBaseLayers = false;
        var len = this.map.layers.length;
        this.layerStates = new Array(len);
        for (var i = 0; i < len; i++) {
            var layer = this.map.layers[i];
            this.layerStates[i] = {
                'name': layer.name,
                'visibility': layer.visibility,
                'inRange': layer.inRange,
                'id': layer.id
            };
        }
        var layers = this.map.layers.slice();
        if (!this.ascending) {
            layers.reverse();
        }
        for (var i = 0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            var baseLayer = layer.isBaseLayer;
            if (layer.displayInLayerSwitcher) {
                if (baseLayer) {
                    containsBaseLayers = true;
                } else {
                    containsOverlays = true;
                }
                var checked = (baseLayer) ? (layer == this.map.baseLayer) : layer.getVisibility();
                var layerWrapper = document.createElement("div");
                layerWrapper.style.margin = "8px 0px 8px 4px";
                layerWrapper.id = "layer_" + layer.id;
                var inputElem = document.createElement("input");
                inputElem.id = this.id + "_input_" + layer.name;
                inputElem.name = (baseLayer) ? "baseLayers" : layer.name;
                inputElem.type = (baseLayer) ? "radio" : "checkbox";
                inputElem.value = layer.name;
                inputElem.checked = checked;
                inputElem.defaultChecked = checked;
                if (!baseLayer && !layer.inRange) {
                    inputElem.disabled = true;
                }
                var labelSpan = document.createElement("span");
                if (!baseLayer && !layer.inRange) {
                    labelSpan.style.color = "gray";
                }
                if (layer.queryable) {
                    labelSpan.style.cursor = "pointer";
                }
                labelSpan.innerHTML = layer.name;
                labelSpan.style.display = "block";
                labelSpan.style.width = "130px";
                labelSpan.style.padding = "0px 6px 2px 4px";
                labelSpan.style.verticalAlign = (baseLayer) ? "bottom" : "baseline";
                var abstractSpan = document.createElement("span");
                abstractSpan.id = "abstract_" + layer.id;
                abstractSpan.innerHTML = layer.description;
                abstractSpan.style.display = "none";
                abstractSpan.style.fontWeight = "normal";
                abstractSpan.style.padding = "0px 6px 2px 5px";
                abstractSpan.style.fontSize = "11px";
                var abstractToolbarSpan = document.createElement("span");
                abstractToolbarSpan.style.display = "block";
                abstractSpan.appendChild(abstractToolbarSpan);
                if (layer.dataURL) {
                    var dataUrlLink = document.createElement("a");
                    dataUrlLink.style.cursor = "pointer";
                    dataUrlLink.style.display = "inline-block";
                    dataUrlLink.alt = "download";
                    dataUrlLink.title = "download";
                    dataUrlLink.innerHTML = '<img src="' + OpenLayers.Util.getImagesLocation() + 'download.png" style="border: none;" />';
                    var dataUrlLinkContext = {
                        'url': layer.dataURL
                    };
                    OpenLayers.Event.observe(dataUrlLink, "click", OpenLayers.Function.bindAsEventListener(this.onDataUrlClick, dataUrlLinkContext));
                }
                if (layer.metadataURL) {
                    var metadataUrlLink = document.createElement("a");
                    metadataUrlLink.style.cursor = "pointer";
                    metadataUrlLink.style.display = "inline-block";
                    metadataUrlLink.style.margin = "5px 0px 0px 0px";
                    metadataUrlLink.alt = "metadata";
                    metadataUrlLink.title = "metadata";
                    metadataUrlLink.innerHTML = '<img src="' + OpenLayers.Util.getImagesLocation() + 'metadata.png" style="border: none;" />';
                    var metadataUrlLinkContext = {
                        'url': layer.metadataURL
                    };
                    OpenLayers.Event.observe(metadataUrlLink, "click", OpenLayers.Function.bindAsEventListener(this.onMetadataUrlClick, metadataUrlLinkContext));
                    abstractToolbarSpan.appendChild(metadataUrlLink);
                }
                var titleDiv = document.createElement("div");
                titleDiv.id = "title_" + layer.id;
                if (this.activeLayer == layer.id) {
                    titleDiv.style.backgroundColor = "#999";
                    titleDiv.style.border = "solid 1px #999";
                } else {
                    titleDiv.style.backgroundColor = "#e1e1e1";
                    titleDiv.style.border = "solid 1px #e1e1e1";
                }
                titleDiv.style.width = "140px";
                titleDiv.style.padding = "2px";
                titleDiv.style.position = "relative";
                var buttonSpan = document.createElement("span");
                buttonSpan.style.padding = "3px 3px 3px 0";
                var removeButton = document.createElement("img");
                removeButton.src = OpenLayers.Util.getImagesLocation() + "del.png";
                removeButton.style.cursor = "pointer";
                removeButton.alt = "remove layer";
                removeButton.title = "remove layer";
                var upButton = document.createElement("img");
                upButton.src = OpenLayers.Util.getImagesLocation() + "up.png";
                upButton.style.cursor = "pointer";
                upButton.alt = "move layer up";
                upButton.title = "move layer up";
                var downButton = document.createElement("img");
                downButton.src = OpenLayers.Util.getImagesLocation() + "down.png";
                downButton.style.cursor = "pointer";
                downButton.alt = "move layer down";
                downButton.title = "move layer down";
                var opacityMinusButton = document.createElement("img");
                opacityMinusButton.src = OpenLayers.Util.getImagesLocation() + "minus.png";
                opacityMinusButton.style.cursor = "pointer";
                opacityMinusButton.alt = "decrease opacity";
                opacityMinusButton.title = "decrease opacity";
                layer.setOpacity(layer.opacity);
                var opacitySpan = document.createElement("span");
                opacitySpan.setAttribute("id", "opacityValue_" + layer.id);
                opacitySpan.style.display = "inline-block";
                opacitySpan.style.width = "50px";                
                var opacityImg = document.createElement("img");
                opacityImg.setAttribute("id", "opacityImg_" + layer.id);
                opacityImg.src = OpenLayers.Util.getImagesLocation() + "opacity.png";
                opacityImg.width = (layer.opacity != null) ? (layer.opacity * 50).toFixed(0) : "50";
                opacityImg.height = "12";
                opacityImg.alt = "opacity";
                opacityImg.title = "opacity";
                var opacityTextInput = document.createElement("input");
                opacityTextInput.setAttribute("id", "opacity_" + layer.id);
                opacityTextInput.setAttribute("type", "hidden");
                opacityTextInput.setAttribute("value", "1.0");
                var opacityPlusButton = document.createElement("img");
                opacityPlusButton.src = OpenLayers.Util.getImagesLocation() + "plus.png";
                opacityPlusButton.style.cursor = "pointer";
                opacityPlusButton.alt = "increase opacity";
                opacityPlusButton.title = "increase opacity";
                var abstractButton = document.createElement("img");
                abstractButton.setAttribute("id", "abstractButton_" + layer.id);
                abstractButton.src = OpenLayers.Util.getImagesLocation() + "expand.png";
                abstractButton.style.cursor = "pointer";
                abstractButton.style.position = "absolute";
                abstractButton.style.top = "0";
                abstractButton.style.right = "0";
                abstractButton.style.padding = "5px";
                var context = {
                    'layer': layer,
                    'inputElem': inputElem,
                    'titleDiv': titleDiv,
                    'layerSwitcher': this
                };
                OpenLayers.Event.observe(inputElem, "mouseup", OpenLayers.Function.bindAsEventListener(this.onInputClick, context));
                if (layer.queryable) {
                    var queryableButton = document.createElement("img");
                    queryableButton.src = OpenLayers.Util.getImagesLocation() + "queryable.png";
                    queryableButton.style.cursor = "pointer";
                    queryableButton.alt = "select for query";
                    queryableButton.title = "select for query";
                    OpenLayers.Event.observe(labelSpan, "click", OpenLayers.Function.bindAsEventListener(this.onTitleClick, context));
                    OpenLayers.Event.observe(queryableButton, "click", OpenLayers.Function.bindAsEventListener(this.onTitleClick, context));
                }
                OpenLayers.Event.observe(upButton, "click", OpenLayers.Function.bindAsEventListener(this.onUpClick, context));
                OpenLayers.Event.observe(downButton, "click", OpenLayers.Function.bindAsEventListener(this.onDownClick, context));
                OpenLayers.Event.observe(removeButton, "click", OpenLayers.Function.bindAsEventListener(this.onRemoveClick, context));
                var opacityMinusContext = {
                    'layer': layer,
                    'byOpacity': '-0.1',
                    'layerSwitcher': this
                };
                OpenLayers.Event.observe(opacityMinusButton, "click", OpenLayers.Function.bindAsEventListener(this.changeLayerOpacity, opacityMinusContext));
                var opacityPlusContext = {
                    'layer': layer,
                    'byOpacity': '0.1',
                    'layerSwitcher': this
                };
                OpenLayers.Event.observe(opacityPlusButton, "click", OpenLayers.Function.bindAsEventListener(this.changeLayerOpacity, opacityPlusContext));
                var abstractContext = {
                    'layer': layer,
                    'button': abstractButton
                };
                OpenLayers.Event.observe(abstractButton, "mouseup", OpenLayers.Function.bindAsEventListener(this.toggleAbstract, abstractContext));
                var br = document.createElement("br");
                var groupArray = (baseLayer) ? this.baseLayers : this.dataLayers;
                groupArray.push({
                    'layer': layer,
                    'inputElem': inputElem,
                    'titleDiv': titleDiv,
                    'labelSpan': labelSpan
                });
                var groupDiv = (baseLayer) ? this.baseLayersDiv : this.dataLayersDiv;
                groupDiv.appendChild(layerWrapper);
                layerWrapper.appendChild(titleDiv);
                titleDiv.appendChild(inputElem);
                titleDiv.appendChild(buttonSpan);
                buttonSpan.appendChild(upButton);
                buttonSpan.appendChild(downButton);
                buttonSpan.appendChild(removeButton);
                buttonSpan.appendChild(opacityMinusButton);
                opacitySpan.appendChild(opacityImg);
                buttonSpan.appendChild(opacitySpan);
                buttonSpan.appendChild(opacityTextInput);
                buttonSpan.appendChild(opacityPlusButton);
                if (layer.description) {
                    titleDiv.appendChild(abstractButton);
                }
                if (layer.queryable) {
                    buttonSpan.appendChild(queryableButton);
                }
                if (layer.dataURL) {
                    buttonSpan.appendChild(dataUrlLink);
                }
                titleDiv.appendChild(labelSpan);
                titleDiv.appendChild(abstractSpan);
                // if (this.useLegendGraphics && layer.params) {
                    // var legendGraphicURL = layer.getFullRequestString({
                        // REQUEST: "GetLegendGraphic",
                        // LAYER: layer.params.LAYERS,
                        // FORMAT: "image/png",
                        // WIDTH: "150"
                    // });
                    // var imgSpan = document.createElement('span');
                    // imgSpan.innerHTML = "<img style=\"display:none\" src=\"" + legendGraphicURL + "\" onload=\"this.style.display = 'inline'\" alt=\"\" onerror=\"this.src='" + OpenLayers.Util.getImagesLocation() + "blank.gif" + "'\" />";
                    // layerWrapper.appendChild(imgSpan);
                // }
            }
        }
        return this.div;
        }
        catch (err){
        	alert(err);        	
        }
    },
    onInputClick: function (e) {
        if (!this.inputElem.disabled) {
            if (this.inputElem.type == "radio") {
                this.inputElem.checked = true;
                this.layer.map.setBaseLayer(this.layer);
            } else {
                this.inputElem.checked = !this.inputElem.checked;
                this.layerSwitcher.updateMap();
            }
        }
        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },
    onRemoveClick: function (e) {
    	try
    	{
    		
    	map = this.layer.map;	
        map.removeLayer(this.layer);
        if (e != null) {
            OpenLayers.Event.stop(e);
        }
       }
       catch(err)
	  {
	  //Handle errors here
	  alert(err);
	  }
    },
    onDownClick: function (e) {
    	map = this.layer.map;
        map.raiseLayer(this.layer, - 1);
        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },
    onUpClick: function (e) {
    	map = this.layer.map;
        map.raiseLayer(this.layer, 1);
        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },
    onTitleClick: function (e) {
        var id = this.layer.id;
        layerSwitcher.activeLayer = id;
        for (var i = 0; i < map.layers.length; i++) {
            var layer = map.layers[i];
            if (id == layer.id) {
                this.titleDiv.style.backgroundColor = "#999";
                this.titleDiv.style.border = "solid 1px #999";
            } else {
                var div = OpenLayers.Util.getElement("title_" + layer.id);
                if (div) {
                    div.style.backgroundColor = "#e1e1e1";
                    div.style.border = "solid 1px #e1e1e1";
                }
            }
        }
        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },
    toggleAbstract: function (e) {
        var span = OpenLayers.Util.getElement("abstract_" + this.layer.id);
        var button = this.button;
        if (span && button) {
            var display = span.style.display;
            if (display == "block") {
                span.style.display = "none";
                button.src = OpenLayers.Util.getImagesLocation() + "expand.png";
            } else {
                span.style.display = "block";
                button.src = OpenLayers.Util.getImagesLocation() + "collapse.png";
            }
        }
    },
    onDataUrlClick: function (e) {
        window.open(this.url, "data", "width=550,height=350,status=yes,scrollbars=yes,resizable=yes");
    },
    onMetadataUrlClick: function (e) {
        window.open(this.url, "metadata", "width=550,height=350,status=yes,scrollbars=yes,resizable=yes");
    },
    onLayerClick: function (e) {
        this.updateMap();
    },
    changeLayerOpacity: function (e) {
        var maxOpacity = 1.0;
        var minOpacity = 0.1;
        var opacity = (this.layer.opacity != null) ? this.layer.opacity : 1.0;
        var i = parseFloat(this.byOpacity);
        var opacityElement = "opacity_" + this.layer.id;
        var opacityImg = "opacityImg_" + this.layer.id;
        var newOpacity = (parseFloat(opacity + i)).toFixed(1);
        newOpacity = Math.min(maxOpacity, Math.max(minOpacity, newOpacity));
        OpenLayers.Util.getElement(opacityElement).value = newOpacity;
        OpenLayers.Util.getElement(opacityImg).width = (newOpacity * 50).toFixed(0);
        this.layer.setOpacity(newOpacity);
    },
    updateMap: function () {
        for (var i = 0, len = this.baseLayers.length; i < len; i++) {
            var layerEntry = this.baseLayers[i];
            if (layerEntry.inputElem.checked) {
                this.map.setBaseLayer(layerEntry.layer, false);
            }
        }
        for (var i = 0, len = this.dataLayers.length; i < len; i++) {
            var layerEntry = this.dataLayers[i];
            layerEntry.layer.setVisibility(layerEntry.inputElem.checked);
        }
    },
    maximizeControl: function (e) {
        this.div.style.width = "150px";
        this.div.style.height = "100%";
        this.div.style.top = "0%";
        this.div.style.borderLeft = "solid 1px #999";
        this.div.style.borderTop = "solid 1px #999";
        this.div.style.borderBottom = "solid 1px #999";        
        this.showControls(false);
        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },
    minimizeControl: function (e) {
        this.div.style.width = "0px";
        this.div.style.height = "100%";
        this.div.style.top = "0%";
        this.div.style.borderLeft = "none";
        this.showControls(true);
        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },
    showControls: function (minimize) {
        this.maximizeDiv.style.display = minimize ? "" : "none";
        this.minimizeDiv.style.display = minimize ? "none" : "";
        this.layersDiv.style.display = minimize ? "none" : "";
    },
    loadContents: function () {
        this.div.style.position = "absolute";
        this.div.style.top = "0px";
        this.div.style.right = "0px";
        this.div.style.left = "";
        this.div.style.fontFamily = "sans-serif";
        this.div.style.fontWeight = "bold";
        this.div.style.fontSize = "13px";
        this.div.style.color = "#333";
        this.div.style.backgroundColor = this.activeColor;
        this.div.style.height = "100%";
        OpenLayers.Event.observe(this.div, "mouseup", OpenLayers.Function.bindAsEventListener(this.mouseUp, this));
        OpenLayers.Event.observe(this.div, "click", this.ignoreEvent);
        OpenLayers.Event.observe(this.div, "mousedown", OpenLayers.Function.bindAsEventListener(this.mouseDown, this));
        OpenLayers.Event.observe(this.div, "dblclick", this.ignoreEvent);
        this.layersDiv = document.createElement("div");
        this.layersDiv.setAttribute("className", "olLayerSwitcherLayerContainer");
        this.layersDiv.id = this.id + "_layersDiv";
        this.layersDiv.style.overflowX = "hidden";
        this.layersDiv.style.overflowY = "hidden";
        this.layersDiv.style.position = "relative";
        this.layersDiv.style.height = "100%";
        OpenLayers.Event.observe(this.layersDiv, "mousewheel", this.ignoreEvent);
        this.baseLayersDiv = document.createElement("div");
        this.baseLayersDiv.style.display = "none";
        this.dataLayersDiv = document.createElement("div");
        this.dataLayersDiv.style.paddingLeft = "5px";
        if (this.ascending) {
            this.layersDiv.appendChild(this.baseLayersDiv);
            this.layersDiv.appendChild(this.dataLayersDiv);
        } else {
            this.layersDiv.appendChild(this.dataLayersDiv);
            this.layersDiv.appendChild(this.baseLayersDiv);
        }
        this.div.appendChild(this.layersDiv);
        var imgLocation = OpenLayers.Util.getImagesLocation();
        var sz = new OpenLayers.Size(20, 60);
        var img = imgLocation + 'layer-switcher-maximize.png';
        this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MaximizeDiv", null, sz, img, "absolute");
        this.maximizeDiv.style.top = "50%";
        this.maximizeDiv.style.marginTop = "-30px";
        this.maximizeDiv.style.right = "0px";
        this.maximizeDiv.style.left = "";
        this.maximizeDiv.style.display = "none";
        this.maximizeDiv.title = "Layer Control";
        OpenLayers.Event.observe(this.maximizeDiv, "click", OpenLayers.Function.bindAsEventListener(this.maximizeControl, this));
        this.div.appendChild(this.maximizeDiv);
        var img = imgLocation + 'layer-switcher-minimize.png';
        var sz = new OpenLayers.Size(20, 60);
        this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MinimizeDiv", null, sz, img, "absolute");
        this.minimizeDiv.style.top = "50%";
        this.minimizeDiv.style.marginTop = "-30px";
        this.minimizeDiv.style.right = "150px";
        this.minimizeDiv.style.left = "";
        this.minimizeDiv.title = "Layer Control";
        OpenLayers.Event.observe(this.minimizeDiv, "click", OpenLayers.Function.bindAsEventListener(this.minimizeControl, this));
        this.div.appendChild(this.minimizeDiv);
    },
    ignoreEvent: function (evt) {
        OpenLayers.Event.stop(evt);
    },
    mouseDown: function (evt) {
        this.isMouseDown = true;
        this.ignoreEvent(evt);
    },
    mouseUp: function (evt) {
        if (this.isMouseDown) {
            this.isMouseDown = false;
            this.ignoreEvent(evt);
        }
    },
    CLASS_NAME: "OpenLayers.Control.LayerSwitcher"
});
