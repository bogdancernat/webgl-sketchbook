"use strict";

import THREE from 'three';
import { Display } from './modules/Display';

document.addEventListener("DOMContentLoaded", function() {
    let display = new Display();
    display.init();

    let params = {
        cubeColor: "#e0e2e4"
    };

    let geo = new THREE.BoxGeometry(1, 1, 1)
    let mat = new THREE.MeshLambertMaterial({
        wireframe: false,
        color: params.cubeColor,
        shading: THREE.SmoothShading
    });

    let box = new THREE.Mesh(geo, mat)
    box.castShadow = true;
    display.scene.add(box);

    let gui = new dat.GUI();

    let cubeColorGUI = gui.addColor(params, 'cubeColor');

    cubeColorGUI.onChange(function () {
        box.material.color.setStyle(params.cubeColor);
    });
});