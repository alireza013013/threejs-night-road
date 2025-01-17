import * as THREE from "three"
import Experience from '../Experience.js'
import lightCarVertex from "../../shaders/lightCar/vertex.glsl"
import lightCarFagment from "../../shaders/lightCar/fragment.glsl"


export default class LightCar {
    constructor(color, speed, direction) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.options = this.experience.options
        this.time = this.experience.time
        this.color = color
        this.speed = speed
        this.direction = direction
        this.speedUpTarget = 0;
        this.speedUp = 0;
        this.timeOffset = 0;

        this.setGeometry()
        this.setAttribute()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        const curve = new THREE.LineCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1)
        )
        this.lightCarGeometry = new THREE.TubeGeometry(curve, 25, 1, 8, false);
        this.instanceLightCarGeometry = new THREE.InstancedBufferGeometry().copy(this.lightCarGeometry)
        this.instanceLightCarGeometry.instanceCount = this.options.countPairCar
    }

    setAttribute() {
        this.aOffset = new Float32Array(this.options.countPairCar * 3)
        this.aMetrics = new Float32Array(this.options.countPairCar * 2);
        this.widthSection = this.options.widthRoad / this.options.roadSection

        for (let i = 0; i < this.options.countPairCar; i++) {
            let radius = Math.random() * 0.6 + 0.6;
            let length =
                Math.random() * this.options.lengthRoad * 0.6 + 6
            const line = i % 3
            const offsetX = this.direction * ((this.widthSection / 4) * line + (this.widthSection) / 6 + Math.random() * radius * 1.5)

            const offsetZ = Math.random() * this.options.lengthRoad;

            const i6 = i * 6
            this.aOffset[i6] = offsetX + radius / 4
            this.aOffset[i6 + 1] = radius / 1.5
            this.aOffset[i6 + 2] = offsetZ
            this.aOffset[i6 + 3] = offsetX - radius / 4
            this.aOffset[i6 + 4] = radius / 1.5
            this.aOffset[i6 + 5] = offsetZ


            const i4 = i * 4
            this.aMetrics[i4] = radius
            this.aMetrics[i4 + 1] = length
            this.aMetrics[i4 + 2] = radius
            this.aMetrics[i4 + 3] = length

        }
        this.instanceLightCarGeometry.setAttribute(
            "aOffset",
            new THREE.InstancedBufferAttribute(this.aOffset, 3, false)
        );
        this.instanceLightCarGeometry.setAttribute(
            "aMetrics",
            new THREE.InstancedBufferAttribute(this.aMetrics, 2, false)
        );


    }

    setMaterial() {
        this.materialLightCar = new THREE.ShaderMaterial({
            vertexShader: lightCarVertex,
            fragmentShader: lightCarFagment,
            uniforms: {
                uColor: { value: new THREE.Color(this.color) },
                uTime: { value: 0 },
                uSpeed: { value: this.speed },
                uTravelLength: { value: this.options.lengthRoad },
                uDistortionX: { value: new THREE.Vector2(10, 10) },
                uDistortionY: { value: new THREE.Vector2(12, 5) },
            },
            side: THREE.FrontSide,
            // blending: THREE.AdditiveBlending,
            // transparent: true
        });
    }

    setMesh() {
        this.lightCarMesh = new THREE.Mesh(this.instanceLightCarGeometry, this.materialLightCar);
        this.lightCarMesh.scale.set(0.15, 0.15, 0.15)
        this.scene.add(this.lightCarMesh)
    }

    SpeedDown() {
        this.speedUpTarget = 0.002;

    }

    SpeedUp() {
        this.speedUpTarget = 0;
    }

    lerp(current, target, speed = 0.1, limit = 0.001) {
        let change = (target - current) * speed;
        if (Math.abs(change) < limit) {
            change = target - current;
        }
        return change;
    }

    update() {
        let coefficient = -60 * Math.log2(1 - 0.1);
        let lerpT = Math.exp(-coefficient * this.time.delta);
        this.speedUp += this.lerp(
            this.speedUp,
            this.speedUpTarget,
            lerpT,
            0.00001
        );
        this.timeOffset += this.speedUp * this.time.delta;

        this.materialLightCar.uniforms.uTime.value = this.time.elapsedTime + this.timeOffset
    }
}