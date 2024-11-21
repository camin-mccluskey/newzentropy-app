import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

interface Vector {
  dimensions: number[]
}

interface MiniMapProps {
  vector1: Vector
  vector2: Vector
}

const performPCA = (vectors: number[][]): number[][] => {
  const mean = vectors[0]?.map(
    (_, colIndex) => vectors.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0) / vectors.length,
  )

  const centeredData = vectors.map((vector) => vector.map((value, index) => value - mean[index]))

  // Simplified PCA - in production use a proper linear algebra library
  const reducedData = centeredData.map((vector) => [
    vector.slice(0, 3).reduce((sum, val) => sum + val, 0),
    vector.slice(3, 6).reduce((sum, val) => sum + val, 0),
    vector.slice(6, 9).reduce((sum, val) => sum + val, 0),
  ])

  return reducedData
}

const MiniMap: React.FC<MiniMapProps> = ({ vector1, vector2 }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const labelRendererRef = useRef<CSS2DRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
    sceneRef.current = scene

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(3, 3, 5)
    cameraRef.current = camera

    // Set up WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Set up CSS2D renderer for labels
    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0'
    labelRenderer.domElement.style.pointerEvents = 'none'
    containerRef.current.appendChild(labelRenderer.domElement)
    labelRendererRef.current = labelRenderer

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight)

    // Perform PCA
    const reducedVectors = performPCA([vector1.dimensions, vector2.dimensions])

    // Create vector arrows with labels
    const createVector = (points: number[], color: THREE.ColorRepresentation, label: string) => {
      const [x, y, z] = points
      const length = Math.sqrt(x * x + y * y + z * z)
      const direction = new THREE.Vector3(x, y, z).normalize()

      const arrowHelper = new THREE.ArrowHelper(
        direction,
        new THREE.Vector3(0, 0, 0),
        length,
        color,
        length * 0.2,
        length * 0.1,
      )

      // Create and position label
      const labelDiv = document.createElement('div')
      labelDiv.className = 'label'
      labelDiv.textContent = label
      labelDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
      labelDiv.style.padding = '5px 10px'
      labelDiv.style.borderRadius = '4px'
      labelDiv.style.color = '#000'
      labelDiv.style.fontSize = '12px'
      const labelObject = new CSS2DObject(labelDiv)

      // Position label at the tip of the arrow
      const tipPosition = new THREE.Vector3(
        direction.x * length,
        direction.y * length,
        direction.z * length,
      )
      labelObject.position.copy(tipPosition)

      scene.add(arrowHelper)
      scene.add(labelObject)
    }

    // Add vectors with labels
    createVector(reducedVectors[0], 0xff0000, 'User Preference') // Red for vector1
    createVector(reducedVectors[1], 0x0000ff, 'This Story') // Blue for vector2

    // Add coordinate axes
    const axesHelper = new THREE.AxesHelper(2)
    scene.add(axesHelper)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      if (cameraRef.current) {
        cameraRef.current.aspect = width / height
        cameraRef.current.updateProjectionMatrix()
      }

      if (rendererRef.current) {
        rendererRef.current.setSize(width, height)
      }

      if (labelRendererRef.current) {
        labelRendererRef.current.setSize(width, height)
      }
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current) {
        if (rendererRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
        if (labelRendererRef.current) {
          containerRef.current.removeChild(labelRendererRef.current.domElement)
        }
      }
      scene.clear()
    }
  }, [vector1, vector2])

  return <div ref={containerRef} style={{ width: '100%', height: '500px', position: 'relative' }} />
}

export default MiniMap
