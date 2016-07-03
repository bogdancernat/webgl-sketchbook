"use strict";

import THREE from 'three';
import { Display } from './modules/Display';

document.addEventListener("DOMContentLoaded", function() {
    let display = new Display();
    display.init();

    var geo = new THREE.BoxGeometry(1, 1, 1)
    var mat = new THREE.MeshLambertMaterial({
        wireframe: false,
        color: 0xe0e2e4,
        shading: THREE.SmoothShading
    });

    var box = new THREE.Mesh(geo, mat)
    box.castShadow = true;
    display.scene.add(box);
});