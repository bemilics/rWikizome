import { create } from 'zustand'
import { getRandomArticle, getChildNodes, getArticleSummary } from '../api/wikipedia'

export const useGraph = create((set, get) => ({
  nodes: [],
  edges: [],
  loading: false,
  expandingId: null, // qué nodo está cargando hijos ahora mismo

  // ——— inicializar con nodo raíz random ———
  init: async () => {
    set({ loading: true })
    const root = await getRandomArticle()
    root.position = { x: 0, y: 0 }
    root.expanded = false
    root.summary = root.summary ?? null
    set({ nodes: [root], edges: [], loading: false })
  },

  // ——— inicializar con un título específico (buscador) ———
  initWithTitle: async (title) => {
    set({ loading: true })
    const { getArticleSummary } = await import('../api/wikipedia')
    const root = await getArticleSummary(title)
    root.position = { x: 0, y: 0 }
    root.expanded = false
    set({ nodes: [root], edges: [], loading: false })
  },

  // ——— expandir un nodo: spawnear 3 hijos ———
  expandNode: async (nodeId) => {
  const { nodes, edges } = get()
  const parent = nodes.find((n) => n.id === nodeId)
  if (!parent || parent.expanded) return

  set({ expandingId: nodeId })

  const children = await getChildNodes(nodeId)

  const radius = 220
  const minDist = 160
  const placedThisRound = [] // nodos que ya posicionamos en esta expansión

  // encuentra el ángulo más libre desde un punto de origen
  function findBestAngle(originX, originY, preferredAngle, existingNodes) {
    const allOccupied = [...existingNodes, ...placedThisRound]
    let bestAngle = preferredAngle
    let bestMinDist = -1

    // escanear 360° en pasos de 15°
    for (let step = 0; step < 24; step++) {
      const angle = preferredAngle + (step % 2 === 0 ? 1 : -1) * Math.ceil(step / 2) * (Math.PI / 12)
      const cx = originX + Math.cos(angle) * radius
      const cy = originY + Math.sin(angle) * radius

      // distancia mínima a todos los nodos existentes
      let minD = Infinity
      for (const n of allOccupied) {
        const dx = n.position.x - cx
        const dy = n.position.y - cy
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < minD) minD = d
      }

      if (minD > bestMinDist) {
        bestMinDist = minD
        bestAngle = angle
      }

      // si encontramos suficiente espacio, no seguir buscando
      if (bestMinDist >= minDist) break
    }

    return bestAngle
  }

  const angleOffset = Math.random() * Math.PI * 2
  const newNodes = []

  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const existing = nodes.find((n) => n.id === child.id)
    if (existing) continue

    const preferredAngle = angleOffset + (i * (2 * Math.PI)) / 3
    const bestAngle = findBestAngle(
      parent.position.x,
      parent.position.y,
      preferredAngle,
      nodes
    )

    const x = parent.position.x + Math.cos(bestAngle) * radius
    const y = parent.position.y + Math.sin(bestAngle) * radius

    const newNode = {
      ...child,
      position: { x, y },
      expanded: false,
      summary: null,
    }

    newNodes.push(newNode)
    placedThisRound.push(newNode)
  }

  const newEdges = children.map((child) => ({
    from: nodeId,
    to: child.id,
  }))

  const updatedNodes = nodes.map((n) =>
    n.id === nodeId ? { ...n, expanded: true } : n
  )

  set({
    nodes: [...updatedNodes, ...newNodes],
    edges: [...edges, ...newEdges],
    expandingId: null,
  })
},

  // ——— cargar summary de un nodo (para el popup, solo si no lo tiene) ———
  loadSummary: async (nodeId) => {
    const { nodes } = get()
    const node = nodes.find((n) => n.id === nodeId)
    if (!node || node.summary) return

    const data = await getArticleSummary(nodeId)
    set({
      nodes: nodes.map((n) =>
        n.id === nodeId ? { ...n, summary: data.summary, url: data.url } : n
      ),
    })
  },

  // ——— mover un nodo (drag) ———
  moveNode: (nodeId, dx, dy) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, position: { x: n.position.x + dx, y: n.position.y + dy } }
          : n
      ),
    }))
  },
}))
