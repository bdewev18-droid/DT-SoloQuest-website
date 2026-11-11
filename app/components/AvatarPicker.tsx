"use client";
import { useLanguage } from "./LanguageProvider";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const AVATARS = [
  "Alchemist.png", "artificer.jpg", "Barbarian.png", "BlackPanther.png", "BlackWidow.png",
  "CaptMarvel.png", "cursed-pirate.jpg", "Cyclops.png", "Deadpool.webp", "DrStrange.png",
  "Druid.png", "Duelist.png", "Forgemaster.png", "Gambit.png", "gunslinger.jpg",
  "HeadlessHorseman.png", "Huntress.png", "Iceman.png", "JeanGrey.png", "Krampus.png",
  "Loki.png", "monk.jpg", "moon-elf-hp.jpg", "MysticBrawler.png", "Necromancer.png",
  "Ninja.png", "Paladin.png", "PaleLady.png", "Psylocke.png", "pyromancer.png",
  "Raveness.png", "Rouge.png", "Samurai.jpg", "Santa.png", "ScarletWich.png",
  "Seraph.png", "ShadowThief.png", "Spiderman.png", "Storm.png", "SunElf.png",
  "Tactician.png", "Thor.png", "Treeant.png", "VampireLord.png", "Wolverine.png",
];

export const avatarUrl = (key: string) => `${basePath}/personnages/${encodeURIComponent(key)}`;

export function AvatarPicker({
  value,
  onChange,
  disabled = [],
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: string[];
}) {
  const { t } = useLanguage();
  const ts = t.testerSpace;

  return (
    <div className="avatarGallery" role="radiogroup" aria-label={ts.avatarGroupAria}>
      {AVATARS.map((key) => {
        const unavailable = disabled.includes(key) && value !== key;
        const heroName = key.replace(/\.(png|jpg|webp)$/i, "");
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={value === key}
            aria-disabled={unavailable}
            disabled={unavailable}
            className={`${value === key ? "selected" : ""} ${unavailable ? "unavailable" : ""}`}
            onClick={() => onChange(key)}
            title={unavailable ? ts.avatarUsedTitle : heroName}
          >
            <img src={avatarUrl(key)} alt="" />
            <span>{unavailable ? ts.avatarUsedBadge : heroName}</span>
          </button>
        );
      })}
    </div>
  );
}
