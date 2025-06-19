import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, CreditCard, Globe } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const BlockchainVisual = () => (
  <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <mesh rotation={[0.5, 0.5, 0]}>
      <dodecahedronGeometry args={[3, 0]} />
      <meshStandardMaterial color="#4f46e5" wireframe />
    </mesh>
    <OrbitControls enableZoom={false} autoRotate />
  </Canvas>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-indigo-600 mb-3">{icon}</div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

const Hero = () => {
  return (
    <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 transform skew-y-6 -rotate-6 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Seamless <span className="text-indigo-700">Crypto Payments</span> on ICP
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl">
              Accept and send payments in ICP and stablecoins with zero friction.
              Built on the Internet Computer Protocol for secure, decentralized transactions.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-lg flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-gray-800 font-medium rounded-lg border border-gray-300 shadow-sm"
              >
                Watch Demo
              </motion.button>
            </div>
            
            {/* Feature Grid */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              <FeatureCard 
                icon={<Smartphone size={24} />}
                title="Mobile Ready"
                description="Works seamlessly on any device"
              />
              <FeatureCard 
                icon={<CreditCard size={24} />}
                title="Low Fees"
                description="Near-zero transaction costs"
              />
              <FeatureCard 
                icon={<Globe size={24} />}
                title="Global"
                description="Borderless payments worldwide"
              />
            </div>
          </motion.div>
          
          {/* 3D Blockchain Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[500px] rounded-2xl overflow-hidden shadow-xl border-8 border-white"
          >
            <BlockchainVisual />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;