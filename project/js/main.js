/* Importing Three.js */
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

/* Creating a scene, camera and renderer for my model */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

let object;
const loader = new GLTFLoader();
camera.position.z = 20;

/* Adding light to the model */
const topLight = new THREE.DirectionalLight(0xffffff, 2);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 2);
scene.add(ambientLight);

/* Adding controls to let the user control the model */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

/* Function to animate the model */
function animate() {
    requestAnimationFrame(animate);
    if (object) {
        object.rotation.y += 0.001;
    }
    controls.update();
    renderer.render(scene, camera);
}

/* Adjusting camera and renderer size when window is resized */
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* Function to change the camera view */
function changeView(view) {
    switch (view) {
        case 'top':
            camera.position.set(0, 20, 0);
            camera.lookAt(0, 0, 0);
            topLight.position.set(0, 20, 0);
            break;
        case 'bottom':
            camera.position.set(0, -20, 0);
            camera.lookAt(0, 0, 0);
            topLight.position.set(0, -20, 0);
            break;
        case 'left':
            camera.position.set(-20, 0, 0);
            camera.lookAt(0, 0, 0);
            topLight.position.set(500, 500, 500);
            break;
        case 'right':
            camera.position.set(20, 0, 0);
            camera.lookAt(0, 0, 0);
            topLight.position.set(500, 500, 500);
            break;
    }
}

/* Function to show the 3D model and hiding the image */
function show3D() {
    document.getElementById("container3D").style.display = "block";
    document.getElementById("drinkImage").style.display = "none";
}

/* Function to show the image and hide the 3D model */
function showImage() {
    document.getElementById("container3D").style.display = "none";
    document.getElementById("drinkImage").style.display = "block";
}

/* Function to change the lighting */
function changeLighting(direction) {
    switch (direction) {
        case 'normal':
            topLight.position.set(1, 0, 0);
            break;
        case 'top':
            topLight.position.set(0, 20, 0);
            break;
        case 'bottom':
            topLight.position.set(0, -20, 0);
            break;
    }
}

/* Function to show the wire frame version of model */
function toggleWireframe() {
    if (object) {
        object.traverse((node) => {
            if (node.isMesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
    }
}

/* Function to load the correct model */
function loadModel(name) {
    $.getJSON('models.json', function(data) {
        const modelData = data.models.find(model => model.name === name);
        if (modelData) {
            $('#modelInfo').html(`
                <h2>About ${modelData.name}</h2>
                <p>${modelData.description}</p>
            `);
            document.getElementById("drinkImage").src = modelData.imagePath;
            load3DModel(modelData.modelPath);
            show3D();
        } else {
            console.error("Model not found:", name);
        }
    }).fail(function(jqxhr, textStatus, error) {
        console.error("Request failed:", textStatus, error);
    });
}

/* Function to load the model and show it on the scene */
function load3DModel(path) {
    if (object) {
        scene.remove(object);
    }
    loader.load(path, function (gltf) {
        object = gltf.scene;
        object.scale.set(8, 8, 8);

        const box = new THREE.Box3().setFromObject(object);
        const boxSize = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());

        object.position.set(-boxCenter.x, -boxCenter.y - (boxSize.y / 15), -boxCenter.z);
        scene.add(object);

        animate();
    }, undefined, function (error) {
        console.error("Error loading model:", error);
    });
}

/* Making the functions global */
window.toggleWireframe = toggleWireframe;
window.changeLighting = changeLighting;
window.changeView = changeView;
window.show3D = show3D;
window.showImage = showImage;
window.loadModel = loadModel;
