define(["three", "jquery"], function(THREE, $) {

    return {

        getShaderMaterial: getShaderMaterial,
        getRawShaderMaterial: getRawShaderMaterial,
        getTexture: getTexture,
        getFile: getFile,
        getJSON: getJSON

    };


    function getShaderMaterial(vertexShaderPath, fragmentShaderPath, data) {

        data = getShaderData(vertexShaderPath, fragmentShaderPath, data);

        return new THREE.ShaderMaterial(data);

    }

    function getRawShaderMaterial(vertexShaderPath, fragmentShaderPath, data) {

        data = getShaderData(vertexShaderPath, fragmentShaderPath, data);

        return new THREE.RawShaderMaterial(data);

    }

    function getShaderData(vertexShaderPath, fragmentShaderPath, data) {

        var shaderCode = loadShaderCode(vertexShaderPath, fragmentShaderPath);

        data = data || {};
        data.vertexShader = shaderCode.vertexShader;
        data.fragmentShader = shaderCode.fragmentShader;

        return data;

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

    function getJSON(path, settings) {

        settings = settings || {};
        if(settings.addParenthesis) {

            var text = getFile(path, settings);
            return JSON.parse('{ ' + text + ' }');

        } else {

            settings.dataType = 'json';
            return ajaxGet(path, settings);

        }

    }

    function getFile(path, settings) {

        settings = settings || {};
        settings.dataType = 'text';
        return ajaxGet(path, settings);

    }

    function ajaxGet(path, settings) {

        var result;
        settings = settings || {};
        settings.async = false;
        settings.url = path;
        settings.success = function(data) {

            result = data;

        };
        settings.error = function(obj, errorCode, exception) {

            console.log("Error while getting " + path + ". error code: " + errorCode + " " + exception);

        };
        $.ajax(settings);

        return result;

    }

});



