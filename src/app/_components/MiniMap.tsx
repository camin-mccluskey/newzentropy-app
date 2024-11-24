'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PCA } from '~/lib/pca'

interface MiniMapProps {
  userVector: number[]
  storyVector: number[]
}

const MiniMap: React.FC<MiniMapProps> = ({ userVector, storyVector }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
    sceneRef.current = scene

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(2, 2, 4)

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controlsRef.current = controls

    // Add coordinate grid
    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0x444444)
    scene.add(gridHelper)

    // Add coordinate axes
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    // Function to perform PCA reduction
    const reduce = (): [[number, number, number], [number, number, number]] => {
      const pca = new PCA()
      const data = [userVector, storyVector]
      pca.fit(data)
      const [reducedUserVector, reducedStoryVector] = pca.transform(data)
      console.log('post pca', userVector, reducedUserVector, storyVector, reducedStoryVector)

      return [reducedUserVector, reducedStoryVector] as [
        [number, number, number],
        [number, number, number],
      ]
    }

    // Create vector arrows
    const createVector = (points: [number, number, number], color: number): THREE.Mesh[] => {
      const [x, y, z] = points
      const length = Math.sqrt(x * x + y * y + z * z)

      // Create arrow body
      const bodyGeometry = new THREE.CylinderGeometry(0.01, 0.01, length, 8)
      const bodyMaterial = new THREE.MeshPhongMaterial({ color })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)

      // Create arrow head
      const headGeometry = new THREE.ConeGeometry(0.05, 0.2, 8)
      const headMaterial = new THREE.MeshPhongMaterial({ color })
      // const head = new THREE.Mesh(headGeometry, headMaterial)

      // // Position and rotate arrow components
      // body.position.set(x / 2, y / 2, z / 2)
      // body.lookAt(new THREE.Vector3(x, y, z))
      // // body.rotateX(Math.PI / 2)
      //
      // head.position.set(x, y, z)
      // head.lookAt(new THREE.Vector3(x, y, z))
      // // head.rotateX(Math.PI / 2)
      //
      // return [body, head]
    }

    // Perform PCA reduction
    const [userVectorReduced, storyVectorReduced] = reduce()

    // Add vectors to scene
    // const userVectorParts = createVector(userVectorReduced, THREE.Color.NAMES.blue)
    // const storyVectorParts = createVector(storyVectorReduced, THREE.Color.NAMES.red)
    // console.log(userVectorReduced, storyVectorReduced)
    // userVectorParts.forEach((part) => scene.add(part))
    // storyVectorParts.forEach((part) => scene.add(part))
    //

    const threeUserVector = new THREE.Vector3(...userVector)
    const userVectorObj = new THREE.ArrowHelper(
      threeUserVector.clone().normalize(),
      undefined,
      threeUserVector.clone().length(),
      0x0000ff,
    )
    scene.add(userVectorObj)

    const threeStoryVector = new THREE.Vector3(...storyVector)
    const storyVectorObj = new THREE.ArrowHelper(
      threeStoryVector.clone().normalize(),
      undefined,
      threeStoryVector.clone().length(),
      0x0000ff,
    )
    scene.add(storyVectorObj)

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(2, 4, 2)
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      if (controlsRef.current) {
        controlsRef.current.update()
      }
      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera)
      }
    }
    animate()

    // Handle resize
    const handleResize = () => {
      const container = containerRef.current
      const renderer = rendererRef.current
      if (!container || !renderer) return

      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      const container = containerRef.current
      const renderer = rendererRef.current
      if (container && renderer) {
        container.removeChild(renderer.domElement)
        renderer.dispose()
      }
      if (sceneRef.current) {
        sceneRef.current.clear()
      }
    }
  }, [storyVector, userVector])

  return <div ref={containerRef} style={{ width: '100%', height: '500px', position: 'relative' }} />
}

export { MiniMap }
