import { motion } from "framer-motion";
import {
  FiEdit3,
  FiTrash2,
  FiMail,
  FiPhone,
  FiBriefcase,
} from "react-icons/fi";

const statusStyle = {
  New: "bg-slate-100 text-slate-700 ring-slate-200",
  Contacted: "bg-blue-50 text-blue-700 ring-blue-100",
  Qualified: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Converted: "bg-violet-50 text-violet-700 ring-violet-100",
  Lost: "bg-rose-50 text-rose-700 ring-rose-100",
};

export default function LeadsTable({
  leads,
  loading,
  onEdit,
  onDelete,
  deletingId,
}) {
  if (loading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-20 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
        <p className="text-lg font-semibold text-slate-900">No leads found</p>
        <p className="mt-2 text-sm text-slate-500">
          Try a different search or add a new lead.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200">
      {/* Desktop table */}
      <div className="hidden xl:block">
        <table className="min-w-full divide-y divide-slate-200 bg-white">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Lead
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Contact
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Company
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Status
              </th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Created
              </th>
              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {leads.map((lead) => (
              <motion.tr
                key={lead._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="hover:bg-slate-50"
              >
                <td className="px-5 py-4 align-top">
                  <div>
                    <p className="font-semibold text-slate-900">{lead.name}</p>
                    <p className="mt-1 line-clamp-1 max-w-[320px] text-sm text-slate-500">
                      {lead.notes || "No notes added"}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4 align-top text-sm text-slate-600">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2">
                      <FiMail /> {lead.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiPhone /> {lead.phone}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4 align-top text-sm text-slate-700">
                  <div className="flex items-center gap-2 font-medium">
                    <FiBriefcase className="shrink-0 text-slate-400" />
                    <span>{lead.company}</span>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyle[lead.status] || statusStyle.New}`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="px-5 py-4 align-top text-sm text-slate-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(lead)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                    >
                      <FiEdit3 /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(lead._id)}
                      disabled={deletingId === lead._id}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiTrash2 />{" "}
                      {deletingId === lead._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 xl:hidden">
        {leads.map((lead) => (
          <motion.div
            key={lead._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-[1.4rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {lead.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{lead.company}</p>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyle[lead.status] || statusStyle.New}`}
              >
                {lead.status}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <FiMail className="text-slate-400" /> {lead.email}
              </p>
              <p className="flex items-center gap-2">
                <FiPhone className="text-slate-400" /> {lead.phone}
              </p>
              <p className="text-sm leading-6 text-slate-500">
                {lead.notes || "No notes added"}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
              <p className="text-xs font-medium text-slate-500">
                {new Date(lead.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(lead)}
                  className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(lead._id)}
                  disabled={deletingId === lead._id}
                  className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
