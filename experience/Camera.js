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
        this.speedTarget = this.options.baseSpeed


        this.setInstance()
        this.setControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(65, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.instance.position.set(20, 20, 20)
        this.scene.add(this.instance)
    }

    setControls() {
        // this.controls = new OrbitControls(this.instance, this.canvas)
        // this.controls.enableDamping = true
        // this.controls.enableRotate = false
        // this.controls.enableZoom = false
        // this.controls.enablePan = false
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    increaseFov() {
        this.speedTarget = this.options.baseSpeed + this.options.amountIncreaseBaseSpeed
        this.fovTarget = 95
    }

    decreseFov() {
        this.speedTarget = this.options.baseSpeed
        this.fovTarget = 65
    }
    lerp(current, target, speed = 0.1, limit = 0.001) {
        let change = (target - current) * speed;
        if (Math.abs(change) < limit) {
            change = target - current;
        }
        return change;
    }

    update() {
        // this.controls.update()


        this.speed += this.lerp(this.speed, this.speedTarget, 0.01);
        this.progress = (this.progress || 0) + this.speed * this.time.delta;
        let posX = this.options.roadXAmplitude * Math.sin((this.progress + 190) * this.options.roadXFrequency);
        let posY = this.options.roadYAmplitude * Math.sin((this.progress + 190) * this.options.roadYFrequency);
        this.instance.position.set(posX, posY + 6, 190);

        const lookTarget = new THREE.Vector3(
            posX,
            posY + posY * 0.2,
            215
        );
        this.instance.lookAt(lookTarget);

        this.instance.fov += this.lerp(this.instance.fov, this.fovTarget, 0.1) * this.time.delta * 0.01
        this.instance.updateProjectionMatrix();
    }
}