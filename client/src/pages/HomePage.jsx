// src/pages/HomePage.jsx
import { motion, useMotionValue, animate, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// This is the button style class from your index.css
const glowBtn = "glow-btn";

// --- Data from the Next.js component ---
const letterAnimation = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5 }
  })
};

// Adapted features for your StructaQuiz App
const features = [
  { icon: "🎨", label: "Custom Themes" },
  { icon: "✍️", label: "Rich Text Editor" },
  { icon: "🖼️", label: "Image Uploads" },
  { icon: "📊", label: "Response Analytics" },
  { icon: "🔄", label: "Categorize Questions" },
  { icon: "✒️", label: "Cloze Questions" },
  { icon: "📚", label: "Comprehension Questions" },
  { icon: "🔒", label: "Secure Forms" },
  { icon: "💬", label: "24/7 Support" },
];

const faqData = [
    { question: "What is StructaQuiz?", answer: "StructaQuiz is a modern platform for building interactive and engaging quizzes with unique question types." },
    { question: "How do I create a form?", answer: "After signing in, navigate to your dashboard and click the 'Create New Form' button to start building." },
    { question: "What are 'Cloze' questions?", answer: "Cloze questions are fill-in-the-blank style questions where users drag and drop words into a passage." },
    { question: "Can I add images to my questions?", answer: "Yes, you can upload a header image for the entire form and individual images for each question to make them more visual." },
    { question: "How do I view responses?", answer: "From your dashboard, you can view the responses for each of your created forms." },
];


export default function HomePage() {
  const letterControls = useAnimation();
  const [openIndex, setOpenIndex] = useState(null);
  const x = useMotionValue(0);

  // Animate the "Trusted by Users" text
  useEffect(() => {
    const text = "Create Engaging Quizzes Effortlessly.";
    let timeout;
    const sequence = async () => {
      await letterControls.start("visible");
      timeout = setTimeout(() => letterControls.start("hidden"), 4000); // Wait longer before hiding
    };
    sequence();
    letterControls.set("hidden");
    const interval = setInterval(sequence, 4000 + (0.13 * text.length * 1000));
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [letterControls]);

  // Animate the x-axis for the feature scroller
  useEffect(() => {
    const controls = animate(x, -1000, {
      repeat: Infinity,
      duration: 25, // Slowed down for better viewing
      ease: "linear",
    });
    return controls.stop;
  }, [x]);

  const toggleFAQ = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <>
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 -z-10">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ duration: 2 }} className="absolute left-[-10vw] top-[-10vh] w-[40vw] h-[40vw] bg-blue-700/40 rounded-full blur-3xl" />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.5, scale: 1 }} transition={{ duration: 2, delay: 0.5 }} className="absolute right-[-10vw] top-[20vh] w-[30vw] h-[30vw] bg-blue-400/30 rounded-full blur-2xl" />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.4, scale: 1 }} transition={{ duration: 2, delay: 1 }} className="absolute left-[30vw] bottom-[-10vh] w-[40vw] h-[20vw] bg-blue-900/30 rounded-full blur-2xl" />
      </div>

      <motion.main initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, type: "spring", stiffness: 80 }} className="min-h-screen pt-28 bg-[#0A0F1F] text-white relative bg-[length:80px_80px] bg-[linear-gradient(transparent_79px,#232733_80px),linear-gradient(90deg,transparent_79px,#232733_80px)]">
        
        {/* HERO SECTION */}
        <section className="pt-10 md:pt-16 px-4 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-6 md:space-y-8">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-[#F1F5F9] drop-shadow-xl">
              {"Create Engaging Quizzes Effortlessly.".split("").map((char, i) => (
                <motion.span key={i} custom={i} animate={letterControls} variants={letterAnimation}>{char}</motion.span>
              ))}
              <br />
              <span className="text-blue-400">Powered by StructaQuiz.</span>
            </h1>
            <p className="text-base md:text-lg text-[#CBD5E1]">Experience fast, reliable, and secure form building with our futuristic toolset.</p>
            <Link to="/dashboard">
                <motion.button whileHover={{ scale: 1.07, boxShadow: "0 0 24px #60a5fa" }} whileTap={{ scale: 0.96 }} className={`${glowBtn} text-base mx-auto flex items-center md:mx-0 mt-6 md:mt-0`}>Get Started</motion.button>
            </Link>
          </motion.div>
          <div className="flex justify-center items-center w-full">
             {/* You will need to add an image to your public folder for this to work */}
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: [1, 1.08, 1] }} transition={{ opacity: { duration: 0.6 }, y: { duration: 0.6 }, scale: { duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" } }} whileHover={{ scale: 1.07, boxShadow: "0 0 48px #60a5fa" }} className="rounded-3xl border-4 border-blue-900/60 bg-gradient-to-br from-[#1a2740] to-[#22345a] p-2 shadow-2xl max-w-xs w-full">
              <img src="/paytm-1.png" alt="StructaQuiz App Preview" className="w-full h-auto rounded-2xl" />
            </motion.div>
          </div>
        </section>

        {/* FEATURE SCROLLER */}
        <section className="mt-24 px-4 sm:px-6 flex justify-center">
            <div className="w-full max-h-[240px] overflow-hidden pt-4"> 
                <motion.div className="flex gap-10 w-max pb-4" style={{ x }}>
                {[...features, ...features, ...features].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: (index % features.length) * 0.1, type: "spring", stiffness: 80, damping: 12 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.04, boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)", border: "1px solid rgba(59, 130, 246, 0.7)" }}
                        whileTap={{ scale: 0.96 }}
                        className="min-w-[180px] flex-shrink-0 snap-start flex flex-col items-center justify-center p-5 rounded-2xl border border-blue-400/20 transition-transform cursor-pointer bg-[#0f172a]"
                    >
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-700/30 shadow-lg text-3xl mb-2">{item.icon}</span>
                        <span className="text-white font-semibold text-center">{item.label}</span>
                    </motion.div>
                ))}
                </motion.div>
            </div>
        </section>
        
        {/* IMAGE BANNER */}
        <div className="flex justify-center items-center w-full h-auto mt-16 mb-16 px-4">
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} whileHover={{ scale: 1.02, boxShadow: "0 0 48px #60a5fa" }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.5 }} className="rounded-3xl border-4 border-blue-900/60 bg-gradient-to-br from-[#1a2740] to-[#22345a] p-2 shadow-2xl w-auto max-w-6xl">
            <img src="/paytm-2.jpg" alt="Illustration of people using the quiz builder" className="rounded-2xl w-auto h-auto max-h-128" />
          </motion.div>
        </div>

        {/* FAQ SECTION */}
        <section className="max-w-3xl mx-auto mt-12 mb-20 px-4 sm:px-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqData.map((item, idx) => (
              <div key={idx}>
                <button onClick={() => toggleFAQ(idx)} className={`w-full bg-[#0f172a] text-left px-5 py-4 rounded-lg border border-blue-400/40 text-lg font-semibold focus:outline-none flex justify-between items-center transition-all duration-200 ${openIndex === idx ? 'ring-2 ring-blue-400' : ''}`}>
                  <span>{item.question}</span><span className="ml-4 text-blue-300">{openIndex === idx ? '▲' : '▼'}</span>
                </button>
                {openIndex === idx && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-5 py-3 bg-[#0f172a] text-[#cbd5e1] border-l-4 border-blue-400/40 rounded-b-lg">{item.answer}</motion.div>}
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-gray-400 py-6 mt-20">
            <p className="mb-2">Made by A Gemini User</p>
        </footer>
      </motion.main>
    </>
  );
}