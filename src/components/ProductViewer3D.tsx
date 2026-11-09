import { useState, useRef, useEffect } from 'react';
import { RotateCw, Pause, Play, Maximize2 } from 'lucide-react';

interface Props {
  images: string[];
  name: string;
  autoRotate?: boolean;
}

/**
 * CSS 3D cube viewer — shows up to 6 product images on the faces of a rotating cube.
 * Drag to rotate manually; tap the play/pause button to toggle auto-rotation.
 */
export default function ProductViewer3D({ images, name, autoRotate = true }: Props) {
  const [rotating, setRotating] = useState(autoRotate);
  const [fullscreen, setFullscreen] = useState(false);
  const [rotX, setRotX] = useState(-12);
  const [rotY, setRotY] = useState(0);
  const dragRef = useRef<{ x: number; y: number; rotX: number; rotY: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  // Auto-rotate animation
  useEffect(() => {
    if (!rotating) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setRotY((r) => r + dt * 28);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [rotating]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setRotating(false);
    dragRef.current = { x: e.clientX, y: e.clientY, rotX, rotY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setRotY(dragRef.current.rotY + dx * 0.5);
    setRotX(Math.max(-60, Math.min(60, dragRef.current.rotX - dy * 0.5)));
  };

  const handlePointerUp = () => { dragRef.current = null; };

  const faces = images.slice(0, 6);
  while (faces.length < 6) faces.push(images[0] ?? '');
  // face transforms for a ~220px cube
  const faceTransforms = [
    'rotateY(0deg) translateZ(110px)',
    'rotateY(90deg) translateZ(110px)',
    'rotateY(180deg) translateZ(110px)',
    'rotateY(-90deg) translateZ(110px)',
    'rotateX(90deg) translateZ(110px)',
    'rotateX(-90deg) translateZ(110px)',
  ];

  const scene = (
    <div
      className="scene-3d select-none cursor-grab active:cursor-grabbing touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="relative mx-auto" style={{ width: 220, height: 220 }}>
        {/* ambient shadow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full bg-wood-900/15 blur-xl" />
        <div
          className={`cube-3d relative ${rotating ? 'animate-spin-3d' : ''}`}
          style={!rotating ? { transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` } : undefined}
        >
          {faces.map((img, i) => (
            <div
              key={i}
              className="cube-face rounded-2xl overflow-hidden ring-1 ring-wood-200/50 shadow-lg"
              style={{ transform: faceTransforms[i] }}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const controls = (
    <div className="flex items-center justify-center gap-2 mt-2">
      <button
        onClick={() => setRotating((r) => !r)}
        className="btn-sm btn-secondary !rounded-full"
      >
        {rotating ? <><Pause className="h-3.5 w-3.5" /> Pausar</> : <><Play className="h-3.5 w-3.5" /> Girar</>}
      </button>
      <span className="text-xs text-ink-400 flex items-center gap-1">
        <RotateCw className="h-3 w-3" /> Arraste para girar
      </span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-wood-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
        <button
          onClick={() => setFullscreen(false)}
          className="absolute top-4 right-4 btn-sm btn-secondary !bg-white/10 !text-cream-100 !border-white/20"
        >
          <Maximize2 className="h-3.5 w-3.5" /> Fechar
        </button>
        <div className="scale-[1.4]">{scene}</div>
        <div className="mt-8">{controls}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setFullscreen(true)}
        className="absolute top-2 right-2 z-10 btn-sm btn-secondary !rounded-full !p-2"
        aria-label="Tela cheia"
      >
        <Maximize2 className="h-3.5 w-3.5" />
      </button>
      {scene}
      {controls}
    </div>
  );
}
