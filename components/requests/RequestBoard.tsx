"use client";

import { useMemo, useState } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { RequestCard } from "@/components/requests/RequestCard";
import { bloodTypes, urgencyLevels, urgencyLabels, type Urgency } from "@/lib/blood";
import { counties } from "@/lib/site";
import type { BloodRequest } from "@/lib/types";

type Filters = {
  bloodType: string;
  county: string;
  urgency: string;
};

const initialFilters: Filters = { bloodType: "", county: "", urgency: "" };

export function RequestBoard({ requests }: { requests: BloodRequest[] }) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      requests.filter((request) => {
        if (filters.bloodType && request.bloodType !== filters.bloodType) return false;
        if (filters.county && request.county !== filters.county) return false;
        if (filters.urgency && request.urgency !== filters.urgency) return false;
        return true;
      }),
    [requests, filters],
  );

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div>
      <div className="flat_card mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2 font-body text-[13px] font-semibold text-[#32221d]">
            <Filter size={15} className="text-[#ad4a3a]" aria-hidden="true" />
            Filter requests
          </span>
          {activeFilterCount > 0 ? (
            <button
              type="button"
              onClick={() => setFilters(initialFilters)}
              className="ml-auto inline-flex items-center gap-1.5 font-body text-[12.5px] font-semibold text-[#7c6f68] underline underline-offset-4 hover:text-[#8a382b]"
            >
              <RotateCcw size={13} aria-hidden="true" />
              Clear {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"}
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="field">
            <label htmlFor="filter-blood">Blood type</label>
            <select
              id="filter-blood"
              className="select_base"
              value={filters.bloodType}
              onChange={(event) => setFilters((current) => ({ ...current, bloodType: event.target.value }))}
            >
              <option value="">All blood types</option>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="filter-county">County</label>
            <select
              id="filter-county"
              className="select_base"
              value={filters.county}
              onChange={(event) => setFilters((current) => ({ ...current, county: event.target.value }))}
            >
              <option value="">All counties</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="filter-urgency">Urgency</label>
            <select
              id="filter-urgency"
              className="select_base"
              value={filters.urgency}
              onChange={(event) => setFilters((current) => ({ ...current, urgency: event.target.value }))}
            >
              <option value="">Any urgency</option>
              {urgencyLevels.map((level) => (
                <option key={level} value={level}>
                  {urgencyLabels[level as Urgency]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {urgencyLevels.map((level) => (
            <button
              key={level}
              type="button"
              className="pill_toggle"
              data-active={filters.urgency === level}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  urgency: current.urgency === level ? "" : level,
                }))
              }
            >
              {urgencyLabels[level]}
            </button>
          ))}
          <span className="ml-auto self-center font-body text-[12.5px] text-[#7d716a]">
            {filtered.length} live request{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {notice ? (
        <div className="form_note mb-6" role="status">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((request, index) => (
          <RequestCard key={request.ref} request={request} index={index} onResponded={setNotice} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flat_card mt-6 text-center">
          <h3 className="text-[22px]">No requests match these filters</h3>
          <p className="mt-2 font-body text-[14px] text-[#6d5f59]">
            Try a different blood type or county, or clear the filters to see the full board.
          </p>
          <button type="button" className="boxed-btn mt-4" onClick={() => setFilters(initialFilters)}>
            Clear filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
