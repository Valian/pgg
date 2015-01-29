define(["resources"], function(resources) {

    var dataUrl = "/data/load/";
    var data = resources.getJSON(dataUrl, {cache: false});

    return data;

});
