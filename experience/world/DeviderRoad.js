import * as THREE from "three"
import roadVertex from "../../shaders/deviderRoad/vertex.glsl"
import roadFagment from "../../shaders/deviderRoad/fragment.glsl"
import Experience from '../Experience.js'



export default class DeviderRoad {
    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.options = this.experience.options
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.deviderRoadColor = "#1c1f26"
        this.speed = this.options.baseSpeed
        this.speedTarget = this.options.baseSpeed



        this.setGeometery()
        this.setMaterial()
        this.setMesh()
        if (this.debug.active)
            this.setDebug()
    }

    setGeometery() {
        this.deviderRoadGeometry = new THREE.PlaneGeometry(2, this.options.lengthRoad, 20, 200)
    }

    setMaterial() {
        this.deviderRoadMaterial = new THREE.ShaderMaterial({
            vertexShader: roadVertex,
            fragmentShader: roadFagment,
            uniforms: {
                uColor: { value: new THREE.Color(this.deviderRoadColor) },
                uDistortionX: { value: new THREE.Vector2(this.options.roadXAmplitude, this.options.roadXFrequency) },
                uDistortionY: { value: new THREE.Vector2(this.options.roadYAmplitude, this.options.roadYFrequency) },
                uBaseSpeed: { value: this.options.baseSpeed },
                uTravelLength: { value: this.options.lengthRoad },
                uTime: { value: 0 },
            }
        })

    }

    setMesh() {
        this.deviderRoadMesh = new THREE.Mesh(this.deviderRoadGeometry, this.deviderRoadMaterial)
        this.deviderRoadMesh.rotation.x = -Math.PI / 2
        this.deviderRoadMesh.position.z = this.options.lengthRoad / 2;
        this.deviderRoadMesh.position.y += 1
        this.scene.add(this.deviderRoadMesh)
    }

    SpeedDown() {
        this.speedTarget = this.options.baseSpeed + this.options.amountIncreaseBaseSpeed

    }

    SpeedUp() {
        this.speedTarget = this.options.baseSpeed

    }
    lerp(current, target, speed = 0.1, limit = 0.001) {
        let change = (target - current) * speed;
        if (Math.abs(change) < limit) {
            change = target - current;
        }
        return change;
    }

    update() {
        this.speed += this.lerp(this.speed, this.speedTarget, 0.01);
        this.progress = (this.progress || 0) + this.speed * this.time.delta;

        this.deviderRoadMaterial.uniforms.uBaseSpeed.value = this.speed;
        this.deviderRoadMaterial.uniforms.uTime.value = this.progress;
    }


    setDebug() {
        const DeviderRoadFolder = this.debug.ui.addFolder("Devider Road")
        DeviderRoadFolder.addColor(this, "deviderRoadColor").name("raod Color").onChange((value) => {
            this.deviderRoadMaterial.uniforms.uColor.value = new THREE.Color(value)
        })
    }
}