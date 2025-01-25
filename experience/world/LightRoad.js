import * as THREE from "three"
import roadVertex from "../../shaders/lightRoad/vertex.glsl"
import roadFagment from "../../shaders/lightRoad/fragment.glsl"
import Experience from '../Experience.js'



export default class LightRoad {
    constructor(speed) {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.options = this.experience.options
        this.debug = this.experience.debug

        this.time = this.experience.time
        this.speed = speed
        this.speedUpTarget = 0;


        this.speedBase = this.options.baseSpeed
        this.speedTargetBase = this.options.baseSpeed

        this.setGeometry()
        this.setAttribute()
        this.setMaterial()
        this.setMesh()

        if (this.debug.active)
            this.setDebug()
    }

    setGeometry() {
        this.lightCarGeometry = new THREE.PlaneGeometry(10, 10);
        this.instanceLightCarGeometry = new THREE.InstancedBufferGeometry().copy(this.lightCarGeometry)
        this.instanceLightCarGeometry.instanceCount = this.options.countPairCar
    }

    setAttribute() {
        this.aOffset = new Float32Array(this.options.countPairCar * 3)

        for (let i = 0; i < this.options.countPairCar; i++) {


            const i3 = i * 3
            this.aOffset[i3] = 0
            this.aOffset[i3 + 1] = 0
            this.aOffset[i3 + 2] = (this.options.lengthRoad / this.options.countPairCar * 2) * i

        }
        this.instanceLightCarGeometry.setAttribute(
            "aOffset",
            new THREE.InstancedBufferAttribute(this.aOffset, 3, false)
        );
    }

    setMaterial() {
        this.materialLightCar = new THREE.ShaderMaterial({
            vertexShader: roadVertex,
            fragmentShader: roadFagment,
            uniforms: {
                uColor: { value: new THREE.Color("#ffffff") },
                uTime: { value: 0 },
                uSpeed: { value: this.speed },
                uTravelLength: { value: this.options.lengthRoad },
                uDistortionX: { value: new THREE.Vector2(this.options.roadXAmplitude, this.options.roadXFrequency) },
                uDistortionY: { value: new THREE.Vector2(this.options.roadYAmplitude, this.options.roadYFrequency) },
                uBaseSpeed: { value: this.options.baseSpeed },
            },
            side: THREE.DoubleSide,
        });
    }

    setMesh() {
        this.lightCarMesh = new THREE.Mesh(this.instanceLightCarGeometry, this.materialLightCar);
        this.lightCarMesh.scale.set(0.15, 0.08, 0.15)
        this.lightCarMesh.rotation.y = Math.PI / 2
        this.lightCarMesh.rotation.x = Math.PI / 2
        this.lightCarMesh.position.x = this.options.widthRoad / 2 - 0.5
        this.lightCarMesh.frustumCulled = false
        this.scene.add(this.lightCarMesh)
    }

    SpeedDown() {
        this.speedUpTarget = this.speed + this.options.amountIncreaseSpeed;
        this.materialLightCar.uniforms.uSpeed.value = this.speedUpTarget

        this.speedTargetBase = this.options.baseSpeed + this.options.amountIncreaseBaseSpeed
    }

    SpeedUp() {
        this.speedUpTarget = this.speed;
        this.materialLightCar.uniforms.uSpeed.value = this.speedUpTarget

        this.speedTargetBase = this.options.baseSpeed
    }

    lerp(current, target, speed = 0.1, limit = 0.001) {
        let change = (target - current) * speed;
        if (Math.abs(change) < limit) {
            change = target - current;
        }
        return change;
    }



    update() {
        this.speedBase += this.lerp(this.speedBase, this.speedTargetBase, 0.01);
        this.progress = (this.progress || 0) + this.speedBase * this.time.delta;

        this.materialLightCar.uniforms.uBaseSpeed.value = this.speedBase;
        this.materialLightCar.uniforms.uTime.value = this.progress;
    }

    setDebug() {
        const lightRoadFolder = this.debug.ui.addFolder("Light Road")
        lightRoadFolder.add(this, "speed").min(-300).max(300).step(0.01).name("light Road Speed").onChange(() => {
            this.materialLightCar.uniforms.uSpeed.value = this.speed
        })
    }
}