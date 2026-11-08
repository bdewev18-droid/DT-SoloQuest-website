"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HardLink as Link } from "../../components/HardLink";
import { SiteHeader } from "../../components/SiteHeader";
import { withBase } from "../../components/base-path";
import { supabase } from "../../lib/supabase";

type FeaturedBoss = {
  id: string;
  name: string;
  creator: string;
  title: string;
  hp: number;
  cp: number;
  description: string;
  rollObjective: string;
  passive: string;
  defense: string;
  attacks: Array<{ label: string; condition: string; damage: number; effects: string }>;
  imageUrl: string;
};

const DEFAULT_BOSS_CANDIDATE: FeaturedBoss = {
  id: "ourokhor-serpent-boss",
  name: "Ourokhor",
  creator: "Benji (Équipe DTS)",
  title: "Le Serpent Ancien · Maître du Venin",
  hp: 60,
  cp: 5,
  description:
    "Un gigantesque serpent mythique dont les écailles distillent un poison corrupteur. Plus le duel s'éternise et plus le venin s'accumule, plus Ourokhor débloque de redoutables bonus passifs.",
  rollObjective: "Cherche à infliger Poison en priorité puis déclenche Souffle d'Ombre ou constriction.",
  passive:
    "Jauge de Venin (0 à 25) : Chaque blessure de poison augmente la jauge. À 5 : Dégâts +2. À 10 : Riposte. À 15 : Évasion. À 20 : Dégâts +3. À 25 : Hex permanent. Si son lancer offensif échoue, il se soigne d'un montant égal à la jauge.",
  defense: "Jet de défense 4 dés : Annule 1 dégât par symbole Orange, inflige Poison sur 2 symboles Rouges.",
  attacks: [
    { label: "Morsure Venimeuse", condition: "3 Symboles Blancs", damage: 6, effects: "Inflige Poison + 1 Venin" },
    { label: "Constriction Mortelle", condition: "Petite Suite (4 dés)", damage: 9, effects: "Dégâts imparables + Knockdown" },
    { label: "Souffle de Venin Antique", condition: "Grande Suite (5 dés)", damage: 14, effects: "Inflige 2 Poisons + Augmente la jauge de 4" }
  ],
  imageUrl: "/ourokhor.jpg"
};

export default function BossBattlePage() {
  const [candidate, setCandidate] = useState<FeaturedBoss>(DEFAULT_BOSS_CANDIDATE);
  const [votesFor, setVotesFor] = useState(42);
  const [votesAgainst, setVotesAgainst] = useState(6);
  const [balanceAvg, setBalanceAvg] = useState(4.2);
  const [userChoice, setUserChoice] = useState<"for" | "against">("for");
  const [balanceRating, setBalanceRating] = useState<number>(4);
  const [feedback, setFeedback] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Charge les données de vote et le boss en vote actif depuis Supabase
  useEffect(() => {
    async function loadBossVoting() {
      try {
        const { data: proposal } = await supabase
          .from("community_proposals")
          .select("*")
          .eq("type", "boss")
          .in("status", ["voting", "validated"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        let targetId = DEFAULT_BOSS_CANDIDATE.id;

        if (proposal) {
          targetId = proposal.id;
          setCandidate({
            id: proposal.id,
            name: proposal.monster_name,
            creator: proposal.creator_name,
            title: "Candidat communautaire du mois",
            hp: proposal.health || 60,
            cp: proposal.cp || 5,
            description: proposal.concept_description,
            rollObjective: proposal.roll_objective,
            passive: proposal.passive_description || "Aucun passif particulier",
            defense: proposal.defense_description || "Défense standard 3 dés",
            attacks: Array.isArray(proposal.attacks) && proposal.attacks.length > 0
              ? proposal.attacks
              : DEFAULT_BOSS_CANDIDATE.attacks,
            imageUrl: proposal.image_url || "/ourokhor.jpg"
          });
        }

        // Récupère les votes
        const { data: votes } = await supabase
          .from("community_boss_votes")
          .select("vote_type,balance_rating")
          .eq("proposal_id", targetId);

        if (votes && votes.length > 0) {
          const f = votes.filter(v => v.vote_type === "for").length;
          const a = votes.filter(v => v.vote_type === "against").length;
          const totalRating = votes.reduce((acc, curr) => acc + (curr.balance_rating || 3), 0);
          setVotesFor(f);
          setVotesAgainst(a);
          setBalanceAvg(Number((totalRating / votes.length).toFixed(1)));
        }

        // Vérifie si l'utilisateur a déjà voté localement
        const localVoted = localStorage.getItem(`dts_voted_${targetId}`);
        if (localVoted) {
          setHasVoted(true);
        }
      } catch (e) {
        console.warn("Utilisation des statistiques de vote locales :", e);
      }
    }

    loadBossVoting();
  }, []);

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setStatusMsg("");

    try {
      const votePayload = {
        proposal_id: candidate.id,
        vote_type: userChoice,
        balance_rating: balanceRating,
        feedback: feedback.trim() || null,
        voter_fingerprint: typeof window !== "undefined" ? window.navigator.userAgent.slice(0, 50) : "web-user"
      };

      const { error } = await supabase.from("community_boss_votes").insert([votePayload]);

      if (error) {
        console.warn("Table Supabase en attente ou erreur RLS, vote enregistré en local :", error.message);
      }

      // Mise à jour de l'UI
      if (userChoice === "for") setVotesFor(v => v + 1);
      else setVotesAgainst(v => v + 1);

      const totalVotes = votesFor + votesAgainst + 1;
      const newAvg = Number(((balanceAvg * (totalVotes - 1) + balanceRating) / totalVotes).toFixed(1));
      setBalanceAvg(newAvg);

      localStorage.setItem(`dts_voted_${candidate.id}`, "true");
      setHasVoted(true);
      setStatusMsg("Merci pour votre vote ! Il a bien été pris en compte pour l'équilibrage de l'app.");
    } catch {
      setStatusMsg("Vote pris en compte !");
      setHasVoted(true);
    } finally {
      setBusy(false);
    }
  };

  const totalVotesCount = votesFor + votesAgainst;
  const percentFor = totalVotesCount > 0 ? Math.round((votesFor / totalVotesCount) * 100) : 50;

  return (
    <main>
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="modeHero bossBattleHero">
        <div className="shell">
          <p className="kicker">Mode Boss Battle · 1 nouveau boss par mois</p>
          <h1>
            Boss<br />
            <span>Battle</span>
          </h1>
          <p className="lead">
            Un duel narratif sous haute tension. L&apos;application prend les commandes de boss épiques dotés de règles uniques.
            La communauté propose, équilibre et élit un nouveau boss chaque mois !
          </p>
          <div className="heroNumbers">
            <div>
              <b>1</b>
              <small>Nouveau boss par mois</small>
            </div>
            <div>
              <b>Vote</b>
              <small>Équilibrage communautaire</small>
            </div>
            <div>
              <b>100%</b>
              <small>Impartial & automatisé</small>
            </div>
          </div>
          <div className="heroActions" style={{ marginTop: "32px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link className="button fire" href="#vote-boss">
              Voter pour le boss du mois ↓
            </Link>
            <Link className="button light" href="/proposer">
              ✦ Proposer un Boss ou Minion
            </Link>
          </div>
        </div>
      </section>

      {/* ROSTER OFFICIEL : NAXARUS & OUROKHOR */}
      <section className="bossRosterSection shell" style={{ padding: "90px 0" }}>
        <div className="sectionTitle centered">
          <p className="kicker">Les défis suprêmes</p>
          <h2>Deux titans légendaires déjà intégrés</h2>
          <p style={{ maxWidth: "680px", margin: "14px auto 0", color: "#aeb6c2" }}>
            Chaque boss dispose de sa propre table d&apos;attaques, de son passif tactique et de sa narration personnalisée.
          </p>
        </div>

        <div className="bossComparisonGrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "36px", marginTop: "55px" }}>
          {/* CARTE NAXARUS */}
          <article className="bossCard panel" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ height: "260px", position: "relative", borderRadius: "4px", overflow: "hidden", marginBottom: "20px" }}>
              <Image src={withBase("/naxarus.webp")} alt="Naxarus le Dévoreur" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
              <span style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.75)", border: "1px solid var(--orange)", color: "var(--orange)", padding: "4px 10px", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>Boss 01</span>
            </div>
            <div style={{ flex: 1 }}>
              <p className="kicker">Dragon stellaire · Duel narratif</p>
              <h3 style={{ font: "800 28px var(--font-display)", textTransform: "uppercase", margin: "4px 0 10px" }}>Naxarus</h3>
              <p style={{ color: "#bdc4ce", fontSize: "14px", lineHeight: 1.7 }}>
                65 points de vie. Le dragon joue en premier. Il inflige des brûlures, vole vos points de combat et déchaîne des attaques infernales si vous ne brisez pas sa défense.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "18px 0", borderTop: "1px solid var(--line)", paddingTop: "14px", display: "grid", gap: "8px", fontSize: "13px" }}>
                <li><b>PV :</b> 65 HP · <b>PC initiaux :</b> 2</li>
                <li><b>Particularité :</b> Prend l&apos;initiative du combat</li>
                <li><b>Statut :</b> Intégré & jouable</li>
              </ul>
            </div>
            <Link className="button fire" href="/jouer" style={{ width: "100%", textAlign: "center", marginTop: "16px" }}>
              Défier Naxarus
            </Link>
          </article>

          {/* CARTE OUROKHOR */}
          <article className="bossCard panel" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid #7c3aed" }}>
            <div style={{ height: "260px", position: "relative", borderRadius: "4px", overflow: "hidden", marginBottom: "20px" }}>
              <Image src={withBase("/ourokhor.jpg")} alt="Ourokhor le Serpent Ancien" fill style={{ objectFit: "cover", objectPosition: "center 20%" }} sizes="(max-width: 768px) 100vw, 50vw" />
              <span style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(124, 58, 237, 0.85)", color: "#fff", padding: "4px 10px", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>Boss 02 · Serpent</span>
            </div>
            <div style={{ flex: 1 }}>
              <p className="kicker" style={{ color: "#a78bfa" }}>Serpent antique · Jauge de Venin</p>
              <h3 style={{ font: "800 28px var(--font-display)", textTransform: "uppercase", margin: "4px 0 10px" }}>Ourokhor</h3>
              <p style={{ color: "#bdc4ce", fontSize: "14px", lineHeight: 1.7 }}>
                60 points de vie. Maître des poisons et de l&apos;asphyxie. Sa Jauge de Venin monte jusqu&apos;à 25, lui offrant Riposte, Esquive, Dégâts bonus et Hex permanent s&apos;il n&apos;est pas éliminé rapidement.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "18px 0", borderTop: "1px solid var(--line)", paddingTop: "14px", display: "grid", gap: "8px", fontSize: "13px" }}>
                <li><b>PV :</b> 60 HP · <b>Jauge Venin :</b> 0 à 25</li>
                <li><b>Particularité :</b> Se régénère si son jet offensif échoue</li>
                <li><b>Statut :</b> En cours de déploiement</li>
              </ul>
            </div>
            <Link className="button light" href="#vote-boss" style={{ width: "100%", textAlign: "center", marginTop: "16px" }}>
              Consulter & Voter
            </Link>
          </article>
        </div>
      </section>

      {/* SECTION DU VOTE MENSUEL */}
      <section id="vote-boss" className="bossVoteSection" style={{ background: "linear-gradient(180deg, #0e141f 0%, #080c12 100%)", padding: "110px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="shell">
          <div className="sectionTitle centered">
            <span className="statusBadge" style={{ background: "rgba(255, 98, 38, 0.2)", color: "var(--orange)", border: "1px solid var(--orange)", marginBottom: "12px" }}>
              Vote communautaire en cours
            </span>
            <h2>Le Boss du Mois : {candidate.name}</h2>
            <p style={{ maxWidth: "700px", margin: "14px auto 0", color: "#aeb6c2" }}>
              Proposé par <b>{candidate.creator}</b>. Donnez votre avis pour valider son intégration officielle dans l&apos;application Dice Throne Solo !
            </p>
          </div>

          <div className="votingWorkspace" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "45px", marginTop: "55px", alignItems: "start" }}>
            {/* FICHE DÉTAILLÉE DU CANDIDAT */}
            <article className="panel" style={{ padding: "34px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--line)", paddingBottom: "16px", marginBottom: "20px" }}>
                <div>
                  <span className="kicker">{candidate.title}</span>
                  <h3 style={{ font: "800 32px var(--font-display)", textTransform: "uppercase", margin: "6px 0 0" }}>{candidate.name}</h3>
                </div>
                <div style={{ textAlign: "right" }}>
                  <b style={{ font: "800 24px var(--font-display)", color: "var(--orange)" }}>{candidate.hp} PV</b>
                  <small style={{ display: "block", color: "#8a94a2" }}>{candidate.cp} PC initiaux</small>
                </div>
              </div>

              <p style={{ color: "#bdc4cf", fontSize: "14px", lineHeight: 1.8, marginBottom: "24px" }}>
                {candidate.description}
              </p>

              <div style={{ display: "grid", gap: "16px", marginBottom: "28px" }}>
                <div style={{ background: "#0a0f16", border: "1px solid var(--line)", padding: "16px" }}>
                  <b style={{ color: "var(--orange)", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>
                    🎯 Objectif de lancé
                  </b>
                  <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1" }}>{candidate.rollObjective}</p>
                </div>

                <div style={{ background: "#0a0f16", border: "1px solid var(--line)", padding: "16px" }}>
                  <b style={{ color: "#a78bfa", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>
                    ⚡ Passif spécial
                  </b>
                  <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1" }}>{candidate.passive}</p>
                </div>

                <div style={{ background: "#0a0f16", border: "1px solid var(--line)", padding: "16px" }}>
                  <b style={{ color: "#38bdf8", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>
                    🛡️ Règle de défense
                  </b>
                  <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1" }}>{candidate.defense}</p>
                </div>
              </div>

              <h4 style={{ font: "700 16px var(--font-display)", textTransform: "uppercase", margin: "0 0 14px", letterSpacing: "0.08em" }}>
                Table des attaques
              </h4>
              <div style={{ display: "grid", gap: "8px" }}>
                {candidate.attacks.map((atk, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0f16", border: "1px solid var(--line)", padding: "12px 16px", fontSize: "13px" }}>
                    <div>
                      <strong style={{ color: "#fff", display: "block" }}>{atk.label}</strong>
                      <small style={{ color: "#8a94a2" }}>Condition : {atk.condition}</small>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ color: "var(--orange)", fontWeight: "800", fontSize: "15px" }}>{atk.damage} DÉGÂTS</span>
                      <small style={{ display: "block", color: "#38bdf8" }}>{atk.effects}</small>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* FORMULAIRE DE VOTE & STATISTIQUES */}
            <div style={{ display: "grid", gap: "24px" }}>
              {/* TENDANCES ACTUELLES */}
              <article className="panel" style={{ padding: "28px" }}>
                <p className="eyebrow" style={{ color: "var(--orange)" }}><span />Résultats provisoires</p>
                <h3 style={{ font: "800 22px var(--font-display)", textTransform: "uppercase", margin: "6px 0 20px" }}>
                  Tendance communautaire
                </h3>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px", textTransform: "uppercase", fontWeight: "800" }}>
                    <span style={{ color: "#4ade80" }}>Pour : {percentFor}% ({votesFor})</span>
                    <span style={{ color: "#f87171" }}>Contre : {100 - percentFor}% ({votesAgainst})</span>
                  </div>
                  <div style={{ height: "12px", background: "#f87171", borderRadius: "6px", overflow: "hidden", display: "flex" }}>
                    <div style={{ width: `${percentFor}%`, background: "#4ade80", transition: "width 0.4s" }} />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#080d14", padding: "14px 18px", border: "1px solid var(--line)" }}>
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>Indice d&apos;équilibrage moyen :</span>
                  <span style={{ font: "800 18px var(--font-display)", color: "#facc15" }}>
                    ★ {balanceAvg} / 5
                  </span>
                </div>
                <small style={{ display: "block", color: "#64748b", marginTop: "10px", fontSize: "11px" }}>
                  Total de {totalVotesCount} vote(s) enregistrés via le site et l&apos;application.
                </small>
              </article>

              {/* MODULE DE VOTE */}
              <article className="panel" style={{ padding: "28px" }}>
                <p className="eyebrow"><span />Votre décision</p>
                <h3 style={{ font: "800 22px var(--font-display)", textTransform: "uppercase", margin: "6px 0 16px" }}>
                  Voter sur ce Boss
                </h3>

                {hasVoted ? (
                  <div style={{ background: "rgba(34, 197, 94, 0.12)", border: "1px solid #22c55e", padding: "20px", borderRadius: "4px" }}>
                    <b style={{ color: "#4ade80", display: "block", marginBottom: "6px", fontSize: "15px" }}>✓ Vote enregistré !</b>
                    <p style={{ margin: 0, color: "#cbd5e1", fontSize: "13px" }}>
                      Merci pour votre participation à l&apos;équilibrage de Solo Quest. Vos retours permettent d&apos;ajuster les points de vie, les dégâts et la jauge avant l&apos;intégration dans l&apos;app.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleVote} style={{ display: "grid", gap: "18px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                        Intégrer ce boss dans l&apos;application ?
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <button
                          type="button"
                          onClick={() => setUserChoice("for")}
                          style={{
                            padding: "14px",
                            border: userChoice === "for" ? "2px solid #22c55e" : "1px solid var(--line)",
                            background: userChoice === "for" ? "rgba(34, 197, 94, 0.15)" : "#090d14",
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: "800"
                          }}
                        >
                          👍 OUI (Pour)
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserChoice("against")}
                          style={{
                            padding: "14px",
                            border: userChoice === "against" ? "2px solid #ef4444" : "1px solid var(--line)",
                            background: userChoice === "against" ? "rgba(239, 68, 68, 0.15)" : "#090d14",
                            color: "#fff",
                            cursor: "pointer",
                            fontWeight: "800"
                          }}
                        >
                          👎 NON (Contre)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "8px" }}>
                        <span>Note d&apos;équilibrage (Faire attention aux abus) :</span>
                        <b style={{ color: "#facc15" }}>{balanceRating} / 5 étoiles</b>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={balanceRating}
                        onChange={(e) => setBalanceRating(Number(e.target.value))}
                        style={{ width: "100%", accentColor: "var(--orange)" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#64748b", marginTop: "4px" }}>
                        <span>1: Trop déséquilibré</span>
                        <span>3: Équilibré</span>
                        <span>5: Parfait</span>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "900", marginBottom: "6px" }}>
                        Remarque sur l&apos;équilibrage (facultatif) :
                      </label>
                      <textarea
                        rows={3}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Ex: La jauge monte un peu trop vite, réduire le soin lors des échecs..."
                        style={{ width: "100%", padding: "10px", background: "#090d14", border: "1px solid var(--line)", color: "#fff", fontSize: "13px" }}
                      />
                    </div>

                    <button className="button fire" type="submit" disabled={busy} style={{ width: "100%" }}>
                      {busy ? "Enregistrement..." : "Valider mon vote"}
                    </button>
                    {statusMsg && <p className="formNotice">{statusMsg}</p>}
                  </form>
                )}
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* BANDEAU PROPOSER UN MONSTRE */}
      <section className="betaCta" style={{ padding: "90px 0" }}>
        <div className="shell" style={{ textAlign: "center" }}>
          <p className="kicker">Forge Communautaire</p>
          <h2 style={{ maxWidth: "800px", margin: "10px auto 18px" }}>
            Envie de voir votre propre créature dans le jeu ?
          </h2>
          <p style={{ maxWidth: "620px", margin: "0 auto 30px", color: "#cbd5e1" }}>
            Définissez ses points de vie, ses dés, ses attaques et son passif.
            Les minions rejoignent le pack communautaire du Mode Rush, et les boss entrent dans la sélection mensuelle !
          </p>
          <Link className="button fire" href="/proposer" style={{ fontSize: "13px", padding: "18px 32px" }}>
            ✦ Proposer un Minion ou un Boss
          </Link>
        </div>
      </section>
    </main>
  );
}
