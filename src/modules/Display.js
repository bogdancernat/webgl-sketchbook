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
            this.devicePixelRatio = 1;
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
        let renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer = renderer;

        // enable shading
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        document.body.appendChild(renderer.domElement);
        // camera
        let camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 10000);
        camera.position.set(0, 3, 3);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.scene.add(camera);
        this.camera = camera

        // controls
        this.controls = new Controls(this.camera);

        // lights
        let mainGlobalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        mainGlobalLight.color.setHSL(0.6, 1, 0.6);
        mainGlobalLight.groundColor.setHSL(0.095, 1, 0.75);
        mainGlobalLight.position.set(0, 500, 0);

        this.scene.add(mainGlobalLight);
        this.mainGlobalLight = mainGlobalLight;

        let mainDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
        mainDirectionalLight.color.setHSL(0.1, 1, 0.95);
        mainDirectionalLight.position.set(-1, 1.75, 1);
        mainDirectionalLight.position.multiplyScalar(50);

        this.scene.add(mainDirectionalLight);
        this.mainDirectionalLight = mainDirectionalLight;

        // stats
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        // window resize event
        window.addEventListener('resize', (event) => {
            this._updateRendererSize();
        });

        this.initialized = true;
        
        this._updateRendererSize();
        this._updateClearColor();

        this._animate();
    }

    _animate() {
        this.stats.begin();

        this.renderer.render(this.scene, this.camera);

        this.stats.end();
        requestAnimationFrame(this._animate.bind(this));
    }

    get mainScene() {
        return this.scene;
    }

    get mainCamera() {
        return this.camera;
    }

    get size() {
        return {
            width: this.width,
            height: this.height,
            devicePixelRatio: this.devicePixelRatio
        }
    }

    set size(dimensions) {
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.devicePixelRatio = dimensions.devicePixelRatio;
        this.camera.aspect = this.width / this.height;

        this.renderer.setSize(this.width * this.devicePixelRatio, this.height * this.devicePixelRatio);
        this.renderer.domElement.style.width = '100vw';
        this.renderer.domElement.style.height = '100vh';
        this.camera.updateProjectionMatrix();
    }

    get clearColorAlpha() {
        return this._clearColorAlpha;
    }

    set clearColorAlpha(alpha) {
        this._clearColorAlpha = alpha;

        this._updateClearColor();
    }

    get clearColor() {
        return this._clearColor;
    }

    set clearColor(color) {
        this._clearColor = color;
        this._updateClearColor();
    }

    _updateClearColor() {
        this.renderer.setClearColor(this._clearColor, this._clearColorAlpha);
    }

    _updateRendererSize() {
        this.size = {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1
        };
    }
}

export {
    Display
};