import { categoriesData } from "@/mockData/desktopMockData";
import { motion } from "framer-motion";

export default function Categories() {
  const categories = categoriesData;
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
    <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#02331E] mb-6">
            Comprehensive LifeStyle Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our wide range of AI-powered tools across all aspects of
            lifestyle and wellness.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-sm p-8 hover:bg-white/90 transition-all duration-300 cursor-pointer border border-[#D4B038]/20 hover:shadow-xl hover:scale-105"
              variants={staggerItem}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3 },
              }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <motion.div
                  className={`p-4 rounded-2xl bg-gradient-to-r ${category.color}`}
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  <category.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-[#02331E] mb-1">
                    {category.name}
                  </h3>
                  <p className="text-[#D4B038] font-semibold">
                    {category.count}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
