var forEach = function(theArray, theCallback) {
  
    for(var i = 0; i < theArray.length; i++) {
        theCallback(theArray[i]);
    };
    
};