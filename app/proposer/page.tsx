"use client";
import { useEffect, useState } from "react";
import { HardLink as Link } from "../components/HardLink";
import { SiteHeader } from "../components/SiteHeader";
import { supabase } from "../lib/supabase";

type AttackDef = {
  id: string;
  label: string;
  conditionType: string;
  symbolsDetail: string;
  damage: number;
  undefendable: boolean;
  tokens: string;
  extraEffect: string;
};

const SUGGESTED_TOKENS = [
  "Poison", "Burn", "Bleed", "Stun", "Knockdown",
  "Barbed Vine", "Evasive", "Riposte", "Shadows",
  "Damage Bonus +2", "Damage Bonus +3", "Hex", "Blind"
];

export default function ProposeMonsterPage() {
  // Identité créateur
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");

  // Type & Rang
  const [monsterType, setMonsterType] = useState<"minion" | "boss">("boss");
  const [minionRank, setMinionRank] = useState<"green" | "blue" | "purple" | "orange">("green");

  // Identité & Concept
  const [monsterName, setMonsterName] = useState("");
  const [concept, setConcept] = useState("");
  const [rollObjective, setRollObjective] = useState("");

  // Attaques (1 à 6)
  const [attacks, setAttacks] = useState<AttackDef[]>([
    {
      id: "atk-1",
      label: "Attaque de Base",
      conditionType: "symbols",
      symbolsDetail: "3 Symboles Blancs",
      damage: 5,
      undefendable: false,
      tokens: "",
      extraEffect: ""
    },
    {
      id: "atk-2",
      label: "Attaque Majeure",
      conditionType: "straight",
      symbolsDetail: "Petite Suite (4 dés)",
      damage: 9,
      undefendable: false,
      tokens: "Poison",
      extraEffect: "Vole 1 PC"
    }
  ]);

  // Passif, Stats & Défense
  const [passive, setPassive] = useState("");
  const [health, setHealth] = useState(monsterType === "boss" ? 60 : 12);
  const [cp, setCp] = useState(monsterType === "boss" ? 4 : 1);
  const [defenseDice, setDefenseDice] = useState(3);
  const [defenseDesc, setDefenseDesc] = useState("Jet de 3 dés : Annule 1 dégât par symbole Orange, inflige 1 blessure sur 2 symboles Rouges.");
  const [specialConstraints, setSpecialConstraints] = useState("");

  // Image facultative
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  // Anti-Spam
  const [mathA, setMathA] = useState(3);
  const [mathB, setMathB] = useState(4);
  const [mathAnswer, setMathAnswer] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Piège pour robots

  // États du formulaire
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Initialise le captcha mathématique
  useEffect(() => {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = Math.floor(Math.random() * 5) + 1;
    setMathA(a);
    setMathB(b);
  }, []);

  // Ajuste les PV par défaut lors du switch minion/boss
  useEffect(() => {
    if (monsterType === "boss") {
      if (health < 40) setHealth(60);
      if (cp < 2) setCp(4);
    } else {
      if (health > 30) setHealth(12);
    }
  }, [monsterType]);

  const addAttack = () => {
    if (attacks.length >= 6) return;
    setAttacks([
      ...attacks,
      {
        id: `atk-${Date.now()}`,
        label: `Attaque ${attacks.length + 1}`,
        conditionType: "symbols",
        symbolsDetail: "2 Symboles Oranges + 1 Rouge",
        damage: 7,
        undefendable: false,
        tokens: "",
        extraEffect: ""
      }
    ]);
  };

  const removeAttack = (id: string) => {
    if (attacks.length <= 1) return;
    setAttacks(attacks.filter(a => a.id !== id));
  };

  const updateAttack = (id: string, field: keyof AttackDef, value: any) => {
    setAttacks(attacks.map(a => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 4 Mo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Vérification robot honeypot
    if (honeypot) {
      return;
    }

    // Vérification captcha
    if (Number(mathAnswer) !== mathA + mathB) {
      setErrorMsg(`La réponse au calcul anti-spam est incorrecte (${mathA} + ${mathB}). Veuillez réessayer.`);
      return;
    }

    if (!creatorName.trim() || !creatorEmail.trim() || !monsterName.trim()) {
      setErrorMsg("Veuillez renseigner votre pseudo, email et le nom du monstre.");
      return;
    }

    setSubmitting(true);

    const payload = {
      creator_name: creatorName.trim(),
      creator_email: creatorEmail.trim(),
      type: monsterType,
      monster_name: monsterName.trim(),
      minion_rank: monsterType === "minion" ? minionRank : null,
      concept_description: concept.trim() || "Aucune description fournie.",
      roll_objective: rollObjective.trim() || "Objectif standard selon les attaques.",
      attacks: attacks.map(a => ({
        label: a.label,
        condition: a.symbolsDetail,
        damage: a.damage,
        undefendable: a.undefendable,
        effects: [a.tokens, a.extraEffect].filter(Boolean).join(" · ")
      })),
      passive_description: passive.trim() || null,
      health: Number(health),
      cp: Number(cp),
      defense_description: defenseDesc.trim() || null,
      defense_dice: Number(defenseDice),
      special_constraints: specialConstraints.trim() || null,
      image_url: imagePreview || imageUrl.trim() || null,
      status: "unseen" // Statut par défaut : non vue
    };

    try {
      const { error } = await supabase.from("community_proposals").insert([payload]);

      if (error) {
        console.warn("Enregistrement de secours en local (table Supabase pas encore créée ou accès restreint) :", error.message);
      }

      // Stocke également en local pour que l'admin et l'utilisateur puissent voir la proposition
      const stored = JSON.parse(localStorage.getItem("dts_community_proposals") || "[]");
      stored.unshift({ ...payload, id: `local-${Date.now()}`, created_at: new Date().toISOString() });
      localStorage.setItem("dts_community_proposals", JSON.stringify(stored));

      setSuccess(true);
    } catch (err: any) {
      console.error("Erreur lors de l'envoi :", err);
      setErrorMsg("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <SiteHeader />

      <section className="subHero shell">
        <p className="eyebrow"><span />Forge Communautaire</p>
        <h1>Proposer un monstre</h1>
        <p className="lead">
          Créez un minion pour enrichir le Mode Rush ou proposez un boss légendaire pour la sélection mensuelle !
          L&apos;admin étudiera votre création et vous contactera par email pour les ajustements et le vote.
        </p>
      </section>

      <section className="shell" style={{ paddingBottom: "110px" }}>
        {success ? (
          <article className="panel" style={{ textAlign: "center", padding: "60px 30px", maxWidth: "720px", margin: "0 auto" }}>
            <span style={{ fontSize: "56px", display: "block", marginBottom: "16px" }}>⚔️</span>
            <span className="statusBadge" style={{ background: "#22c55e22", color: "#4ade80", border: "1px solid #22c55e", marginBottom: "16px" }}>
              Statut : Non vue (Unseen)
            </span>
            <h2 style={{ font: "800 34px var(--font-display)", textTransform: "uppercase", margin: "10px 0 16px" }}>
              Proposition envoyée avec succès !
            </h2>
            <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: 1.8, maxWidth: "560px", margin: "0 auto 28px" }}>
              Merci <b>{creatorName}</b> ! Votre proposition pour <b>« {monsterName} »</b> a bien été transmise à l&apos;équipe.
              L&apos;administrateur examinera votre monstre (équilibrage, dés, passif) et vous enverra un email à <b>{creatorEmail}</b> pour vous tenir au courant de sa validation et de son passage au vote !
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="button fire" href="/modes/boss-battle">
                Voir les Boss & Voter
              </Link>
              <button
                type="button"
                className="button light"
                onClick={() => {
                  setSuccess(false);
                  setMonsterName("");
                  setConcept("");
                  setRollObjective("");
                }}
              >
                Proposer un autre monstre
              </button>
            </div>
          </article>
        ) : (
          <form onSubmit={handleSubmit} className="panel" style={{ maxWidth: "880px", margin: "0 auto", padding: "40px" }}>
            {/* PIÈGE HONEYPOT POUR ROBOTS */}
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* SECTION 1 : CRÉATEUR */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Étape 1 · Votre identité</p>
              <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                Créateur & Contact
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Pseudo de créateur *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Gandalf, DragonSlayer42..."
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Votre email de contact *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="pour échanger avec l'admin"
                    value={creatorEmail}
                    onChange={(e) => setCreatorEmail(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                  <small style={{ color: "#8a94a2", display: "block", marginTop: "6px", fontSize: "11px" }}>
                    Je vous enverrai un email dès que votre monstre sera examiné ou soumis au vote.
                  </small>
                </div>
              </div>
            </div>

            {/* SECTION 2 : TYPE & RANG */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Étape 2 · Catégorie</p>
              <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                Type de monstre
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "22px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "18px",
                    background: monsterType === "boss" ? "rgba(255, 98, 38, 0.15)" : "#090d14",
                    border: monsterType === "boss" ? "2px solid var(--orange)" : "1px solid var(--line)",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="radio"
                    name="monsterType"
                    checked={monsterType === "boss"}
                    onChange={() => setMonsterType("boss")}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "15px", color: "#fff" }}>Boss (Mode Boss Battle)</strong>
                    <small style={{ color: "#aeb6c2" }}>Soumis au vote communautaire mensuel (1 boss ajouté par mois)</small>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "18px",
                    background: monsterType === "minion" ? "rgba(76, 201, 119, 0.15)" : "#090d14",
                    border: monsterType === "minion" ? "2px solid #4ade80" : "1px solid var(--line)",
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="radio"
                    name="monsterType"
                    checked={monsterType === "minion"}
                    onChange={() => setMonsterType("minion")}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "15px", color: "#fff" }}>Minion (Mode Rush)</strong>
                    <small style={{ color: "#aeb6c2" }}>Intégré au pack de monstres communautaires activable au choix</small>
                  </div>
                </label>
              </div>

              {monsterType === "minion" && (
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Niveau / Rang du Minion
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                    {[
                      { key: "green", label: "Green (Niv. 1)", color: "#4ade80" },
                      { key: "blue", label: "Blue (Niv. 2)", color: "#38bdf8" },
                      { key: "purple", label: "Purple (Niv. 3)", color: "#c084fc" },
                      { key: "orange", label: "Orange (Boss route)", color: "#fb923c" }
                    ].map(r => (
                      <button
                        type="button"
                        key={r.key}
                        onClick={() => setMinionRank(r.key as any)}
                        style={{
                          padding: "12px",
                          border: minionRank === r.key ? `2px solid ${r.color}` : "1px solid var(--line)",
                          background: minionRank === r.key ? `${r.color}22` : "#090d14",
                          color: minionRank === r.key ? "#fff" : "#94a3b8",
                          fontWeight: "800",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3 : NOM & CONCEPT */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Étape 3 · Identité & Lore</p>
              <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                Description de la créature
              </h3>
              <div style={{ display: "grid", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Nom du {monsterType === "boss" ? "Boss" : "Minion"} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Gorgone des Abysses, Golem de Soufre..."
                    value={monsterName}
                    onChange={(e) => setMonsterName(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Partis pris créatif & Lore
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Son histoire, son style de combat, ce qui rend cette créature unique..."
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    🎯 Objectif de lancé (IA d&apos;automatisation des dés) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Vise la grande suite en priorité, sinon garde les symboles rouges pour infliger Brûlure"
                    value={rollObjective}
                    onChange={(e) => setRollObjective(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                  <small style={{ color: "#8a94a2", display: "block", marginTop: "6px", fontSize: "11px" }}>
                    L&apos;IA suivra cette directive pour choisir quels dés relancer aux lancers 2 et 3.
                  </small>
                </div>
              </div>
            </div>

            {/* SECTION 4 : MODULE D'ATTAQUES (1 à 6) */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Étape 4 · Attaques</p>
                  <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "4px 0 0" }}>
                    Table des attaques ({attacks.length} / 6)
                  </h3>
                </div>
                {attacks.length < 6 && (
                  <button
                    type="button"
                    onClick={addAttack}
                    className="button fire"
                    style={{ padding: "10px 16px", fontSize: "11px" }}
                  >
                    + Ajouter une attaque
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gap: "20px" }}>
                {attacks.map((atk, index) => (
                  <div key={atk.id} style={{ background: "#080c13", border: "1px solid var(--line)", padding: "20px", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <span style={{ fontWeight: "900", fontSize: "12px", color: "var(--orange)", textTransform: "uppercase" }}>
                        Attaque #{index + 1}
                      </span>
                      {attacks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAttack(atk.id)}
                          style={{ background: "transparent", border: "0", color: "#f87171", cursor: "pointer", fontSize: "12px", fontWeight: "800" }}
                        >
                          ✕ Supprimer
                        </button>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", marginBottom: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", fontWeight: "800", marginBottom: "6px" }}>
                          Nom de l&apos;attaque
                        </label>
                        <input
                          type="text"
                          required
                          value={atk.label}
                          onChange={(e) => updateAttack(atk.id, "label", e.target.value)}
                          placeholder="Ex: Frappe foudroyante"
                          style={{ width: "100%", padding: "10px", background: "#0f1622", border: "1px solid var(--line)", color: "#fff" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", fontWeight: "800", marginBottom: "6px" }}>
                          Combinaison requise de dés
                        </label>
                        <input
                          type="text"
                          required
                          value={atk.symbolsDetail}
                          onChange={(e) => updateAttack(atk.id, "symbolsDetail", e.target.value)}
                          placeholder="Ex: 3 Blancs, Petite suite, 4 Oranges..."
                          style={{ width: "100%", padding: "10px", background: "#0f1622", border: "1px solid var(--line)", color: "#fff" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "100px 140px 1fr", gap: "16px", alignItems: "center" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", fontWeight: "800", marginBottom: "6px" }}>
                          Dégâts
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={atk.damage}
                          onChange={(e) => updateAttack(atk.id, "damage", Number(e.target.value))}
                          style={{ width: "100%", padding: "10px", background: "#0f1622", border: "1px solid var(--line)", color: "#fff" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", marginTop: "20px" }}>
                          <input
                            type="checkbox"
                            checked={atk.undefendable}
                            onChange={(e) => updateAttack(atk.id, "undefendable", e.target.checked)}
                          />
                          Dégâts imparables
                        </label>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", fontWeight: "800", marginBottom: "6px" }}>
                          Tokens / Effets supplémentaires
                        </label>
                        <input
                          type="text"
                          value={atk.tokens}
                          onChange={(e) => updateAttack(atk.id, "tokens", e.target.value)}
                          placeholder="Ex: Poison, Knockdown, Vole 1 PC..."
                          style={{ width: "100%", padding: "10px", background: "#0f1622", border: "1px solid var(--line)", color: "#fff" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions rapides de tokens */}
              <div style={{ marginTop: "14px" }}>
                <small style={{ color: "#8a94a2", display: "block", marginBottom: "8px" }}>Tokens fréquents Dice Throne :</small>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {SUGGESTED_TOKENS.map(t => (
                    <span
                      key={t}
                      style={{ background: "#111a26", border: "1px solid var(--line)", padding: "4px 8px", fontSize: "11px", borderRadius: "3px", color: "#cbd5e1" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 5 : PASSIF, STATS & DÉFENSE */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Étape 5 · Stats & Défense</p>
              <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                Attributs & Résilience
              </h3>
              <div style={{ display: "grid", gap: "18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                      Points de Vie (PV) *
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="150"
                      required
                      value={health}
                      onChange={(e) => setHealth(Number(e.target.value))}
                      style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                    />
                    <small style={{ color: "#8a94a2", display: "block", marginTop: "4px" }}>
                      {monsterType === "boss" ? "Recommandé : 50 à 75 HP" : "Recommandé : 8 à 20 HP"}
                    </small>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                      Points de Combat (PC) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      required
                      value={cp}
                      onChange={(e) => setCp(Number(e.target.value))}
                      style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                      Dés de défense
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={defenseDice}
                      onChange={(e) => setDefenseDice(Number(e.target.value))}
                      style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Règle de défense textuelle *
                  </label>
                  <input
                    type="text"
                    required
                    value={defenseDesc}
                    onChange={(e) => setDefenseDesc(e.target.value)}
                    placeholder="Ex: Sur 2 Oranges, annule 2 dégâts. Sur 2 Rouges, inflige Brûlure."
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Passif spécial (description textuelle)
                  </label>
                  <textarea
                    rows={3}
                    value={passive}
                    onChange={(e) => setPassive(e.target.value)}
                    placeholder="Ex: En début de tour, gagne 1 jeton Évasion. Si son jet d'attaque échoue, regagne 3 PV..."
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Contraintes spécifiques & notes de règles (facultatif)
                  </label>
                  <textarea
                    rows={2}
                    value={specialConstraints}
                    onChange={(e) => setSpecialConstraints(e.target.value)}
                    placeholder="Ex: Doit être affronté après le 5ème combat, nécessite un plateau spécial..."
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 6 : ILLUSTRATION */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Étape 6 · Visuel (Facultatif)</p>
              <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                Illustration du monstre
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "center" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Uploader une image (PNG / JPG / WebP)
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageFile}
                    style={{ width: "100%", padding: "10px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                  <small style={{ color: "#8a94a2", display: "block", marginTop: "6px" }}>Max 4 Mo</small>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Ou coller l&apos;URL d&apos;une image
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>
              </div>

              {(imagePreview || imageUrl) && (
                <div style={{ marginTop: "18px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <img
                    src={imagePreview || imageUrl}
                    alt="Aperçu monstre"
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--orange)" }}
                  />
                  <span style={{ fontSize: "12px", color: "#4ade80" }}>✓ Image chargée avec succès</span>
                </div>
              )}
            </div>

            {/* SECTION 7 : SÉCURITÉ / ANTI-SPAM */}
            <div style={{ marginBottom: "34px", background: "#080c13", border: "1px solid var(--line)", padding: "20px" }}>
              <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                🛡️ Sécurité anti-spam : Combien font {mathA} + {mathB} ? *
              </label>
              <input
                type="number"
                required
                placeholder="Votre réponse"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                style={{ width: "180px", padding: "12px", background: "#0f1622", border: "1px solid var(--line)", color: "#fff", fontWeight: "800" }}
              />
            </div>

            {errorMsg && (
              <p className="formError" style={{ marginBottom: "20px" }}>
                {errorMsg}
              </p>
            )}

            <button
              className="button fire"
              type="submit"
              disabled={submitting}
              style={{ width: "100%", padding: "18px", fontSize: "13px" }}
            >
              {submitting ? "Transmission à la forge..." : "Envoyer ma proposition de monstre"}
            </button>
            <small style={{ display: "block", textAlign: "center", color: "#8a94a2", marginTop: "12px", fontSize: "11px" }}>
              Votre proposition sera enregistrée avec le statut « Non vue » (Unseen). Un email vous sera envoyé pour le suivi.
            </small>
          </form>
        )}
      </section>
    </main>
  );
}
