"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Deal = {
  amount?: string;
  arv?: string;
  offer?: string;
  stage: string;
};

type Contact = {
  id?: number;
  name: string;
};

export default function DashboardPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*");

      const { data: dealsData, error: dealsError } = await supabase
        .from("deals")
        .select("*");

      if (contactsError) {
        console.error("Load contacts error:", contactsError);
      } else {
        setContacts(contactsData || []);
      }

      if (dealsError) {
        console.error("Load deals error:", dealsError);
      } else {
        setDeals(dealsData || []);
      }

      setLoaded(true);
    }

    loadDashboardData();
  }, []);

  function parseMoney(value?: string) {
    return Number((value || "").replace(/[^0-9.-]+/g, "")) || 0;
  }

  function formatMoney(value: number) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  }

  const totalContacts = contacts.length;
  const totalDeals = deals.length;
  const closedDeals = deals.filter((d) => d.stage === "Closed").length;

  const projectedFees = deals.reduce(
    (sum, deal) => sum + parseMoney(deal.amount),
    0
  );

  const totalSpread = deals.reduce(
    (sum, deal) => sum + (parseMoney(deal.arv) - parseMoney(deal.offer)),
    0
  );

  if (!loaded) {
    return (
      <div className="text-slate-500">Loading dashboard...</div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-2 text-base">
          Overview of your contacts, deals, fees, and spread.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">
            Total Contacts
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {totalContacts}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">
            Total Deals
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {totalDeals}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">
            Closed Deals
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {closedDeals}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">
            Projected Fees
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {formatMoney(projectedFees)}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="text-sm font-medium text-slate-500 mb-2">
            Total Spread
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {formatMoney(totalSpread)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Activity Feed
          </h2>
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600">
              Your CRM is now using real database data.
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600">
              Continue building auth, notes, and deployment next.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Quick Summary
          </h2>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Contacts</span>
              <span className="font-medium text-slate-900">{totalContacts}</span>
            </div>
            <div className="flex justify-between">
              <span>Deals</span>
              <span className="font-medium text-slate-900">{totalDeals}</span>
            </div>
            <div className="flex justify-between">
              <span>Closed</span>
              <span className="font-medium text-slate-900">{closedDeals}</span>
            </div>
            <div className="flex justify-between">
              <span>Fees</span>
              <span className="font-medium text-slate-900">
                {formatMoney(projectedFees)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Spread</span>
              <span className="font-medium text-slate-900">
                {formatMoney(totalSpread)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
