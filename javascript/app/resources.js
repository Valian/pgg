define(["three", "jquery"], function(THREE, $) {

    return {

        getShaderMaterial: getShaderMaterial,
        getTexture: getTexture,
        getFile: ajaxGet,

    };


    function getShaderMaterial(vertexShaderPath, fragmentShaderPath) {

        var shaderCode = loadShaderCode(vertexShaderPath, fragmentShaderPath);
        var shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: shaderCode.vertexShader,
            fragmentShader: shaderCode.fragmentShader,
        });

        return shaderMaterial;

    }

    function getTexture(path) {

        return THREE.ImageUtils.loadTexture(path);

    }

    function loadShaderCode(vertexShaderPath, fragmentShaderPath) {

        return {
            vertexShader: ajaxGet(vertexShaderPath),
            fragmentShader: ajaxGet(fragmentShaderPath),
        }

    }

    function ajaxGet(path) {

        var result;

        $.ajax({
            async: false,
            url: path,
            success: function(data) {
                result = data;
            },
            error: function(obj, errorCode, exception) {
                console.log("Error while getting " + path + ". error code: " + errorCode + " " + exception);
            },
        })

        return result;

    }

});



