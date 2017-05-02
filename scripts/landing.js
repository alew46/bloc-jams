var points = document.getElementsByClassName("point");


var animatePoints = function(points) {
  
    for (var i = 0; i < points.length; i++) {
       var revealPoints = function() {
         points[i].style.opacity = 1;
         points[i].style.transform = "scaleX(1) translateY(0)";
         points[i].style.msTransform = "scaleX(1) translateY(0)";
         points[i].style.WebkitTransform = "scaleX(1) translateY(0)";  
       };
       
       revealPoints();
        
    };
 
 };

window.onload = function() {
    
    if (window.innerHeight > 950) {
      animatePoints(points);  
    };
    
    var sellingPoints = document.getElementsByClassName("selling-points")[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    
    addEventListener("scroll", function(event) {
        console.log("The current distance from the top is" + sellingPoints.getBoundingClientRect().top + "pixels.");
        if (document.documentElement.scrollTop || document.body.scrollTop <= scrollDistance) {
          animatePoints(points);  
        };
    });
};