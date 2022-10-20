
function selectBlock(containerid) {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
    return false;
}

function showInstructions(shownId) {
    var divsToHide = document.getElementsByClassName("instructionPanel");
    for (var i = 0; i < divsToHide.length; i++) {
        divsToHide[i].style.display = "none";
    }
    document.getElementById(shownId).style.display = "block";
    // location.hash = "#" + shownId;
}

