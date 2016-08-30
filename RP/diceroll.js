$(document).ready(function(){
    $("#extras").slideUp(0);
    $("#topbar").click(function(){
        $("#extras").slideToggle(1000); 
    });
});