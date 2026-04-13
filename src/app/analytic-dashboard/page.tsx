"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Calendar, RefreshCw, Maximize2, Minimize2, Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import Link from "next/link";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const FILTER_OPTIONS: { label: string; value: FilterOption }[] = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7days" },
  { label: "Last 30 Days", value: "last30days" },
  { label: "This Month", value: "thismonth" },
  { label: "Last Month", value: "lastmonth" },
  { label: "This Year", value: "thisyear" },
  { label: "Last Year", value: "lastyear" },
  { label: "All Time", value: "alltime" },
];

// Types
type FilterOption = "today" | "yesterday" | "last7days" | "last30days" | "thismonth" | "lastmonth" | "thisyear" | "lastyear" | "alltime";
type BarDatum = { name: string; value: number; target: number };
type LineDatum = { name: string; value: number; revenue: number };
type PieDatum = { name: string; value: number };
type Stats = { users: number; revenue: number; orders: number; growth: string };

const generateDataByFilter = (filter: FilterOption) => {
  const multiplier: Record<FilterOption, number> = {
    today: 0.3,
    yesterday: 0.25,
    last7days: 0.6,
    last30days: 1,
    thismonth: 1.1,
    lastmonth: 0.9,
    thisyear: 1.5,
    lastyear: 1.5,
    alltime: 2,
  };

  const mult = multiplier[filter] ?? 1;

  return {
    bar: [
      { name: "Jan", value: Math.round(4000 * mult), target: Math.round(3500 * mult) },
      { name: "Feb", value: Math.round(3000 * mult), target: Math.round(3200 * mult) },
      { name: "Mar", value: Math.round(5000 * mult), target: Math.round(4000 * mult) },
      { name: "Apr", value: Math.round(4500 * mult), target: Math.round(4200 * mult) },
      { name: "May", value: Math.round(6000 * mult), target: Math.round(5000 * mult) },
      { name: "Jun", value: Math.round(5500 * mult), target: Math.round(5200 * mult) },
    ] as BarDatum[],
    line: [
      { name: "Week 1", value: Math.round(2400 * mult), revenue: Math.round(3400 * mult) },
      { name: "Week 2", value: Math.round(3200 * mult), revenue: Math.round(4100 * mult) },
      { name: "Week 3", value: Math.round(2800 * mult), revenue: Math.round(3700 * mult) },
      { name: "Week 4", value: Math.round(3600 * mult), revenue: Math.round(4500 * mult) },
    ] as LineDatum[],
    pie: [
      { name: "Kelas A", value: Math.round(400 * mult) },
      { name: "Kelas B", value: Math.round(300 * mult) },
      { name: "Kelas C", value: Math.round(200 * mult) },
      { name: "Kelas D", value: Math.round(100 * mult) },
    ] as PieDatum[],
    stats: {
      users: Math.round(12345 * mult),
      revenue: Math.round(45678 * mult),
      orders: Math.round(3456 * mult),
      growth: (23.5 * mult).toFixed(1),
    } as Stats,
  };
};
interface FullscreenChartProps {
  type: "bar" | "line" | "pie";
  onClose: () => void;
  barData: BarDatum[];
  lineData: LineDatum[];
  pieData: PieDatum[];
}

const FullscreenChart: React.FC<FullscreenChartProps> = ({ type, onClose, barData, lineData, pieData }) => (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white rounded-lg p-6 w-full max-w-6xl h-[90vh]" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === "bar" && "Monthly Performance"}
          {type === "line" && "Weekly Trends"}
          {type === "pie" && "Distribution by Category"}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <Minimize2 size={24} />
        </button>
      </div>
      <div className="h-[calc(100%-80px)]">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Actual" />
              <Bar dataKey="target" fill="#10b981" name="Target" />
            </BarChart>
          ) : type === "line" ? (
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Sales" />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={(props: any) => `${props.name ?? ""}: ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={200}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default function AnalyticDashboard() {
  const [dateFilter, setDateFilter] = useState<FilterOption>("last7days");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [fullscreenChart, setFullscreenChart] = useState<"bar" | "line" | "pie" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [barData, setBarData] = useState<BarDatum[]>([]);
  const [lineData, setLineData] = useState<LineDatum[]>([]);
  const [pieData, setPieData] = useState<PieDatum[]>([]);
  const [statsData, setStatsData] = useState<Stats | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generateDataByFilter(dateFilter);
      setBarData(data.bar);
      setLineData(data.line);
      setPieData(data.pie);
      setStatsData(data.stats);
      setIsLoading(false);
    }, 500);
  }, [dateFilter]);

  const statsCards = [
    { title: "Total Users", value: statsData?.users ?? 0, icon: Users, color: "bg-blue-500", change: "+5.2%" },
    { title: "Total Revenue", value: `$${statsData?.revenue ?? 0}`, icon: DollarSign, color: "bg-green-500", change: "+3.8%" },
    { title: "Total Orders", value: statsData?.orders ?? 0, icon: ShoppingCart, color: "bg-yellow-500", change: "+4.1%" },
    { title: "Growth Rate", value: `${statsData?.growth ?? 0}%`, icon: TrendingUp, color: "bg-purple-500", change: "+2.7%" },
  ];

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          const data = generateDataByFilter(dateFilter);
          setBarData(data.bar);
          setLineData(data.line);
          setPieData(data.pie);
          setStatsData(data.stats);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, dateFilter]);

  const handleManualRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generateDataByFilter(dateFilter);
      setBarData(data.bar);
      setLineData(data.line);
      setPieData(data.pie);
      setStatsData(data.stats);
      setIsLoading(false);
      setCountdown(60);
    }, 500);
  };

  const handleFilterChange = (filterValue: FilterOption) => {
    setDateFilter(filterValue);
    setCountdown(60);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Analytic Dashboard</h1>
              <p className="text-gray-500 mt-1">Real Time Analytic</p>
              <p className="text-sm text-blue-600 mt-1">
                Viewing data for: <strong>{FILTER_OPTIONS.find((o) => o.value === dateFilter)?.label}</strong>
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <Link href="/" className="text-sm text-indigo-600 hover:underline">
                &larr; Kembali ke Home
              </Link>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="mt-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar className="w-5 h-5 text-gray-500" />
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    dateFilter === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Refresh */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Auto Refresh</label>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative w-12 h-6 rounded-full transition ${autoRefresh ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    autoRefresh ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {autoRefresh && <span className="text-sm text-gray-500 font-mono">{countdown}s</span>}
            <button
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 transform transition hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* BarChart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Monthly Performance</h2>
              <button onClick={() => setFullscreenChart("bar")} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Maximize2 size={20} className="text-gray-600" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Actual" />
                <Bar dataKey="target" fill="#10b981" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* LineChart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Weekly Trending</h2>
              <button onClick={() => setFullscreenChart("line")} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Maximize2 size={20} className="text-gray-600" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Sales" />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PieChart */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Distribution by Category</h2>
              <button onClick={() => setFullscreenChart("pie")} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Maximize2 size={20} className="text-gray-600" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={(props: any) => `${props.name ?? ""}: ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={140}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {fullscreenChart && (
        <FullscreenChart
          type={fullscreenChart}
          onClose={() => setFullscreenChart(null)}
          barData={barData}
          lineData={lineData}
          pieData={pieData}
        />
      )}
    </div>
  );
}