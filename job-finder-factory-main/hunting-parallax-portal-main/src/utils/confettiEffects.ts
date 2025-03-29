import confetti from 'canvas-confetti';

export const createJourneyConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      scalar: 1.2,
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    shapes: ['circle', 'square'],
    ticks: 50,
    origin: { x: 0.3, y: 0.7 },
  });

  fire(0.2, {
    spread: 60,
    decay: 0.91,
    shapes: ['circle', 'square'],
    ticks: 50,
    origin: { x: 0.5, y: 0.7 },
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    shapes: ['circle', 'square'],
    ticks: 50,
    origin: { x: 0.7, y: 0.7 },
  });
};