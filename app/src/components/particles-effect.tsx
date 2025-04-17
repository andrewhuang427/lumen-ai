import { motion } from "framer-motion";

const PARTICLE_COUNT = 10;
const PARTICLE_ARRAY = Array.from({ length: PARTICLE_COUNT }, (_, i) => i);

export default function ParticleEffect() {
  return (
    <div className="absolute">
      {PARTICLE_ARRAY.map((i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-red-500"
          initial={{ opacity: 1, scale: 0 }}
          animate={{
            opacity: 0,
            scale: 1,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
