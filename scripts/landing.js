var animatePoints = function() {
 
    var points = document.getElementsByClassName("point");
 
    for (i = 0; i < points.length; i++) {
       var revealPoints = function() {
         points[i].style.opacity = 1;
         points[i].style.transform = "scaleX(1) translateY(0) rotate(180deg)";
         points[i].style.msTransform = "scaleX(1) translateY(0) rotate(180deg)";
         points[i].style.WebkitTransform = "scaleX(1) translateY(0) rotate(180deg)";  
       };
       
       revealPoints();
        
    };
 
 };

animatePoints();