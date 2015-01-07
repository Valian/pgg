define([], function() {

    return {

        applySettings: function(object, settings) {

            if ( settings === undefined ) return;

            for ( var key in settings ) {

                var newValue = settings[ key ];

                if ( newValue === undefined ) {

                    console.warn( "Apply settings: '" + key + "' parameter is undefined." );
                    continue;

                }

                if ( key in object ) {

                    object[ key ] = newValue;

                }

            }

        },

        update: function(target, source) {

            for(var k in source) {

                target[k] = source[k];

            }

        }

    };

});

