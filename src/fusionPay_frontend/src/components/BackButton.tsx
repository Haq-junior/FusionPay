import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  onClick?: () => void
  className?: string
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(-1)
    }
  }

  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, {
      scale: 1.1,
      backgroundColor: 'rgba(55, 65, 81, 0.8)',
      duration: 0.2,
      ease: "power2.out"
    })
  }

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      duration: 0.2,
      ease: "power2.out"
    })
  }

  const handleMouseDown = () => {
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out"
    })
  }

  const handleMouseUp = () => {
    gsap.to(buttonRef.current, {
      scale: 1.1,
      duration: 0.1,
      ease: "power2.out"
    })
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`p-3 rounded-full bg-white/10 hover:bg-gray-700 text-white transition-all duration-200 backdrop-blur-sm border border-white/20 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  )
}

export default BackButton