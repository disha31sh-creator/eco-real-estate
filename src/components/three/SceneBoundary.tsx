import { Component, type ReactNode } from 'react'
import { useAppStore } from '../../store/useAppStore'

interface Props {
  children: ReactNode
  /** What to show if 3D cannot start (for example, WebGL is unavailable). */
  fallback?: ReactNode
  /** The main hero scene also releases the preloader when it fails. */
  isMain?: boolean
}

// Keeps the page working even when WebGL is not available: a calm backdrop replaces the 3D.
export default class SceneBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    if (this.props.isMain) useAppStore.setState({ ready: true, sceneActive: false })
  }

  render() {
    if (this.state.failed) {
      return (
        this.props.fallback ?? (
          <div className="fixed inset-0 z-0 bg-gradient-to-b from-forest-950 via-forest-900 to-forest-700" />
        )
      )
    }
    return this.props.children
  }
}
