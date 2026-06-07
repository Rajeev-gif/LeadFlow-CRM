import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiPlus, FiFilter, FiRefreshCw } from "react-icons/fi";
import StatsCards from "../components/StatsCards";
import LeadsTable from "../components/LeadsTable";
import LeadModal from "../components/LeadModal";
import axiosInstance from "../services/axiosInstance";
import { API_PATHS } from "../services/apiPaths";

const STATUS_OPTIONS = [
  "All",
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost",
];
const SORT_OPTIONS = [
  { label: "Newest First", value: "createdAt_desc" },
  { label: "Oldest First", value: "createdAt_asc" },
  { label: "Name A-Z", value: "name_asc" },
  { label: "Name Z-A", value: "name_desc" },
];

const emptyLead = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "New",
  notes: "",
};

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const fetchData = async ({ keepPage = false } = {}) => {
    try {
      setError("");
      if (keepPage) setRefreshing(true);
      else setLoading(true);

      const [sortBy, sortOrder] = sort.split("_");

      const leadsResponse = await axiosInstance.get(
        API_PATHS.LEADS.GET_ALL_LEADS,
        {
          params: {
            search,
            status: status === "All" ? "" : status,
            sortBy,
            sortOrder,
            page,
            limit,
          },
        },
      );

      const statsResponse = await axiosInstance.get(API_PATHS.LEADS.GET_STATS);

      setLeads(leadsResponse.data?.data || []);
      setTotalPages(leadsResponse.data?.totalPages || 1);
      setStats(statsResponse.data?.data || null);
      console.log(leadsResponse);
      console.log(statsResponse.data?.data);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load dashboard");
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhustive-deps
  }, [page, status, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      fetchData({ keepPage: true });
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhustive-deps
  }, [search]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchData();
  };

  const openAddModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleSaveLead = async (formData) => {
    try {
      setSaving(true);
      if (editingLead?._id) {
        await axiosInstance.put(
          API_PATHS.LEADS.UPDATE_LEAD(editingLead._id),
          formData,
        );
      } else {
        await axiosInstance.post(API_PATHS.LEADS.CREATE_LEAD, formData);
      }
      closeModal();
      await fetchData({ keepPage: true });
    } catch (error) {
      throw new Error(error?.response?.data?.message || "Failed to save lead");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLead = async (id) => {
    const confirmDelete = window.confirm("Delete this lead permanently?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await axiosInstance.delete(API_PATHS.LEADS.DELETE_LEAD(id));
      await fetchData({ keepPage: true });
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to delete lead");
    } finally {
      setDeletingId("");
    }
  };

  const statsCards = useMemo(() => {
    if (!stats) return [];
    return [
      {
        title: "Total Leads",
        value: stats.totalLeads ?? 0,
        tone: "from-blue-500 to-sky-400 ",
      },
      {
        title: "New",
        value: stats.statusStats?.New ?? 0,
        tone: "from-slate-500 to-slate-500 ",
      },
      {
        title: "Contacted",
        value: stats.statusStats?.Contacted ?? 0,
        tone: "from-cyan-500 to-blue-400 ",
      },
      {
        title: "Qualified",
        value: stats.statusStats?.Qualified ?? 0,
        tone: "from-emerald-500 to-teal-400 ",
      },
      {
        title: "Converted",
        value: stats.statusStats?.Converted ?? 0,
        tone: "from-violet-500 to-fuchsia-400 ",
      },
      {
        title: "Lost",
        value: stats.statusStats?.Lost ?? 0,
        tone: "from-rose-500 to-red-400 ",
      },
    ];
  }, [stats]);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f7fbff] via-white to-[#f6f9ff] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Lead Management CRM
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Manage leads, track status changes, and keep your sales pipeline
                organized in one clean workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={fetchData}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 cursor-pointer"
              >
                <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 cursor-pointer"
              >
                <FiPlus className="text-base" />
                Add Lead
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="grid gap-3 rounded-3xl bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 lg:grid-cols-[1.5fr_0.8fr_0.8fr_auto]">
            <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 hover:border-blue-300  focus-within:border-blue-500 transition">
              <FiSearch className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or company..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>

            <div className="relative">
              <FiFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-full border border-slate-200 bg-slate-50 px-11 py-3 text-sm outline-none transition hover:border-blue-200 focus:border-blue-400 cursor-pointer"
              >
                {STATUS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <FiFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full appearance-none rounded-full border border-slate-200 bg-slate-50 px-11 py-3 text-sm outline-none transition hover:border-blue-200 focus:border-blue-400 cursor-pointer"
              >
                {SORT_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleApplyFilters}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {/* Stats */}
        <StatsCards stats={statsCards} loading={loading} />

        {/* Table */}
        <section className="mt-8 rounded-4xl bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">All Leads</h2>
              <p className="text-sm text-slate-500">
                {loading
                  ? "Loading leads..."
                  : `${leads.length} lead(s) on this page`}
              </p>
            </div>
          </div>

          <LeadsTable
            leads={leads}
            loading={loading}
            deletingId={deletingId}
            onEdit={openEditModal}
            onDelete={handleDeleteLead}
          />

          {/* Pagination */}
          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-700">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen ? (
          <LeadModal
            key="lead-modal"
            open={isModalOpen}
            lead={editingLead}
            saving={saving}
            onClose={closeModal}
            onSave={handleSaveLead}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
