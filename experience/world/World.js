import * as THREE from "three"
import Experience from '../Experience.js'
import Road from "./Road.js"
import LightCar from "./LightCar.js"
import DeviderRoad from "./DeviderRoad.js"
import LightRoad from "./LightRoad.js"

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.cars = []
        this.carsColor = {
            first: "#ffffff",
            second: "#0400ff",
            third: "#ff1e05",
            fourth: "#ff0000",
        }
        this.carsSpeed = {
            first: 200,
            second: 140,
            third: -150,
            fourth: -190,
        }

        this.road = new Road()
        this.deviderRoad = new DeviderRoad()
        this.lightRoad = new LightRoad(160)
        this.setCars()

        if (this.debug.active)
            this.setDebug()

    }

    setCars() {
        this.firstCar = new LightCar(this.carsColor.first, this.carsSpeed.first, 1)
        this.secondCar = new LightCar(this.carsColor.second, this.carsSpeed.second, 1)
        this.thirdCar = new LightCar(this.carsColor.third, this.carsSpeed.third, -1)
        this.fourthCar = new LightCar(this.carsColor.fourth, this.carsSpeed.fourth, -1)

        this.cars.push(this.firstCar)
        this.cars.push(this.secondCar)
        this.cars.push(this.thirdCar)
        this.cars.push(this.fourthCar)
    }

    setDebug() {
        const CarsFolder = this.debug.ui.addFolder("Cars Folder")
        CarsFolder.addColor(this.carsColor, "first").name("first Car").onChange((value) => {
            this.firstCar.materialLightCar.uniforms.uColor.value = new THREE.Color(value)
        })
        CarsFolder.add(this.carsSpeed, "first").min(-300).max(300).step(0.1).name("speed first car").onFinishChange(() => {
            this.firstCar.materialLightCar.uniforms.uSpeed.value = this.carsSpeed.first
        })

        CarsFolder.addColor(this.carsColor, "second").name("second Car").onChange((value) => {
            this.secondCar.materialLightCar.uniforms.uColor.value = new THREE.Color(value)
        })
        CarsFolder.add(this.carsSpeed, "second").min(-300).max(300).step(0.1).name("speed second car").onFinishChange(() => {
            this.secondCar.materialLightCar.uniforms.uSpeed.value = this.carsSpeed.second
        })

        CarsFolder.addColor(this.carsColor, "third").name("third Car").onChange((value) => {
            this.thirdCar.materialLightCar.uniforms.uColor.value = new THREE.Color(value)
        })
        CarsFolder.add(this.carsSpeed, "third").min(-300).max(300).step(0.1).name("speed third car").onFinishChange(() => {
            this.thirdCar.materialLightCar.uniforms.uSpeed.value = this.carsSpeed.third
        })



        CarsFolder.addColor(this.carsColor, "fourth").name("fourth Car").onChange((value) => {
            this.fourthCar.materialLightCar.uniforms.uColor.value = new THREE.Color(value)
        })
        CarsFolder.add(this.carsSpeed, "fourth").min(-300).max(300).step(0.1).name("speed fourth car").onFinishChange(() => {
            this.fourthCar.materialLightCar.uniforms.uSpeed.value = this.carsSpeed.fourth
        })
    }


    SpeedDown() {
        this.cars.forEach((car) => {
            car.SpeedDown()
        })
        this.lightRoad.SpeedDown()

    }

    SpeedUp() {
        this.cars.forEach((car) => {
            car.SpeedUp()
        })
        this.lightRoad.SpeedUp()
    }

    update() {
        this.cars.forEach((car) => {
            car.update()
        })
        this.lightRoad.update()
    }
}