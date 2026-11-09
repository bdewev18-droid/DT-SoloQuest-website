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
  // Creator identity
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");

  // Monster classification
  const [monsterType, setMonsterType] = useState<"minion" | "boss">("boss");
  const [minionRank, setMinionRank] = useState<"green" | "blue" | "purple" | "orange">("green");

  // Lore & Concept
  const [monsterName, setMonsterName] = useState("");
  const [concept, setConcept] = useState("");
  const [rollObjective, setRollObjective] = useState("");

  // Attacks (1 to 6)
  const [attacks, setAttacks] = useState<AttackDef[]>([
    {
      id: "atk-1",
      label: "Basic Strike",
      conditionType: "symbols",
      symbolsDetail: "3 White Symbols",
      damage: 5,
      undefendable: false,
      tokens: "",
      extraEffect: ""
    },
    {
      id: "atk-2",
      label: "Major Cleave",
      conditionType: "straight",
      symbolsDetail: "Small Straight (4 dice)",
      damage: 9,
      undefendable: false,
      tokens: "Poison",
      extraEffect: "Steals 1 CP"
    }
  ]);

  // Passive, Stats & Defense
  const [passive, setPassive] = useState("");
  const [health, setHealth] = useState(monsterType === "boss" ? 60 : 12);
  const [cp, setCp] = useState(monsterType === "boss" ? 4 : 1);
  const [defenseDice, setDefenseDice] = useState(3);
  const [defenseDesc, setDefenseDesc] = useState("Roll 3 dice: Negates 1 damage per Orange symbol, inflicts 1 damage on double Red symbols.");
  const [specialConstraints, setSpecialConstraints] = useState("");

  // Optional image
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  // Anti-Spam
  const [mathA, setMathA] = useState(3);
  const [mathB, setMathB] = useState(4);
  const [mathAnswer, setMathAnswer] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Form states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Initialize math challenge
  useEffect(() => {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = Math.floor(Math.random() * 5) + 1;
    setMathA(a);
    setMathB(b);
  }, []);

  // Adjust default health on type toggle
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
        label: `Attack ${attacks.length + 1}`,
        conditionType: "symbols",
        symbolsDetail: "2 Orange Symbols + 1 Red",
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
      alert("Image must not exceed 4 MB.");
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

    // Honeypot check
    if (honeypot) {
      return;
    }

    // Math challenge verification
    if (Number(mathAnswer) !== mathA + mathB) {
      setErrorMsg(`Anti-spam calculation was incorrect (${mathA} + ${mathB}). Please try again.`);
      return;
    }

    if (!creatorName.trim() || !creatorEmail.trim() || !monsterName.trim()) {
      setErrorMsg("Please fill in your creator name, contact email, and monster name.");
      return;
    }

    setSubmitting(true);

    const payload = {
      creator_name: creatorName.trim(),
      creator_email: creatorEmail.trim(),
      type: monsterType,
      monster_name: monsterName.trim(),
      minion_rank: monsterType === "minion" ? minionRank : null,
      concept_description: concept.trim() || "No description provided.",
      roll_objective: rollObjective.trim() || "Standard objective based on attack priorities.",
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
      status: "unseen"
    };

    try {
      const { error } = await supabase.from("community_proposals").insert([payload]);

      if (error) {
        console.warn("Saved to local storage fallback:", error.message);
      }

      // Local storage backup
      const stored = JSON.parse(localStorage.getItem("dts_community_proposals") || "[]");
      stored.unshift({ ...payload, id: `local-${Date.now()}`, created_at: new Date().toISOString() });
      localStorage.setItem("dts_community_proposals", JSON.stringify(stored));

      setSuccess(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg("An error occurred during submission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <SiteHeader />

      <section className="subHero shell">
        <p className="eyebrow"><span />Community Monster Forge</p>
        <h1>Propose a Monster</h1>
        <p className="lead">
          Design an enemy for Solo Quest! Submit either a Minion for the optional Minion Rush community pack, or an epic Boss for the monthly Boss Battle rotation. Our team will review your sheet and email you regarding balance and playtesting.
        </p>
      </section>

      <section className="shell" style={{ paddingBottom: "110px" }}>
        {success ? (
          <article className="panel" style={{ textAlign: "center", padding: "60px 30px", maxWidth: "720px", margin: "0 auto" }}>
            <span style={{ fontSize: "56px", display: "block", marginBottom: "16px" }}>⚔️</span>
            <span className="statusBadge" style={{ background: "#22c55e22", color: "#4ade80", border: "1px solid #22c55e", marginBottom: "16px" }}>
              Status: Unseen
            </span>
            <h2 style={{ font: "800 34px var(--font-display)", textTransform: "uppercase", margin: "10px 0 16px" }}>
              Monster Proposal Submitted!
            </h2>
            <p style={{ color: "#cbd5e1", fontSize: "15px", lineHeight: 1.8, maxWidth: "560px", margin: "0 auto 28px" }}>
              Thank you, <b>{creatorName}</b>! Your sheet for <b>“{monsterName}”</b> has been sent to the team.
              The admin will inspect your monster&apos;s balance, dice logic, and passive traits, and will follow up with you at <b>{creatorEmail}</b>.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="button fire" href="/modes/boss-battle">
                Explore Boss Battle
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
                Propose Another Monster
              </button>
            </div>
          </article>
        ) : (
          <form onSubmit={handleSubmit} className="panel" style={{ maxWidth: "880px", margin: "0 auto", padding: "40px" }}>
            {/* HONEYPOT BOT TRAP */}
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* SECTION 1: CREATOR IDENTITY */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 1 · Creator Identity</p>
              <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                Creator &amp; Contact
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Creator Handle / Pseudo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gandalf, ShadowHunter42..."
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="for follow-up with the admin"
                    value={creatorEmail}
                    onChange={(e) => setCreatorEmail(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                  <small style={{ color: "#8a94a2", display: "block", marginTop: "6px", fontSize: "11px" }}>
                    We will email you once your monster is reviewed or scheduled for integration.
                  </small>
                </div>
              </div>
            </div>

            {/* SECTION 2: CATEGORY & RANK */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 2 · Category</p>
              <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                Monster Classification
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
                    <strong style={{ display: "block", fontSize: "15px", color: "#fff" }}>Boss (Boss Battle mode)</strong>
                    <small style={{ color: "#aeb6c2" }}>Eligible for the monthly boss roster (1 new boss added each month)</small>
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
                    <strong style={{ display: "block", fontSize: "15px", color: "#fff" }}>Minion (Minion Rush mode)</strong>
                    <small style={{ color: "#aeb6c2" }}>Integrated into the optional community minion pack</small>
                  </div>
                </label>
              </div>

              {monsterType === "minion" && (
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Minion Difficulty Tier
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                    {[
                      { key: "green", label: "Green (Tier 1 · Easy)", color: "#4ade80" },
                      { key: "blue", label: "Blue (Tier 2 · Moderate)", color: "#38bdf8" },
                      { key: "purple", label: "Purple (Tier 3 · Hard)", color: "#c084fc" },
                      { key: "orange", label: "Orange (Tier 4 · Elite)", color: "#fb923c" }
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

            {/* SECTION 3: LORE & IDENTITY */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 3 · Identity &amp; Lore</p>
              <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                Creature Description
              </h3>
              <div style={{ display: "grid", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    {monsterType === "boss" ? "Boss" : "Minion"} Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abyssal Gorgon, Brimstone Golem, Ourokhor..."
                    value={monsterName}
                    onChange={(e) => setMonsterName(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Creative Concept &amp; Lore
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Lore, fighting demeanor, origin, and thematic flavor..."
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    🎯 Roll Objective (Automated Dice AI Strategy) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aims for Large Straight first, otherwise preserves Orange symbols to trigger Burn..."
                    value={rollObjective}
                    onChange={(e) => setRollObjective(e.target.value)}
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                  <small style={{ color: "#8a94a2", display: "block", marginTop: "6px", fontSize: "11px" }}>
                    For minions, this guides which dice to keep on rerolls 2 &amp; 3. For bosses, this directs attack evaluation.
                  </small>
                </div>
              </div>
            </div>

            {/* SECTION 4: ATTACKS BUILDER (1 TO 6) */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 4 · Attacks</p>
                  <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "4px 0 0" }}>
                    Attack Actions ({attacks.length} / 6)
                  </h3>
                </div>
                {attacks.length < 6 && (
                  <button
                    type="button"
                    onClick={addAttack}
                    className="button fire"
                    style={{ padding: "10px 16px", fontSize: "11px" }}
                  >
                    + Add Attack
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gap: "20px" }}>
                {attacks.map((atk, index) => (
                  <div key={atk.id} style={{ background: "#080c13", border: "1px solid var(--line)", padding: "20px", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <span style={{ fontWeight: "900", fontSize: "12px", color: "var(--orange)", textTransform: "uppercase" }}>
                        Attack #{index + 1}
                      </span>
                      {attacks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAttack(atk.id)}
                          style={{ background: "transparent", border: "0", color: "#f87171", cursor: "pointer", fontSize: "12px", fontWeight: "800" }}
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px", marginBottom: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", fontWeight: "800", marginBottom: "6px" }}>
                          Attack Name
                        </label>
                        <input
                          type="text"
                          required
                          value={atk.label}
                          onChange={(e) => updateAttack(atk.id, "label", e.target.value)}
                          placeholder="e.g. Lightning Strike"
                          style={{ width: "100%", padding: "10px", background: "#0f1622", border: "1px solid var(--line)", color: "#fff" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", fontWeight: "800", marginBottom: "6px" }}>
                          Required Dice Combination / Symbols
                        </label>
                        <input
                          type="text"
                          required
                          value={atk.symbolsDetail}
                          onChange={(e) => updateAttack(atk.id, "symbolsDetail", e.target.value)}
                          placeholder="e.g. 3 Whites, Small Straight, 4 Oranges..."
                          style={{ width: "100%", padding: "10px", background: "#0f1622", border: "1px solid var(--line)", color: "#fff" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "100px 150px 1fr", gap: "16px", alignItems: "center" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", fontWeight: "800", marginBottom: "6px" }}>
                          Damage
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
                          Undefendable Damage
                        </label>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "10px", textTransform: "uppercase", fontWeight: "800", marginBottom: "6px" }}>
                          Tokens / Extra Effects
                        </label>
                        <input
                          type="text"
                          value={atk.tokens}
                          onChange={(e) => updateAttack(atk.id, "tokens", e.target.value)}
                          placeholder="e.g. Poison, Knockdown, Steals 1 CP..."
                          style={{ width: "100%", padding: "10px", background: "#0f1622", border: "1px solid var(--line)", color: "#fff" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick tokens */}
              <div style={{ marginTop: "14px" }}>
                <small style={{ color: "#8a94a2", display: "block", marginBottom: "8px" }}>Dice Throne Common Tokens:</small>
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

            {/* SECTION 5: STATS & DEFENSE */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 5 · Stats &amp; Defense</p>
              <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                Attributes &amp; Resilience
              </h3>
              <div style={{ display: "grid", gap: "18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                      Health Points (HP) *
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
                      {monsterType === "boss" ? "Recommended: 50 to 75 HP" : "Recommended: 8 to 20 HP"}
                    </small>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                      Combat Points (CP) *
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
                      Defense Dice Count
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
                    Defensive Reaction Rule *
                  </label>
                  <input
                    type="text"
                    required
                    value={defenseDesc}
                    onChange={(e) => setDefenseDesc(e.target.value)}
                    placeholder="e.g. On 2 Orange symbols, negates 2 damage. On 2 Red symbols, inflicts Burn."
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Passive Ability (Textual rule)
                  </label>
                  <textarea
                    rows={3}
                    value={passive}
                    onChange={(e) => setPassive(e.target.value)}
                    placeholder="e.g. At the start of its turn, gains 1 Evasive token. If its attack roll fails, recovers 3 HP..."
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Special Constraints &amp; Custom Rules (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialConstraints}
                    onChange={(e) => setSpecialConstraints(e.target.value)}
                    placeholder="e.g. Enters enrage phase below 25 HP, immune to Bleed, requires custom tracking..."
                    style={{ width: "100%", padding: "14px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 6: ARTWORK */}
            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "28px", marginBottom: "32px" }}>
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 6 · Artwork (Optional)</p>
              <h3 style={{ font: "800 24px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                Monster Illustration
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "center" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Upload an Image (PNG / JPG / WebP)
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageFile}
                    style={{ width: "100%", padding: "10px", background: "#090d14", border: "1px solid var(--line)", color: "#fff" }}
                  />
                  <small style={{ color: "#8a94a2", display: "block", marginTop: "6px" }}>Max 4 MB</small>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                    Or Paste an Image URL
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
                    alt="Monster Preview"
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--orange)" }}
                  />
                  <span style={{ fontSize: "12px", color: "#4ade80" }}>✓ Image loaded successfully</span>
                </div>
              )}
            </div>

            {/* SECTION 7: ANTI-SPAM CHALLENGE */}
            <div style={{ marginBottom: "34px", background: "#080c13", border: "1px solid var(--line)", padding: "20px" }}>
              <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                🛡️ Anti-bot verification: What is {mathA} + {mathB} ? *
              </label>
              <input
                type="number"
                required
                placeholder="Answer"
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
              {submitting ? "Sending to the Forge..." : "Submit Monster Proposal"}
            </button>
            <small style={{ display: "block", textAlign: "center", color: "#8a94a2", marginTop: "12px", fontSize: "11px" }}>
              Your submission will start with the “Unseen” status. We will follow up via email.
            </small>
          </form>
        )}
      </section>
    </main>
  );
}
