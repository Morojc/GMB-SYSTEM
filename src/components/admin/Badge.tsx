const STATUT_TONE: Record<string, string> = {
  "En attente": "bg-amber/15 text-amber",
  "Validée": "bg-olive/15 text-olive",
  "En préparation": "bg-wheat/20 text-wheat",
  "Livrée": "bg-olive/15 text-olive",
  "Annulée": "bg-clay/15 text-clay",
};

export default function Badge({ value }: { value: string }) {
  const tone = STATUT_TONE[value] ?? "bg-wheat-soft/40 text-roast";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${tone}`}>
      {value}
    </span>
  );
}
