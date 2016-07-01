"use strict";

let scene, camera, renderer, light;

init();
animate();

function init() {
    // scene
    scene = new THREE.Scene();

    let width = window.innerWidth;
    let height = window.innerHeight;

    // renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(width, height);
    renderer.setClearColor(new THREE.Color(0x3F3F47), 0.7);

    document.body.appendChild(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000);
    camera.position.set(0, 6, 0);

    scene.add(camera);

    // resize event
    window.addEventListener('resize', (event) => {
        let width = window.innerWidth;
        let height = window.innerHeight;

        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // light
    light = new THREE.PointLight(0xffffff);
    light.position.set(-100, 200, 100);
    scene.add(light);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
