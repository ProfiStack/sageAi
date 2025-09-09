import { features } from "@/mockData/desktopMockData";
import { motion } from "framer-motion";

export default function Features() {
  const featuresData = features;
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#02331E] mb-6">
            Intelligent LifeStyle Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our AI technology transforms your lifestyle and
            wellness journey with personalized insights.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 text-[#02331E] cursor-pointer bg-white/70 backdrop-blur-sm hover:bg-white/90 border border-[#D4B038]/20 hover:bg-gradient-to-br hover:from-[#02331E] hover:to-[#D4B038] hover:text-white hover:shadow-2xl hover:scale-105 hover:transform"
              variants={staggerItem}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <div className="flex items-start space-x-6">
                <motion.div
                  className="p-4 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm bg-gradient-to-r from-[#02331E] to-[#D4B038]"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="hover:text-white text-white">
                    {feature.icon}
                  </div>
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
