var builderEmailClean = true;

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
}

function getDomainFromOption(element) {
    var e = element[0];
    var option = e.options[e.selectedIndex];
    var domain = option.getAttribute("data-domain");
    return domain || '';
}

function generateEmail(name, domain) {
    if (!name || !domain) { return false; }
    var emailPrefix = name.toLowerCase().trim().replace(" ", ".");
    return `${emailPrefix}@${domain}`;
}

function dirtyEmail() {
    builderEmailClean = false;
    $("#dirtyEmailStatus").show();
}

function updateEmail() {
    if (!builderEmailClean) { return false; }
    
    // Get basic form fields
    var email = $("input[name=email]").val();
    var name = $("input[name=name]").val();
    var template = $("select[name=template]").val();
    
    // Validation
    var hasNameAndTemplate = (name && template);
    if (!hasNameAndTemplate) { return false; }
    
    // Get the domain from the template
    var domain = getDomainFromOption($("select[name=template]"));
    if (!domain) { return false; }
    
    // Generate and update the email field
    var email = generateEmail(name, domain);
    if (!email) { return false; }
    $("input[name=email]").val(email);
}

$(function() {
    $("input[name=email]").on("change", dirtyEmail);
    $("input[name=name]").on("blur", updateEmail);
    $("select[name=template]").on("change", updateEmail);
});
