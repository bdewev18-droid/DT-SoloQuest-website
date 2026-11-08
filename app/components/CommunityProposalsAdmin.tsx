"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export type ProposalStatus = "unseen" | "in_review" | "validated" | "voting" | "rejected";

export const PROPOSAL_STATUSES: Record<ProposalStatus, { label: string; en: string; color: string; desc: string }> = {
  unseen: { label: "Non vue", en: "Unseen", color: "var(--amber, #f59e0b)", desc: "Nouvelle proposition reçue, en attente de premier regard." },
  in_review: { label: "En cours", en: "In Review", color: "var(--cyan, #06b6d4)", desc: "En cours d'analyse et de tests d'équilibrage." },
  validated: { label: "Validé", en: "Validated", color: "var(--green, #10b981)", desc: "Accepté ! Prêt pour le pack minions ou l'intégration." },
  voting: { label: "Passera en vote", en: "Voting", color: "var(--fire, #f97316)", desc: "Sélectionné comme boss soumis au vote mensuel de la communauté." },
  rejected: { label: "Rejeté", en: "Rejected", color: "var(--red, #ef4444)", desc: "Refusé ou nécessite une refonte majeure." }
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

      // Récupère aussi le fallback local
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
      console.error("Erreur lors du chargement des propositions:", err);
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
    setNotice("Mise à jour du statut…");

    try {
      // Met à jour dans Supabase
      const { error } = await supabase
        .from("community_proposals")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", active.id);

      if (error) {
        console.warn("Échec Supabase (fallback local) :", error.message);
      }

      // Met à jour en local
      setProposals(prev =>
        prev.map(p => (p.id === active.id ? { ...p, status: newStatus } : p))
      );

      if (typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("dts_community_proposals") || "[]") as CommunityProposal[];
        const updatedLocal = local.map(p => (p.id === active.id ? { ...p, status: newStatus } : p));
        localStorage.setItem("dts_community_proposals", JSON.stringify(updatedLocal));
      }

      setNotice(`Statut mis à jour : ${PROPOSAL_STATUSES[newStatus].label} (${PROPOSAL_STATUSES[newStatus].en})`);
    } catch (err: any) {
      setNotice(`Erreur : ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const saveAdminNotes = async () => {
    if (!active) return;
    setSaving(true);
    setNotice("Enregistrement des notes admin…");

    try {
      const { error } = await supabase
        .from("community_proposals")
        .update({ admin_notes: adminNotes, updated_at: new Date().toISOString() })
        .eq("id", active.id);

      if (error) {
        console.warn("Échec Supabase (fallback local) :", error.message);
      }

      setProposals(prev =>
        prev.map(p => (p.id === active.id ? { ...p, admin_notes: adminNotes } : p))
      );

      if (typeof window !== "undefined") {
        const local = JSON.parse(localStorage.getItem("dts_community_proposals") || "[]") as CommunityProposal[];
        const updatedLocal = local.map(p => (p.id === active.id ? { ...p, admin_notes: adminNotes } : p));
        localStorage.setItem("dts_community_proposals", JSON.stringify(updatedLocal));
      }

      setNotice("Notes enregistrées avec succès.");
    } catch (err: any) {
      setNotice(`Erreur : ${err.message}`);
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
      case "green": return "Vert (Facile)";
      case "blue": return "Bleu (Modéré)";
      case "purple": return "Violet (Difficile)";
      case "orange": return "Orange (Légendaire)";
      default: return "";
    }
  };

  return (
    <section className="communityProposalsAdmin">
      {/* Header & Filtres */}
      <div className="proposalsAdminHeader">
        <div>
          <p className="eyebrow"><span />Modération & Équilibrage</p>
          <h2>Propositions de la communauté</h2>
          <p className="proposalsIntro">
            Analysez les fiches envoyées par les joueurs pour le mode Rush (Minions) et le vote mensuel (Boss).
            Contactez les créateurs par email pour finaliser l'équilibrage.
          </p>
        </div>
        <div className="proposalsControls">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">Tous types ({proposals.length})</option>
            <option value="boss">Boss uniquement ({proposals.filter(p => p.type === "boss").length})</option>
            <option value="minion">Minions uniquement ({proposals.filter(p => p.type === "minion").length})</option>
          </select>
          <button className="button wire mini" type="button" onClick={loadProposals} disabled={loading}>
            {loading ? "Chargement…" : "↻ Rafraîchir"}
          </button>
        </div>
      </div>

      {/* Barre des statuts */}
      <div className="proposalsStatusTabs">
        <button
          className={`statusTabBtn ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          <b>{countsByStatus.all || 0}</b>
          <span>Tous</span>
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
              <small>({conf.en})</small>
            </button>
          );
        })}
      </div>

      {/* Grille principale */}
      <div className="proposalsGrid">
        {/* Liste latérale */}
        <div className="proposalsList">
          <div className="proposalsListHeader">
            <span>Monstre & Créateur</span>
            <span>Statut</span>
          </div>

          {filtered.length === 0 ? (
            <div className="emptyProposals">
              <p>Aucune proposition correspondant aux critères.</p>
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
                    <span>Par <b>{p.creator_name}</b></span>
                    <small>{new Date(p.created_at).toLocaleDateString("fr-FR")}</small>
                  </div>
                  {p.attacks && (
                    <div className="proposalCardSnippet">
                      {p.attacks.length} attaque(s) · {p.health} PV · {p.cp} PC
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Détail de la proposition */}
        {active ? (
          <div className="panel proposalDetailPanel">
            {/* Entête du détail */}
            <div className="proposalDetailHeader">
              <div>
                <div className="proposalDetailBadges">
                  <span className={`typeBadge ${active.type}`}>
                    {active.type === "boss" ? "👑 BOSS DU MOIS" : "⚔️ MINION RUSH"}
                  </span>
                  {active.type === "minion" && active.minion_rank && (
                    <span className={getRankBadgeClass(active.minion_rank)}>
                      Rang {getRankLabel(active.minion_rank)}
                    </span>
                  )}
                  <span className={`statusPill status-${active.status}`}>
                    {PROPOSAL_STATUSES[active.status]?.label} ({PROPOSAL_STATUSES[active.status]?.en})
                  </span>
                </div>
                <h2>{active.monster_name}</h2>
                <div className="creatorContactBar">
                  <span>Proposé par <strong>{active.creator_name}</strong> ({active.creator_email})</span>
                  <span>· Reçu le {new Date(active.created_at).toLocaleDateString("fr-FR")} à {new Date(active.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                  <a
                    className="button wire mini emailBtn"
                    href={`mailto:${active.creator_email}?subject=Dice Throne Solo - Votre proposition de monstre : ${encodeURIComponent(active.monster_name)}&body=Bonjour ${encodeURIComponent(active.creator_name)},%0D%0A%0D%0ANous avons bien examiné votre proposition pour ${encodeURIComponent(active.monster_name)}.%0D%0A%0D%0A...`}
                  >
                    ✉️ Écrire au créateur
                  </a>
                </div>
              </div>

              {active.image_url && (
                <div className="proposalImageThumb">
                  <a href={active.image_url} target="_blank" rel="noreferrer" title="Agrandir l'image">
                    <img src={active.image_url} alt={active.monster_name} />
                  </a>
                </div>
              )}
            </div>

            {/* Actions de Statut */}
            <div className="statusActionBox">
              <span className="statusActionTitle">Changer le statut de traitement :</span>
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
                      <small>({conf.en})</small>
                    </button>
                  );
                })}
              </div>
              <p className="statusDescription">
                ℹ️ <em>{PROPOSAL_STATUSES[active.status]?.desc}</em>
                {active.status === "voting" && (
                  <strong style={{ color: "var(--fire)", marginLeft: 6 }}>
                    Ce boss est maintenant disponible dans le vote mensuel de la page Boss Battle !
                  </strong>
                )}
              </p>
            </div>

            {/* Fiche technique de combat */}
            <div className="proposalCombatSheet">
              {/* Concept & Description */}
              <div className="sheetSection">
                <h4>Parti pris créatif & Concept</h4>
                <p className="sheetText">{active.concept_description}</p>
              </div>

              {/* Stats principales */}
              <div className="sheetStatsGrid">
                <div className="statItem">
                  <span>Points de Vie (PV)</span>
                  <strong>{active.health} PV</strong>
                </div>
                <div className="statItem">
                  <span>Points de Combat (PC)</span>
                  <strong>{active.cp} PC</strong>
                </div>
                <div className="statItem">
                  <span>Dés de Défense</span>
                  <strong>{active.defense_dice} dés</strong>
                </div>
              </div>

              {/* Objectif de lancé */}
              <div className="sheetSection">
                <h4>🎯 Objectif de lancé du monstre</h4>
                <p className="sheetCallout">{active.roll_objective}</p>
              </div>

              {/* Attaques 1 à 6 */}
              <div className="sheetSection">
                <h4>⚔️ Tableau des Attaques ({active.attacks?.length || 0})</h4>
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
                          <span className="attackDamage">{atk.damage} DÉGÂTS</span>
                          {atk.undefendable && (
                            <span className="undefendableTag">INDEFENDABLE</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Aucune attaque détaillée.</p>
                  )}
                </div>
              </div>

              {/* Passif & Défense */}
              <div className="sheetDualGrid">
                <div className="sheetBlock">
                  <h4>✨ Capacité Passive</h4>
                  <p>{active.passive_description || "Aucun passif particulier."}</p>
                </div>
                <div className="sheetBlock">
                  <h4>🛡️ Plan de Défense ({active.defense_dice} dés)</h4>
                  <p>{active.defense_description || "Défense standard."}</p>
                </div>
              </div>

              {/* Contraintes spécifiques */}
              {active.special_constraints && (
                <div className="sheetSection">
                  <h4>⚠️ Contraintes & Règles Spécifiques</h4>
                  <p className="sheetText">{active.special_constraints}</p>
                </div>
              )}
            </div>

            {/* Notes d'administration internes */}
            <div className="adminNotesSection">
              <label>
                <strong>Notes & Échanges internes</strong>
                <small>Consignez ici les retours de test, idées d'ajustements de dégâts ou résumé des emails avec le créateur.</small>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Ex : Proposé 8 dégâts au lieu de 10 pour éviter le one-shot tour 1. En attente de confirmation du joueur..."
                />
              </label>
              <div className="adminNotesActions">
                <button className="button fire mini" type="button" onClick={saveAdminNotes} disabled={saving}>
                  {saving ? "Enregistrement…" : "💾 Enregistrer les notes"}
                </button>
                {notice && <span className="adminNotice">{notice}</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="panel proposalEmptyPanel">
            <h3>Sélectionnez une proposition</h3>
            <p>Choisissez un monstre dans la colonne de gauche pour inspecter sa fiche, modifier son statut ou le mettre au vote.</p>
          </div>
        )}
      </div>
    </section>
  );
}
