var arr = [ {"id":"10", "class": "child-of-9"}, {"id":"11", "classd": "child-of-10"}];

for (var i = 0; i < arr.length; i++){
    var obj = arr[i];
    for (var key in obj){
        var attrName = key;
        var attrValue = obj[key];
        console.log(attrValue)
    }

}