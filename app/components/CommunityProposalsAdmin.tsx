"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export type ProposalStatus = "unseen" | "in_review" | "validated" | "voting" | "rejected";

export const PROPOSAL_STATUSES: Record<ProposalStatus, { label: string; color: string; desc: string }> = {
  unseen: { label: "Unseen", color: "var(--amber, #f59e0b)", desc: "New submission received, awaiting initial review." },
  in_review: { label: "In Review", color: "var(--cyan, #06b6d4)", desc: "Currently under evaluation and playtest balancing." },
  validated: { label: "Validated", color: "var(--green, #10b981)", desc: "Approved! Ready for inclusion in the game or community pack." },
  voting: { label: "Queued for Boss Battle", color: "var(--fire, #f97316)", desc: "Scheduled for the upcoming monthly Boss Battle slot." },
  rejected: { label: "Rejected", color: "var(--red, #ef4444)", desc: "Declined or requires a major gameplay redesign." }
};

export type CommunityProposal = {
  id: string;
  creator_name: string;
  creator_email: string;
  type: "minion" | "boss";
  monster_name: string;
  minion_rank: "green" | "blue" | "purple" | "orange" | null;
  concept_description: string;
  roll_objective: string;
  attacks: Array<{
    label: string;
    condition: string;
    damage: number;
    undefendable: boolean;
    effects?: string;
  }>;
  passive_description: string | null;
  health: number;
  cp: number;
  defense_description: string | null;
  defense_dice: number;
  special_constraints: string | null;
  image_url: string | null;
  status: ProposalStatus;
  admin_notes?: string | null;
  created_at: string;
};

export function CommunityProposalsAdmin() {
  const [proposals, setProposals] = useState<CommunityProposal[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const loadProposals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("community_proposals")
        .select("*")
        .order("created_at", { ascending: false });

      let list: CommunityProposal[] = (data || []) as CommunityProposal[];

      // Local storage fallback
      if (typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("dts_community_proposals") || "[]") as CommunityProposal[];
        if (local.length > 0) {
          const ids = new Set(list.map(p => p.id));
          for (const item of local) {
            if (!ids.has(item.id)) {
              list.push(item);
            }
          }
        }
      }

      setProposals(list);
      if (list.length > 0 && !selectedId) {
        setSelectedId(list[0].id);
      }
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProposals();
  }, []);

  const active = useMemo(
    () => proposals.find(p => p.id === selectedId) || null,
    [proposals, selectedId]
  );

  useEffect(() => {
    if (active) {
      setAdminNotes(active.admin_notes || "");
      setNotice("");
    }
  }, [active?.id]);

  const filtered = useMemo(() => {
    return proposals.filter(p => {
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchType = typeFilter === "all" || p.type === typeFilter;
      return matchStatus && matchType;
    });
  }, [proposals, statusFilter, typeFilter]);

  const countsByStatus = useMemo(() => {
    const counts: Record<string, number> = { all: proposals.length };
    for (const key of Object.keys(PROPOSAL_STATUSES)) {
      counts[key] = proposals.filter(p => p.status === key).length;
    }
    return counts;
  }, [proposals]);

  const updateStatus = async (newStatus: ProposalStatus) => {
    if (!active) return;
    setSaving(true);
    setNotice("Updating status…");

    try {
      const { error } = await supabase
        .from("community_proposals")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", active.id);

      if (error) {
        console.warn("Supabase update error, falling back to local storage:", error.message);
      }

      setProposals(prev =>
        prev.map(p => (p.id === active.id ? { ...p, status: newStatus } : p))
      );

      if (typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("dts_community_proposals") || "[]") as CommunityProposal[];
        const updatedLocal = local.map(p => (p.id === active.id ? { ...p, status: newStatus } : p));
        localStorage.setItem("dts_community_proposals", JSON.stringify(updatedLocal));
      }

      setNotice(`Status updated: ${PROPOSAL_STATUSES[newStatus].label}`);
    } catch (err: any) {
      setNotice(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const saveAdminNotes = async () => {
    if (!active) return;
    setSaving(true);
    setNotice("Saving admin notes…");

    try {
      const { error } = await supabase
        .from("community_proposals")
        .update({ admin_notes: adminNotes, updated_at: new Date().toISOString() })
        .eq("id", active.id);

      if (error) {
        console.warn("Supabase update error, falling back to local storage:", error.message);
      }

      setProposals(prev =>
        prev.map(p => (p.id === active.id ? { ...p, admin_notes: adminNotes } : p))
      );

      if (typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("dts_community_proposals") || "[]") as CommunityProposal[];
        const updatedLocal = local.map(p => (p.id === active.id ? { ...p, admin_notes: adminNotes } : p));
        localStorage.setItem("dts_community_proposals", JSON.stringify(updatedLocal));
      }

      setNotice("Notes saved successfully.");
    } catch (err: any) {
      setNotice(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getRankBadgeClass = (rank: string | null) => {
    switch (rank) {
      case "green": return "rankBadge green";
      case "blue": return "rankBadge blue";
      case "purple": return "rankBadge purple";
      case "orange": return "rankBadge orange";
      default: return "rankBadge";
    }
  };

  const getRankLabel = (rank: string | null) => {
    switch (rank) {
      case "green": return "Green (Tier 1 · Easy)";
      case "blue": return "Blue (Tier 2 · Moderate)";
      case "purple": return "Purple (Tier 3 · Hard)";
      case "orange": return "Orange (Tier 4 · Elite)";
      default: return "";
    }
  };

  return (
    <section className="communityProposalsAdmin">
      {/* Header & Controls */}
      <div className="proposalsAdminHeader">
        <div>
          <p className="eyebrow"><span />Moderation &amp; Balancing</p>
          <h2>Community Monster Submissions</h2>
          <p className="proposalsIntro">
            Inspect combat sheets submitted by community players for Minion Rush and the monthly Boss Battle rotation.
            Email creators directly to coordinate balancing adjustments.
          </p>
        </div>
        <div className="proposalsControls">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">All Classifications ({proposals.length})</option>
            <option value="boss">Bosses only ({proposals.filter(p => p.type === "boss").length})</option>
            <option value="minion">Minions only ({proposals.filter(p => p.type === "minion").length})</option>
          </select>
          <button className="button wire mini" type="button" onClick={loadProposals} disabled={loading}>
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* Status Overview Tabs */}
      <div className="proposalsStatusTabs">
        <button
          className={`statusTabBtn ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          <b>{countsByStatus.all || 0}</b>
          <span>All</span>
        </button>
        {(Object.keys(PROPOSAL_STATUSES) as ProposalStatus[]).map(key => {
          const conf = PROPOSAL_STATUSES[key];
          return (
            <button
              key={key}
              className={`statusTabBtn ${statusFilter === key ? "active" : ""} status-${key}`}
              onClick={() => setStatusFilter(key)}
            >
              <b>{countsByStatus[key] || 0}</b>
              <span>{conf.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="proposalsGrid">
        {/* Left Column: Submissions List */}
        <div className="proposalsList">
          <div className="proposalsListHeader">
            <span>Monster &amp; Creator</span>
            <span>Status</span>
          </div>

          {filtered.length === 0 ? (
            <div className="emptyProposals">
              <p>No submissions matching the selected filters.</p>
            </div>
          ) : (
            filtered.map(p => {
              const isSelected = p.id === selectedId;
              const statusConf = PROPOSAL_STATUSES[p.status] || PROPOSAL_STATUSES.unseen;

              return (
                <button
                  key={p.id}
                  className={`proposalCardBtn ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <div className="proposalCardTop">
                    <span className={`typeBadge ${p.type}`}>
                      {p.type === "boss" ? "👑 BOSS" : `⚔️ Minion ${p.minion_rank ? p.minion_rank.toUpperCase() : ""}`}
                    </span>
                    <span className={`statusPill status-${p.status}`}>
                      {statusConf.label}
                    </span>
                  </div>
                  <strong className="proposalCardTitle">{p.monster_name}</strong>
                  <div className="proposalCardMeta">
                    <span>By <b>{p.creator_name}</b></span>
                    <small>{new Date(p.created_at).toLocaleDateString("en-US")}</small>
                  </div>
                  {p.attacks && (
                    <div className="proposalCardSnippet">
                      {p.attacks.length} attack(s) · {p.health} HP · {p.cp} CP
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Inspect Sheet */}
        {active ? (
          <div className="panel proposalDetailPanel">
            {/* Header */}
            <div className="proposalDetailHeader">
              <div>
                <div className="proposalDetailBadges">
                  <span className={`typeBadge ${active.type}`}>
                    {active.type === "boss" ? "👑 BOSS BATTLE" : "⚔️ MINION RUSH"}
                  </span>
                  {active.type === "minion" && active.minion_rank && (
                    <span className={getRankBadgeClass(active.minion_rank)}>
                      {getRankLabel(active.minion_rank)}
                    </span>
                  )}
                  <span className={`statusPill status-${active.status}`}>
                    {PROPOSAL_STATUSES[active.status]?.label}
                  </span>
                </div>
                <h2>{active.monster_name}</h2>
                <div className="creatorContactBar">
                  <span>Proposed by <strong>{active.creator_name}</strong> ({active.creator_email})</span>
                  <span>· Received on {new Date(active.created_at).toLocaleDateString("en-US")}</span>
                  <a
                    className="button wire mini emailBtn"
                    href={`mailto:${active.creator_email}?subject=Solo Quest - Your monster submission: ${encodeURIComponent(active.monster_name)}&body=Hi ${encodeURIComponent(active.creator_name)},%0D%0A%0D%0AThank you for submitting ${encodeURIComponent(active.monster_name)} to Solo Quest! We have reviewed your combat sheet and...`}
                  >
                    ✉️ Email Creator
                  </a>
                </div>
              </div>

              {active.image_url && (
                <div className="proposalImageThumb">
                  <a href={active.image_url} target="_blank" rel="noreferrer" title="Open full image">
                    <img src={active.image_url} alt={active.monster_name} />
                  </a>
                </div>
              )}
            </div>

            {/* Status Selector */}
            <div className="statusActionBox">
              <span className="statusActionTitle">Update Treatment Status:</span>
              <div className="statusActionBtns">
                {(Object.keys(PROPOSAL_STATUSES) as ProposalStatus[]).map(st => {
                  const conf = PROPOSAL_STATUSES[st];
                  const isActive = active.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      className={`statusChoiceBtn ${isActive ? "active" : ""} status-${st}`}
                      onClick={() => updateStatus(st)}
                      disabled={saving}
                    >
                      <b>{conf.label}</b>
                    </button>
                  );
                })}
              </div>
              <p className="statusDescription">
                ℹ️ <em>{PROPOSAL_STATUSES[active.status]?.desc}</em>
              </p>
            </div>

            {/* Technical Combat Sheet */}
            <div className="proposalCombatSheet">
              {/* Lore & Concept */}
              <div className="sheetSection">
                <h4>Creative Direction &amp; Lore</h4>
                <p className="sheetText">{active.concept_description}</p>
              </div>

              {/* Stats */}
              <div className="sheetStatsGrid">
                <div className="statItem">
                  <span>Health Points (HP)</span>
                  <strong>{active.health} HP</strong>
                </div>
                <div className="statItem">
                  <span>Combat Points (CP)</span>
                  <strong>{active.cp} CP</strong>
                </div>
                <div className="statItem">
                  <span>Defense Dice</span>
                  <strong>{active.defense_dice} Dice</strong>
                </div>
              </div>

              {/* Roll Objective */}
              <div className="sheetSection">
                <h4>🎯 Automated Roll Objective</h4>
                <p className="sheetCallout">{active.roll_objective}</p>
              </div>

              {/* Attacks */}
              <div className="sheetSection">
                <h4>⚔️ Attack Table ({active.attacks?.length || 0})</h4>
                <div className="attacksTable">
                  {active.attacks && active.attacks.length > 0 ? (
                    active.attacks.map((atk, idx) => (
                      <div key={idx} className="attackRow">
                        <div className="attackIndex">#{idx + 1}</div>
                        <div className="attackMain">
                          <strong>{atk.label}</strong>
                          <span className="attackCondition">{atk.condition}</span>
                          {atk.effects && <span className="attackEffects">{atk.effects}</span>}
                        </div>
                        <div className="attackMeta">
                          <span className="attackDamage">{atk.damage} DMG</span>
                          {atk.undefendable && (
                            <span className="undefendableTag">UNDEFENDABLE</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No attacks defined.</p>
                  )}
                </div>
              </div>

              {/* Passive & Defense */}
              <div className="sheetDualGrid">
                <div className="sheetBlock">
                  <h4>✨ Passive Ability</h4>
                  <p>{active.passive_description || "No passive ability."}</p>
                </div>
                <div className="sheetBlock">
                  <h4>🛡️ Defense Plan ({active.defense_dice} dice)</h4>
                  <p>{active.defense_description || "Standard defense."}</p>
                </div>
              </div>

              {/* Constraints */}
              {active.special_constraints && (
                <div className="sheetSection">
                  <h4>⚠️ Special Constraints &amp; Custom Rules</h4>
                  <p className="sheetText">{active.special_constraints}</p>
                </div>
              )}
            </div>

            {/* Internal Admin Notes */}
            <div className="adminNotesSection">
              <label>
                <strong>Admin Internal Notes &amp; Follow-up</strong>
                <small>Record playtesting observations, recommended damage tweaks, or summaries of creator discussions.</small>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="e.g. Suggested lowering attack 2 damage from 10 to 8 to avoid early KO. Awaiting creator feedback..."
                />
              </label>
              <div className="adminNotesActions">
                <button className="button fire mini" type="button" onClick={saveAdminNotes} disabled={saving}>
                  {saving ? "Saving…" : "💾 Save Notes"}
                </button>
                {notice && <span className="adminNotice">{notice}</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="panel proposalEmptyPanel">
            <h3>Select a submission</h3>
            <p>Choose a monster from the list on the left to inspect its combat sheet, adjust its status, or email the creator.</p>
          </div>
        )}
      </div>
    </section>
  );
}
