import { motion } from "framer-motion";

export default function StatsCards({ stats = [], loading = false }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.04 }}
          className="overflow-hidden rounded-3xl bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
        >
          <div
            className={`h-1.5 w-full rounded-full bg-linear-to-r ${item.tone}`}
          />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {item.title}
          </p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
            {loading ? "—" : item.value}
          </p>
        </motion.div>
      ))}
    </section>
  );
}
