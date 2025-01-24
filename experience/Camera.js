import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.options = this.experience.options
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.fovTarget = 45
        this.speed = this.options.baseSpeed


        this.setInstance()
        this.setControls()
        if (this.debug.active)
            this.setDebug()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 1000)
        // this.instance.position.set(3, 24, this.options.lengthRoad + 20)
        this.instance.position.set(-100, 200, -100)
        // this.instance.position.set(9, 20, 1)

        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        // this.controls.enableRotate = false
        // this.controls.enableZoom = false
        // this.controls.enablePan = false
    }

    setDebug() {
        const cameraFolder = this.debug.ui.addFolder("Camera")
        cameraFolder.add(this.instance.position, "z").min(-10).max(10000).step(0.0001).name("z camera")
        cameraFolder.add(this.instance.position, "y").min(-10).max(100).step(0.0001).name("y camera")
        cameraFolder.add(this.instance, "fov").min(10).max(100).step(0.01).name("fov camera").onChange(() => {
            this.resize()
        })
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    increaseFov() {
        this.speed = this.options.baseSpeed + this.options.amountIncreaseBaseSpeed
        this.fovTarget = 65
    }

    decreseFov() {
        this.speed = this.options.baseSpeed
        this.fovTarget = 45
    }
    lerp(current, target, speed = 0.1, limit = 0.001) {
        let change = (target - current) * speed;
        if (Math.abs(change) < limit) {
            change = target - current;
        }
        return change;
    }

    update() {
        this.controls.update()
        // this.speed += this.lerp(this.speed, this.speed + this.options.amountIncreaseBaseSpeed, 0.1)
        let progress = this.time.elapsedTime * this.speed + 100;
        let posX = this.options.roadXAmplitude * Math.sin(progress * this.options.roadXFrequency);
        let posY = this.options.roadYAmplitude * Math.sin(progress * this.options.roadYFrequency);
        this.instance.position.set(posX, posY + 3, 100);
        const lookTarget = new THREE.Vector3(
            posX,
            posY + 4,
            130
        );
        this.instance.lookAt(lookTarget);

        this.instance.fov += this.lerp(this.instance.fov, this.fovTarget, 0.1)
        this.instance.updateProjectionMatrix();
    }
}