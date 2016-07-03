import THREE from 'three';
import OrbitControls from 'three-orbit-controls';
import Stats from 'stats.js';

let instance = null;

class Display {
    constructor() {
        if (!instance) {
            instance = this;
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this._clearColor = new THREE.Color(0x3F3F47);
            this._clearColorAlpha = 0.9;
            this.initialized = false;
        }

        return instance;
    }

    init() {
        let Controls = OrbitControls(THREE);

        if (this.initialized) {
            return;
        }

        // scene
        this.scene = new THREE.Scene();

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(this.width, this.height);
        this._updateClearColor();

        // enable shading
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;

        document.body.appendChild(this.renderer.domElement);

        // camera
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 10000);
        this.camera.position.set(0, 3, 3);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.scene.add(this.camera);

        // controls
        this.controls = new Controls(this.camera);

        // lights
        this.mainGlobalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        this.mainGlobalLight.color.setHSL(0.6, 1, 0.6);
        this.mainGlobalLight.groundColor.setHSL(0.095, 1, 0.75);
        this.mainGlobalLight.position.set(0, 500, 0);

        this.scene.add(this.mainGlobalLight);

        this.mainDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.mainDirectionalLight.color.setHSL(0.1, 1, 0.95);
        this.mainDirectionalLight.position.set(-1, 1.75, 1);
        this.mainDirectionalLight.position.multiplyScalar(50);

        this.scene.add(this.mainDirectionalLight);

        // stats
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        // window resize event
        window.addEventListener('resize', (event) => {
            this.size = {
                width: window.innerWidth,
                height: window.innerHeight
            };
        });

        this.initialized = true;

        this.animate();
    }

    animate() {
        this.stats.begin();

        this.renderer.render(this.scene, this.camera);

        this.stats.end();
        requestAnimationFrame(this.animate.bind(this));
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    get size() {
        return {
            width: this.width,
            height: this.height
        }
    }

    set size(dimensions) {
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.camera.aspect = this.width / this.height;

        this.renderer.setSize(this.width, this.height);
        this.camera.updateProjectionMatrix();
    }

    get clearColorAlpha() {
        return this._clearColorAlpha;
    }

    set clearColorAlpha(alpha) {
        this._clearColorAlpha = alpha;

        _updateClearColor();
    }

    get clearColor() {
        return this._clearColor;
    }

    set clearColor(color) {
        this._clearColor = color;

        _updateClearColor();
    }

    _updateClearColor() {
        this.renderer.setClearColor(this.clearColor, this.clearColorAlpha);
    }
}

export {
    Display
};