var featherEditor = new Aviary.Feather({
    apiKey:'563f8863f',
    apiVersion:2,
    // tools:'effects',
    noCloseButton:true,
    appendTo:'injection_site',
    onSave:function (imageID, newURL) {
    var img = document.getElementById(imageID);
    img.src = newURL;
    }
});

var AviaryGrid = {
    canvasTimer:null,
    sourceCanvas:null,
    sourceContext:null,
    sourceImageData:null,
    sourceImageDataActual:null,
    output:[]
    };

function launchEditor(id, src) {
    featherEditor.launch({
        image:id,
        url:src
    });
document.getElementById('image1').style.display = 'none';
AviaryGrid.canvasTimer = setInterval(waitAndSetSourceCanvas, 1000);
return false;
}

function waitAndSetSourceCanvas() {
    var el = document.getElementById('avpw_canvas_embed');
    if (el) {
    var canvasArry = el.getElementsByTagName('canvas');
    if (canvasArry) {
    AviaryGrid.sourceCanvas = canvasArry[0];
    }
}

if (AviaryGrid.sourceCanvas) {
    clearInterval(AviaryGrid.canvasTimer);
    addAllEffectsBtn();
    }
}

function initializeGrid() {
    AviaryGrid.filters = [ 'singe', 'vivid', 'sancarmen', 'purple',
        'thresh', 'aqua', 'andy', 'edgewood',
        'joecool', 'bw', 'sepia', 'softfocus'];

    AviaryGrid.sourceContext = AviaryGrid.sourceCanvas.getContext('2d');
    AviaryGrid.sourceImageData = AviaryGrid.sourceContext.getImageData(0, 0, AviaryGrid.sourceCanvas.width, AviaryGrid.sourceCanvas.height);
    AviaryGrid.sourceImageDataActual = AviaryGrid.sourceImageData.data;
    //set source canvas id
    AviaryGrid.sourceCanvas.id = AviaryGrid.sourceCanvas.id != "" ? AviaryGrid.sourceCanvas.id : "sourceCanvasId";

    }

function createGridHTML() {
    var mainEl = AviaryGrid.sourceCanvas.parentNode;
    var parentDiv = document.createElement("div");
    parentDiv.id = "parentDiv";
    parentDiv.style.display = "none";
    //parentDiv.style.top = "15px";
    //parentDiv.className = "avpw_position_by_transform";
    parentDiv.style.overflow = "auto";
    parentDiv.style.height = "400px";
    parentDiv.style.marginLeft = "100px";
    parentDiv.style.marginTop = "30px";

    mainEl.appendChild(parentDiv);
    /*
     var gridHtml = [];
     var counter = 0;
     gridHtml.push("<table id='gridTable' style='padding-bottom:100px;cellspacing:10px' width='800px'>");
     for (var i = 0; i < 4; i++) {
     gridHtml.push("<tr>");
     for (var j = 0; j < 3; j++) {
     var canvasId = 'outputCanvas' + counter;
     gridHtml.push("<td width='260px'><div class='album'><canvas id=",
     canvasId,
     "  style=\"display: block;top:0px; left:0px;position:relative; max-width:250px;\" width='800' height='571 ' >",
     "</canvas><a href=\"javascript:void(0)\" onclick='hideCanvasCell(" + canvasId + ")' class=\"play\"></a></div></td>");

     counter++;
     }
gridHtml.push("</tr>");
}
gridHtml.push("</table>");
*/
var gridHtml = [];
gridHtml.push('<div id="container">');
var counter = 0;
for (var i = 0; i < 12; i++) {
    var canvasId = 'outputCanvas' + counter;
    gridHtml.push('<div class="album"><canvas id=', canvasId,
        '  style=\"display: block;top:0px; left:0px;position:relative; max-width:250px;\" width="800" height="571" >',
        '</canvas><a href="javascript:void(0)" onclick="hideCanvasCell(' + canvasId + ')" class=\"play\"></a></div>');
    counter++;
}

gridHtml.push('</div>');
parentDiv.innerHTML = gridHtml.join("");

//save a reference
AviaryGrid.gridParentDiv = parentDiv;
}


function hideCanvasCell(el) {
    if (el[0]) {
        el = el[0];
    }
    el.nextSibling.style.display = "none";
    el.style.display = 'none';
    $('#container').masonry('reload');
    /*
     var tmp = parseInt(el.id.replace("outputCanvas", ""));
     var rowId = tmp % 4;
     var columnId = tmp % 3;

     var row = document.getElementById("gridTable").rows[rowId];
     row.deleteCell(columnId); */
}

function addAllEffectsBtn() {
    var html = '<div class="avpw_icon_image avpw_tool_icon_image"><div class="avpw_tool_icon_inner"></div></div><div class="avpw_icon_waiter avpw_center_contents"></div><span class="avpw_icon_label avpw_label" style="color:blue;">ALL Effects!</span></div>';
    var newEl = document.createElement('div');
    newEl.className = "avpw_icon avpw_tool_icon";
    newEl.id = "avpw_main_ALLeffects";
    //newEl.setAttribute('data-header', 'f');
    //newEl.setAttribute('data-toolname', 'f');
    newEl.innerHTML = html;
    var effectsEl = document.getElementById('avpw_main_effects');
    effectsEl.parentNode.insertBefore(newEl, effectsEl.nextSibling);
    newEl.onclick = function () {
        triggerAllEffects()
    };

}

function triggerAllEffects() {
    //hide some of the artifacts..
    document.getElementById('avpw_zoom_container').style.display = 'none';

    //create grid html & show grid
    createGridHTML();

    initializeGrid();
    AviaryGrid.sourceCanvas.style.display = "none";
    AviaryGrid.gridParentDiv.style.display = "block";

    var filtersLen = AviaryGrid.filters.length;
    for (var i = 0; i < filtersLen; i++) {
        addFilter('outputCanvas' + i, AviaryGrid.filters[i], i);
    }
    applyMasonry();
}

function addFilter(outputCanvasId, filterName, index) {
    var outObj = AviaryGrid.output[index] = {};
    outObj.outCanvas = document.getElementById(outputCanvasId);
    outObj.outContext = outObj.outCanvas.getContext('2d');

    outObj.outImageData = outObj.outContext.getImageData(0, 0, outObj.outCanvas.width, outObj.outCanvas.height);
    outObj.outImageDataActual = outObj.outImageData.data;

    var aviaryFunction = Aviary.paintWidgetInstance.filterManager.getEffectById(filterName);
    aviaryFunction(outObj.outImageDataActual, AviaryGrid.sourceImageDataActual, outObj.outCanvas.width, outObj.outCanvas.height);
    outObj.outContext.putImageData(outObj.outImageData, 0, 0);
}

function applyMasonry() {
    $(function () {
        $('#container').masonry({
            // options
            itemSelector:'.album',
            columnWidth:300,
            isAnimated:true
        });
    });
}


