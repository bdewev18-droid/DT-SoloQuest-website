"use client";
import { useEffect, useState } from "react";
import { HardLink as Link } from "../components/HardLink";
import { SiteHeader } from "../components/SiteHeader";
import { withBase } from "../components/base-path";
import { supabase } from "../lib/supabase";

type AttackDef = {
  id: string;
  label: string;
  conditionType: string;
  symbolsDetail: string;
  diceCount: number;
  diceFaces: number[]; // 1 to 6
  damage: number;
  undefendable: boolean;
  tokens: string[];
  extraEffect: string;
};

type DefenseLine = {
  id: string;
  condition: string;
  effect: string;
};

const TOKEN_CATALOG = [
  "Accuracy",
  "Agility",
  "Back Strike",
  "Barbed Vine",
  "Bleed",
  "Blessing of Divinity",
  "Blind",
  "Blinding Light",
  "Burn",
  "Charged Gem",
  "Cleanse",
  "Concussion",
  "Constrict",
  "Crit",
  "Cursed Doubloon",
  "Damage bonus 1",
  "Damage bonus 2",
  "Damage bonus 3",
  "Damage bonus 4",
  "Delayed Poison",
  "Disarm",
  "Entangle",
  "Evasive",
  "Flight",
  "Guard Break",
  "Hex",
  "Honor",
  "Knockdown",
  "Nanite",
  "Ninjitsu",
  "Parlay",
  "Poison",
  "Powder Keg",
  "Protect",
  "Reality Warp",
  "Regenerate",
  "Reload",
  "Retribution",
  "Shadows",
  "Shame",
  "Silence",
  "Smoke Bomb",
  "Sneak Attack",
  "Stun",
  "Targeted",
  "Wellspring",
  "Wither"
];

const DEFENSE_PRESET_CONDITIONS = [
  "On 1 White symbol",
  "On 2 White symbols",
  "On 3 White symbols",
  "On 1 Orange symbol",
  "On 2 Orange symbols",
  "On 1 Red symbol",
  "On 2 Red symbols",
  "On 3 identical symbols",
  "Small Straight on defense (4 dice)",
  "Custom reaction"
];

function getFaceColor(face: number): { label: string; color: string } {
  if (face <= 3) return { label: "White", color: "#e2e8f0" };
  if (face <= 5) return { label: "Orange", color: "#f97316" };
  return { label: "Red", color: "#ef4444" };
}

export default function ProposeMonsterPage() {
  // Step 1: Creator identity
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");

  // Step 2: Monster classification
  const [monsterType, setMonsterType] = useState<"minion" | "boss">("boss");
  const [minionRank, setMinionRank] = useState<"green" | "blue" | "purple" | "orange">("green");

  // Step 3: Core attributes
  const [health, setHealth] = useState(monsterType === "boss" ? 60 : 12);
  const [cp, setCp] = useState(monsterType === "boss" ? 4 : 1);
  const [infiniteCp, setInfiniteCp] = useState(false);
  const [defenseDice, setDefenseDice] = useState(3);

  // Step 4: Artwork
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  // Step 5: Identity & Lore
  const [monsterName, setMonsterName] = useState("");
  const [concept, setConcept] = useState("");

  // Step 6: Attacks (1 to 6)
  const [attacks, setAttacks] = useState<AttackDef[]>([
    {
      id: "atk-1",
      label: "Basic Attack",
      conditionType: "symbols",
      symbolsDetail: "3 White Symbols",
      diceCount: 3,
      diceFaces: [1, 2, 3],
      damage: 5,
      undefendable: false,
      tokens: [],
      extraEffect: ""
    },
    {
      id: "atk-2",
      label: "Heavy Strike",
      conditionType: "straight",
      symbolsDetail: "Small Straight (4 dice)",
      diceCount: 4,
      diceFaces: [1, 2, 3, 4],
      damage: 9,
      undefendable: false,
      tokens: ["Poison"],
      extraEffect: ""
    }
  ]);

  // Step 7: Passive Ability (Dedicated step)
  const [passiveName, setPassiveName] = useState("");
  const [passiveTrigger, setPassiveTrigger] = useState("start_of_turn");
  const [passiveDescription, setPassiveDescription] = useState("");

  // Step 8: Defensive Action (Dedicated step, multi-line)
  const [defenseLines, setDefenseLines] = useState<DefenseLine[]>([
    {
      id: "def-1",
      condition: "On 2 White symbols",
      effect: "Negates 1 damage"
    },
    {
      id: "def-2",
      condition: "On 2 Orange symbols",
      effect: "Negates 2 damage"
    },
    {
      id: "def-3",
      condition: "On 1 Red symbol",
      effect: "Inflicts 1 retaliation damage"
    }
  ]);

  // Step 9: Special Constraints & Anti-Spam
  const [specialConstraints, setSpecialConstraints] = useState("");
  const [mathA, setMathA] = useState(3);
  const [mathB, setMathB] = useState(4);
  const [mathAnswer, setMathAnswer] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Form states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = Math.floor(Math.random() * 5) + 1;
    setMathA(a);
    setMathB(b);
  }, []);

  useEffect(() => {
    if (monsterType === "boss") {
      if (health < 40) setHealth(60);
      if (cp < 2 && !infiniteCp) setCp(4);
    } else {
      if (health > 30) setHealth(12);
      setInfiniteCp(false);
    }
  }, [monsterType]);

  // Attacks actions
  const addAttack = () => {
    if (attacks.length >= 6) return;
    setAttacks([
      ...attacks,
      {
        id: `atk-${Date.now()}`,
        label: `Attack ${attacks.length + 1}`,
        conditionType: "symbols",
        symbolsDetail: "2 Orange Symbols + 1 Red",
        diceCount: 3,
        diceFaces: [4, 5, 6],
        damage: 7,
        undefendable: false,
        tokens: [],
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

  const cycleDieFace = (attackId: string, dieIndex: number) => {
    setAttacks(
      attacks.map(atk => {
        if (atk.id !== attackId) return atk;
        const current = atk.diceFaces[dieIndex] || 1;
        const next = current >= 6 ? 1 : current + 1;
        const nextFaces = [...atk.diceFaces];
        nextFaces[dieIndex] = next;

        // Auto summarize combination
        const whites = nextFaces.filter(f => f <= 3).length;
        const oranges = nextFaces.filter(f => f >= 4 && f <= 5).length;
        const reds = nextFaces.filter(f => f === 6).length;

        const parts: string[] = [];
        if (whites > 0) parts.push(`${whites} White${whites > 1 ? "s" : ""}`);
        if (oranges > 0) parts.push(`${oranges} Orange${oranges > 1 ? "s" : ""}`);
        if (reds > 0) parts.push(`${reds} Red${reds > 1 ? "s" : ""}`);
        const summary = parts.join(" + ") || "Custom Dice";

        return {
          ...atk,
          diceFaces: nextFaces,
          symbolsDetail: summary
        };
      })
    );
  };

  const setAttackDiceCount = (attackId: string, count: number) => {
    setAttacks(
      attacks.map(atk => {
        if (atk.id !== attackId) return atk;
        let newFaces = [...atk.diceFaces];
        if (count > newFaces.length) {
          while (newFaces.length < count) newFaces.push(1);
        } else {
          newFaces = newFaces.slice(0, count);
        }
        return {
          ...atk,
          diceCount: count,
          diceFaces: newFaces
        };
      })
    );
  };

  const applyStraightPreset = (attackId: string, type: "micro" | "small" | "large") => {
    setAttacks(
      attacks.map(atk => {
        if (atk.id !== attackId) return atk;
        if (type === "micro") {
          return {
            ...atk,
            diceCount: 3,
            diceFaces: [1, 2, 3],
            symbolsDetail: "Micro Straight (3 dice)"
          };
        }
        if (type === "small") {
          return {
            ...atk,
            diceCount: 4,
            diceFaces: [1, 2, 3, 4],
            symbolsDetail: "Small Straight (4 dice)"
          };
        }
        return {
          ...atk,
          diceCount: 5,
          diceFaces: [1, 2, 3, 4, 5],
          symbolsDetail: "Large Straight (5 dice)"
        };
      })
    );
  };

  const addTokenToAttack = (attackId: string, token: string) => {
    if (!token) return;
    setAttacks(
      attacks.map(atk => {
        if (atk.id !== attackId) return atk;
        if (atk.tokens.includes(token)) return atk;
        return {
          ...atk,
          tokens: [...atk.tokens, token]
        };
      })
    );
  };

  const removeTokenFromAttack = (attackId: string, token: string) => {
    setAttacks(
      attacks.map(atk => {
        if (atk.id !== attackId) return atk;
        return {
          ...atk,
          tokens: atk.tokens.filter(t => t !== token)
        };
      })
    );
  };

  // Defense actions
  const addDefenseLine = () => {
    setDefenseLines([
      ...defenseLines,
      {
        id: `def-${Date.now()}`,
        condition: "On 1 Orange symbol",
        effect: "Negates 1 damage"
      }
    ]);
  };

  const removeDefenseLine = (id: string) => {
    if (defenseLines.length <= 1) return;
    setDefenseLines(defenseLines.filter(d => d.id !== id));
  };

  const updateDefenseLine = (id: string, field: keyof DefenseLine, value: string) => {
    setDefenseLines(defenseLines.map(d => (d.id === id ? { ...d, [field]: value } : d)));
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

    if (honeypot) return;

    if (Number(mathAnswer) !== mathA + mathB) {
      setErrorMsg(`Anti-spam verification was incorrect (${mathA} + ${mathB}). Please try again.`);
      return;
    }

    if (!creatorName.trim() || !creatorEmail.trim() || !monsterName.trim()) {
      setErrorMsg("Please fill in your creator name, contact email, and monster name.");
      return;
    }

    setSubmitting(true);

    const formattedDefense = defenseLines
      .filter(l => l.condition.trim() || l.effect.trim())
      .map(l => `${l.condition.trim()}: ${l.effect.trim()}`)
      .join(" \n");

    const fullPassive = passiveDescription.trim()
      ? `[${passiveName.trim() || "Passive"}] (${passiveTrigger}) - ${passiveDescription.trim()}`
      : null;

    const payload = {
      creator_name: creatorName.trim(),
      creator_email: creatorEmail.trim(),
      type: monsterType,
      monster_name: monsterName.trim(),
      minion_rank: monsterType === "minion" ? minionRank : null,
      concept_description: concept.trim() || "No description provided.",
      roll_objective: "N/A",
      attacks: attacks.map(a => ({
        label: a.label,
        condition: a.symbolsDetail,
        damage: a.damage,
        undefendable: a.undefendable,
        effects: [...a.tokens, a.extraEffect.trim()].filter(Boolean).join(" · ")
      })),
      passive_description: fullPassive,
      health: Number(health),
      cp: infiniteCp ? 999 : Number(cp),
      defense_description: formattedDefense || null,
      defense_dice: Number(defenseDice),
      special_constraints: [
        infiniteCp ? "Infinite CP (∞ CP)" : null,
        specialConstraints.trim() || null
      ]
        .filter(Boolean)
        .join(" \n") || null,
      image_url: imagePreview || imageUrl.trim() || null,
      status: "unseen"
    };

    try {
      const { error } = await supabase.from("community_proposals").insert([payload]);
      if (error) {
        console.warn("Saved to local storage fallback:", error.message);
      }

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
          Design a Minion for the optional Minion Rush pack or a Boss for the monthly Boss Battle rotation.
          Configure attributes, attacks, passive rules, and defensive plans.
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
              Thank you, <b>{creatorName}</b>! Your sheet for <b>“{monsterName}”</b> has been transmitted.
              We will review the balancing and contact you at <b>{creatorEmail}</b>.
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
                }}
              >
                Propose Another Monster
              </button>
            </div>
          </article>
        ) : (
          <form onSubmit={handleSubmit} className="panel forgeFormContainer">
            {/* HONEYPOT TRAP */}
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* STEP 1: CREATOR IDENTITY */}
            <div className="forgeStepSection">
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 1 · Identity</p>
              <h3>Creator &amp; Contact</h3>
              <div className="forgeTwoCol">
                <div>
                  <label className="fieldLabel">Creator Pseudo *</label>
                  <input
                    type="text"
                    required
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="forgeInput"
                  />
                </div>
                <div>
                  <label className="fieldLabel">Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={creatorEmail}
                    onChange={(e) => setCreatorEmail(e.target.value)}
                    className="forgeInput"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: CLASSIFICATION */}
            <div className="forgeStepSection">
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 2 · Category</p>
              <h3>Monster Classification</h3>
              <div className="forgeTwoCol" style={{ marginBottom: "22px" }}>
                <label className={`typeSelectBox ${monsterType === "boss" ? "selected boss" : ""}`}>
                  <input
                    type="radio"
                    name="monsterType"
                    checked={monsterType === "boss"}
                    onChange={() => setMonsterType("boss")}
                  />
                  <div>
                    <strong>Boss (Boss Battle mode)</strong>
                    <small>Monthly solo boss gauntlet</small>
                  </div>
                </label>

                <label className={`typeSelectBox ${monsterType === "minion" ? "selected minion" : ""}`}>
                  <input
                    type="radio"
                    name="monsterType"
                    checked={monsterType === "minion"}
                    onChange={() => setMonsterType("minion")}
                  />
                  <div>
                    <strong>Minion (Minion Rush mode)</strong>
                    <small>Optional community minion pack</small>
                  </div>
                </label>
              </div>

              {monsterType === "minion" && (
                <div className="minionTierContainer">
                  <label className="fieldLabel">Minion Difficulty Tier</label>
                  <div className="tierCardsGrid">
                    {[
                      { key: "green", label: "Green", tier: "Tier 1", icon: "/ranks/carte-verte.webp", color: "#4ade80" },
                      { key: "blue", label: "Blue", tier: "Tier 2", icon: "/ranks/carte-bleue.webp", color: "#38bdf8" },
                      { key: "purple", label: "Purple", tier: "Tier 3", icon: "/ranks/carte-violette.webp", color: "#c084fc" },
                      { key: "orange", label: "Orange", tier: "Tier 4", icon: "/ranks/carte-Orange.webp", color: "#fb923c" }
                    ].map(r => (
                      <button
                        type="button"
                        key={r.key}
                        onClick={() => setMinionRank(r.key as any)}
                        className={`tierCardBtn ${minionRank === r.key ? "active" : ""}`}
                        style={{
                          borderColor: minionRank === r.key ? r.color : "var(--line)",
                          background: minionRank === r.key ? `${r.color}18` : "#0a0f16"
                        }}
                      >
                        <img src={withBase(r.icon)} alt={r.label} className="tierCardImg" />
                        <span className="tierCardName" style={{ color: r.color }}>{r.label}</span>
                        <small className="tierCardSub">{r.tier}</small>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: ATTRIBUTES (SEPARATE EARLY STEP) */}
            <div className="forgeStepSection">
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 3 · Core Attributes</p>
              <h3>Health, Combat Points &amp; Defense Dice</h3>
              <div className="forgeThreeCol">
                <div>
                  <label className="fieldLabel">Health Points (HP) *</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    required
                    value={health}
                    onChange={(e) => setHealth(Number(e.target.value))}
                    className="forgeInput"
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="fieldLabel">Combat Points (CP) *</label>
                    {monsterType === "boss" && (
                      <label className="infiniteCpToggle">
                        <input
                          type="checkbox"
                          checked={infiniteCp}
                          onChange={(e) => setInfiniteCp(e.target.checked)}
                        />
                        <span>Infinite CP (∞)</span>
                      </label>
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    required={!infiniteCp}
                    disabled={infiniteCp}
                    value={infiniteCp ? 99 : cp}
                    onChange={(e) => setCp(Number(e.target.value))}
                    className={`forgeInput ${infiniteCp ? "disabled" : ""}`}
                  />
                </div>

                <div>
                  <label className="fieldLabel">Defense Dice Count *</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    required
                    value={defenseDice}
                    onChange={(e) => setDefenseDice(Number(e.target.value))}
                    className="forgeInput"
                  />
                </div>
              </div>
            </div>

            {/* STEP 4: ARTWORK (SEPARATE EARLY STEP) */}
            <div className="forgeStepSection">
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 4 · Artwork</p>
              <h3>Monster Illustration (Optional)</h3>
              <div className="forgeTwoCol" style={{ alignItems: "center" }}>
                <div>
                  <label className="fieldLabel">Upload Image File</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageFile}
                    className="forgeFileInput"
                  />
                  <small style={{ color: "#8a94a2", display: "block", marginTop: "4px" }}>PNG, JPG or WebP (max 4 MB)</small>
                </div>
                <div>
                  <label className="fieldLabel">Or Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="forgeInput"
                  />
                </div>
              </div>

              {(imagePreview || imageUrl) && (
                <div className="artworkPreviewBox">
                  <img
                    src={imagePreview || imageUrl}
                    alt="Monster Preview"
                    className="artworkPreviewImg"
                  />
                  <span className="artworkSuccessText">✓ Image loaded</span>
                </div>
              )}
            </div>

            {/* STEP 5: IDENTITY & LORE */}
            <div className="forgeStepSection">
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 5 · Lore &amp; Identity</p>
              <h3>Creature Profile</h3>
              <div style={{ display: "grid", gap: "16px" }}>
                <div>
                  <label className="fieldLabel">Monster Name *</label>
                  <input
                    type="text"
                    required
                    value={monsterName}
                    onChange={(e) => setMonsterName(e.target.value)}
                    className="forgeInput"
                  />
                </div>
                <div>
                  <label className="fieldLabel">Creative Concept &amp; Lore</label>
                  <textarea
                    rows={3}
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    className="forgeTextarea"
                  />
                </div>
              </div>
            </div>

            {/* STEP 6: ATTACK ACTIONS (1 TO 6) */}
            <div className="forgeStepSection">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 6 · Attacks</p>
                  <h3>Attack Arsenal ({attacks.length} / 6)</h3>
                </div>
                {attacks.length < 6 && (
                  <button
                    type="button"
                    onClick={addAttack}
                    className="button fire mini"
                  >
                    + Add Attack
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gap: "24px" }}>
                {attacks.map((atk, index) => (
                  <div key={atk.id} className="attackForgeCard">
                    <div className="attackCardHeader">
                      <span className="attackCardIndex">Attack #{index + 1}</span>
                      {attacks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAttack(atk.id)}
                          className="attackCardRemoveBtn"
                        >
                          ✕ Remove
                        </button>
                      )}
                    </div>

                    {/* Name & Damage */}
                    <div className="attackTopRow">
                      <div style={{ flex: 1 }}>
                        <label className="fieldLabel">Attack Name *</label>
                        <input
                          type="text"
                          required
                          value={atk.label}
                          onChange={(e) => updateAttack(atk.id, "label", e.target.value)}
                          className="forgeInput"
                        />
                      </div>
                      <div style={{ width: "120px" }}>
                        <label className="fieldLabel">Damage</label>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={atk.damage}
                          onChange={(e) => updateAttack(atk.id, "damage", Number(e.target.value))}
                          className="forgeInput"
                        />
                      </div>
                      <div style={{ paddingTop: "26px" }}>
                        <label className="undefendableCheck">
                          <input
                            type="checkbox"
                            checked={atk.undefendable}
                            onChange={(e) => updateAttack(atk.id, "undefendable", e.target.checked)}
                          />
                          <span>Undefendable</span>
                        </label>
                      </div>
                    </div>

                    {/* Interactive Dice Selector & Straight Presets */}
                    <div className="diceSelectorModule">
                      <div className="diceSelectorTop">
                        <span className="moduleSectionTitle">Required Dice Combination / Symbols</span>
                        <div className="straightPresetsGroup">
                          <button
                            type="button"
                            className="straightPresetBtn"
                            onClick={() => applyStraightPreset(atk.id, "micro")}
                          >
                            Micro Straight (3)
                          </button>
                          <button
                            type="button"
                            className="straightPresetBtn"
                            onClick={() => applyStraightPreset(atk.id, "small")}
                          >
                            Small Straight (4)
                          </button>
                          <button
                            type="button"
                            className="straightPresetBtn"
                            onClick={() => applyStraightPreset(atk.id, "large")}
                          >
                            Large Straight (5)
                          </button>
                        </div>
                      </div>

                      <div className="dicePickerControls">
                        <div className="diceCountPicker">
                          <span>Dice Count:</span>
                          {[2, 3, 4, 5].map(cnt => (
                            <button
                              key={cnt}
                              type="button"
                              className={`diceCountBtn ${atk.diceCount === cnt ? "active" : ""}`}
                              onClick={() => setAttackDiceCount(atk.id, cnt)}
                            >
                              {cnt}
                            </button>
                          ))}
                        </div>
                        <span className="diceHint">Click on any die below to cycle its face (1 to 6)</span>
                      </div>

                      {/* Interactive Dice Face Buttons */}
                      <div className="interactiveDiceRow">
                        {atk.diceFaces.map((face, dieIdx) => {
                          const faceInfo = getFaceColor(face);
                          return (
                            <button
                              key={dieIdx}
                              type="button"
                              className="interactiveDieBtn"
                              onClick={() => cycleDieFace(atk.id, dieIdx)}
                              title={`Die #${dieIdx + 1}: Face ${face} (${faceInfo.label}) - Click to cycle`}
                            >
                              <img
                                src={withBase(`/dice_faces/face_${face}.webp`)}
                                alt={`Face ${face}`}
                                className="dieFaceImg"
                              />
                              <span className="dieFaceNum" style={{ color: faceInfo.color }}>
                                {face} · {faceInfo.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Condition Text Field */}
                      <div style={{ marginTop: "12px" }}>
                        <label className="fieldLabel">Combination Summary</label>
                        <input
                          type="text"
                          required
                          value={atk.symbolsDetail}
                          onChange={(e) => updateAttack(atk.id, "symbolsDetail", e.target.value)}
                          className="forgeInput"
                        />
                      </div>
                    </div>

                    {/* Tokens Dropdown & Badges */}
                    <div className="tokensModule">
                      <label className="fieldLabel">Tokens Inflicted / Added</label>
                      <div className="tokenSelectRow">
                        <select
                          className="forgeSelect"
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              addTokenToAttack(atk.id, e.target.value);
                            }
                          }}
                        >
                          <option value="">— Select a token from catalog —</option>
                          {TOKEN_CATALOG.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      {atk.tokens.length > 0 && (
                        <div className="selectedTokensPills">
                          {atk.tokens.map(t => (
                            <span key={t} className="tokenPill">
                              {t}
                              <button
                                type="button"
                                onClick={() => removeTokenFromAttack(atk.id, t)}
                                className="tokenPillRemove"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Extra Effects Text Field (Right underneath tokens) */}
                    <div style={{ marginTop: "14px" }}>
                      <label className="fieldLabel">Extra Effects</label>
                      <input
                        type="text"
                        value={atk.extraEffect}
                        onChange={(e) => updateAttack(atk.id, "extraEffect", e.target.value)}
                        className="forgeInput"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 7: PASSIVE ABILITY (DEDICATED STEP) */}
            <div className="forgeStepSection">
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 7 · Passive Ability</p>
              <h3>Passive Trait</h3>
              <div style={{ display: "grid", gap: "16px" }}>
                <div className="forgeTwoCol">
                  <div>
                    <label className="fieldLabel">Passive Name</label>
                    <input
                      type="text"
                      value={passiveName}
                      onChange={(e) => setPassiveName(e.target.value)}
                      className="forgeInput"
                    />
                  </div>
                  <div>
                    <label className="fieldLabel">Trigger Condition</label>
                    <select
                      className="forgeSelect"
                      value={passiveTrigger}
                      onChange={(e) => setPassiveTrigger(e.target.value)}
                    >
                      <option value="start_of_turn">Start of turn (Upkeep phase)</option>
                      <option value="roll_failure">If offensive roll fails</option>
                      <option value="continuous">Continuous / Passive battle rule</option>
                      <option value="on_damage">On taking damage / Low health</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="fieldLabel">Passive Effect Description</label>
                  <textarea
                    rows={3}
                    value={passiveDescription}
                    onChange={(e) => setPassiveDescription(e.target.value)}
                    className="forgeTextarea"
                  />
                </div>
              </div>
            </div>

            {/* STEP 8: DEFENSIVE ACTION (DEDICATED STEP, MULTI-LINE) */}
            <div className="forgeStepSection">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 8 · Defense Action</p>
                  <h3>Defensive Reaction Plan ({defenseDice} Dice)</h3>
                </div>
                <button
                  type="button"
                  onClick={addDefenseLine}
                  className="button fire mini"
                >
                  + Add Defense Line
                </button>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {defenseLines.map((line, idx) => (
                  <div key={line.id} className="defenseLineRow">
                    <span className="defenseLineNum">#{idx + 1}</span>
                    <div style={{ width: "230px" }}>
                      <select
                        className="forgeSelect"
                        value={line.condition}
                        onChange={(e) => updateDefenseLine(line.id, "condition", e.target.value)}
                      >
                        {DEFENSE_PRESET_CONDITIONS.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={line.effect}
                        onChange={(e) => updateDefenseLine(line.id, "effect", e.target.value)}
                        className="forgeInput"
                      />
                    </div>
                    {defenseLines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDefenseLine(line.id)}
                        className="attackCardRemoveBtn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 9: SPECIAL CONSTRAINTS & ANTI-SPAM */}
            <div className="forgeStepSection">
              <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Step 9 · Special Rules &amp; Verification</p>
              <h3>Additional Rules &amp; Submission</h3>
              <div style={{ display: "grid", gap: "18px" }}>
                <div>
                  <label className="fieldLabel">Special Constraints / Custom Match Rules</label>
                  <textarea
                    rows={2}
                    value={specialConstraints}
                    onChange={(e) => setSpecialConstraints(e.target.value)}
                    className="forgeTextarea"
                  />
                </div>

                <div className="mathChallengeBox">
                  <label className="fieldLabel">
                    Anti-bot verification: What is {mathA} + {mathB} ? *
                  </label>
                  <input
                    type="number"
                    required
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    className="forgeInput mathInput"
                  />
                </div>
              </div>
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
              style={{ width: "100%", padding: "18px", fontSize: "14px" }}
            >
              {submitting ? "Transmitting to the Forge..." : "Submit Monster Proposal"}
            </button>
            <small style={{ display: "block", textAlign: "center", color: "#8a94a2", marginTop: "12px", fontSize: "11px" }}>
              Submissions start with status “Unseen”. The admin team will follow up by email.
            </small>
          </form>
        )}
      </section>
    </main>
  );
}
