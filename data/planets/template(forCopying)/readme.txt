HOW TO CREATE NEW PLANET TYPE

First, copy content of this folder to a new folder in "data/planets",
name of created folder will be a name for new planet type.

Default properties of a planet are taken from file "data/planets/properties.json".
You can override them in file "properties.json" in planet folder. For list of
available properties, look into default file.

You can also override three default shaders:
1. heightmap generation fragment shader "heightmapFragment.frag"
2. planet vertex shader "planetVertex.vert"
3. planet fragment shader "planetFragment.frag"

if you don't want to override some of them, don't put them into planet folder.

To debug planet type, change value of "debugPlanetName" in "config/pgg.json"
and set "debug" to "true".

NOTE:
available uniforms

"uniforms": {

    float: { type: "f", value: "1.5"},
    int: { type: "i", value: "1"},
    texture: { type: "t", value; "tex_name_in_planet_folder"},
    texture_example: { type: "t", value: "test.png" },          // for file "data/planets/my_planet_type/test.png"

}

defined uniforms are avaiable in planet shaders.

NOTE2:
"noiseMultipliers" contains array of two float values. First one
represents what part of final heightmap will be that octave, second
one is frequency value for octave. You can override how heightmap is
created in heightmapFragment.frag file.
