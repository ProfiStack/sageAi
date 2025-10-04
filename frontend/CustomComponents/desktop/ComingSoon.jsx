import { comingSoon } from "@/mockData/desktopMockData";
import { motion } from "framer-motion";

export default function ComingSoon() {
  const comingSoonData = comingSoon;
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
    <section
      id="coming-soon"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#02331E] mb-6">
            Revolutionary Features Coming Soon
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get ready for the next generation of AI-powered lifestyle analysis
            tools.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center items-center gap-10"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {comingSoonData.map((item, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-sm p-8 hover:shadow-xl hover:bg-white/80 transition-all duration-300 border border-[#D4B038]/20 group hover:scale-105"
              variants={staggerItem}
              whileHover={{
                scale: 1.1,
                rotateY: 10,
                transition: { duration: 0.3 },
              }}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <motion.div
                  className={`p-4 rounded-2xl bg-gradient-to-r ${item.color} shadow-lg`}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(212, 176, 56, 0.3)",
                      "0 0 40px rgba(212, 176, 56, 0.6)",
                      "0 0 20px rgba(212, 176, 56, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-white">{item.icon}</div>
                </motion.div>
                <h3 className="font-bold text-[#02331E] text-lg">
                  {item.title}
                </h3>
                <motion.div
                  className="text-sm text-[#D4B038] font-semibold bg-[#D4B038]/10 px-4 py-2 rounded-full border border-[#D4B038]/30"
                  animate={{
                    backgroundColor: [
                      "rgba(212, 176, 56, 0.1)",
                      "rgba(212, 176, 56, 0.2)",
                      "rgba(212, 176, 56, 0.1)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Coming Soon
                </motion.div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#02331E]/5 to-[#D4B038]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
