"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Users, ShieldAlert, CheckCircle2, Info, 
  AlertTriangle, LayoutDashboard, User, BarChart3, ArrowRight
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- KOMPLETNÁ DATABÁZA DÁT Z PDF ---
const VALUES_DB = {
  BLUE: [
    { v: "Poriadok", pos: "Mám rád, keď veci fungujú podľa jasných pravidiel a zabehnutých postupov.", neg: "Vytvára paralyzujúcu byrokraciu a strach z odchýlok." },
    { v: "Stabilita", pos: "Vyhľadávam predvídateľnosť a chránim seba aj tím pred chaosom.", neg: "Zamŕza v status quo a dogmaticky blokuje inovácie." },
    { v: "Morálka", pos: "Zásadne dodržiavam sľuby a konám čestne aj bez osobného prospechu.", neg: "Povýšenecké moralizovanie a verejné pranierovanie iných." },
    { v: "Disciplína", pos: "Vyžadujem dôsledné dodržiavanie dohôd a termínov.", neg: "Toxický mikromanažment a kultúra strachu." },
    { v: "Presnosť", pos: "Potrpím si na presné detaily a bezchybnosť výstupov.", neg: "Analysis paralysis – utápanie sa v nepodstatných detailoch." },
    { v: "Štruktúra", pos: "Potrebujem jasné rozdelenie úloh a kompetencií.", neg: "Vytváranie nepriechodných izolovaných oddelení (silos)." },
    { v: "Lojálnosť", pos: "Som verný priateľom a firme, v krízach ich vždy chránim.", neg: "Vyžadovanie slepej poslušnosti, kritiku berie ako zradu." },
    { v: "Pracovitosť", pos: "Verím v poctivú tvrdú prácu a idem ostatným príkladom.", neg: "Glorifikácia workoholizmu a vyčerpania." },
    { v: "Plnenie povinností", pos: "K záväzkom pristupujem s maximálnou vážnosťou.", neg: "Úzkoprsý alibizmus na štýl 'to nie je moja práca'." },
    { v: "Skromnosť", pos: "Úspechy radšej pripisujem spoločnému úsiliu než sebe.", neg: "Falošná skromnosť prechádzajúca do mučeníctva." }
  ],
  ORANGE: [
    { v: "Logika", pos: "Rozhodujem sa výlučne na základe faktov a racionálneho úsudku.", neg: "Chladná slepota voči ľudskej psychológii a emóciám." },
    { v: "Úspech", pos: "Motivuje ma dosahovanie viditeľných výsledkov a víťazstvo.", neg: "Princíp 'účel svätí prostriedky' na úkor zdravia ľudí." },
    { v: "Jasné ciele", pos: "Svoj život riadim podľa presne merateľných metrík.", neg: "Stanovovanie nesplniteľných a stresujúcich cieľov." },
    { v: "Ambicióznosť", pos: "Neuspokojím sa s priemerom, chcem neustále rásť.", neg: "Narcistická chamtivosť a ignorancia reálnych kapacít." },
    { v: "Zvedavosť", pos: "Rád objavujem nové technológie a hľadám efektivitu.", neg: "Syndróm blýskavých objektov – skákanie od trendu k trendu." },
    { v: "Kreativita", pos: "Baví ma prichádzať s inovatívnymi a novými nápadmi.", neg: "Neukotvené snívanie a odmietanie prevádzkovej reality." },
    { v: "Optimizmus", pos: "V krízach zachovávam neoblomnú vieru v úspešný koniec.", neg: "Toxická pozitivita – zakazovanie pomenovať reálne hrozby." },
    { v: "Profesionalita", pos: "Zakladám si na špičkovej kvalite a vecnej komunikácii.", neg: "Budovanie odstupu cez korporátny žargón bez ľudskosti." },
    { v: "Dokonalosť", pos: "Neustále optimalizujem procesy pre maximálnu excelentnosť.", neg: "Paralyzujúci perfekcionizmus, ktorý zdržuje spustenie." },
    { v: "Prosperita", pos: "Dôležité je budovať materiálne zázemie a finančný rast.", neg: "Agresívne osekávanie nákladov pre krátkodobé dividendy." },
    { v: "Nezávislosť", pos: "Najlepšie fungujem s plnou autonómiou a voľnosťou.", neg: "Extrémny izolacionizmus a sabotovanie spoločnej stratégie." },
    { v: "Seba-vyjadrenie", pos: "Rád prezentujem svoje schopnosti a budujem si meno.", neg: "Narcistická exhibícia a kradnutie nápadov iných." }
  ],
  GREEN: [
    { v: "Harmónia", pos: "Záleží mi na priateľských vzťahoch a urovnávaní sporov.", neg: "Strach z konfliktu a zametanie toxicity pod koberec." },
    { v: "Súdržnosť", pos: "Robím všetko pre to, aby rodina a tím držali pokope.", neg: "Groupthink – pasívne-agresívne trestanie iného názoru." },
    { v: "Spravodlivosť", pos: "Citlivo vnímam potreby iných a dbám na férové šance.", neg: "Uplatňovanie kolektívnej viny a rovnostárskej utópie." },
    { v: "Rovnosť", pos: "Ku každému pristupujem s rovnakou úctou a rešpektom.", neg: "Popieranie hierarchie kompetencií, chaos v riadení." },
    { v: "Konsenzus", pos: "Nerád vnucujem riešenia, hľadám súhlas väčšiny.", neg: "Kríza rozhodovania – neschopnosť urobiť krok bez každého." },
    { v: "Spolupatričnosť", pos: "Vytváram prostredie, kde ľudia môžu byť sami sebou.", neg: "Vytváranie nezdravej emocionálnej závislosti na firme." },
    { v: "Solidarita", pos: "Cítim prirodzenú zodpovednosť pomáhať ľuďom v núdzi.", neg: "Agresívne a povinné dobro pod sociálnym nátlakom." },
    { v: "Mindfulness", pos: "Vážim si prítomný okamih a plnú pozornosť ľuďom.", neg: "Únik do pseudo-spirituality pre neschopnosť riadiť." },
    { v: "Rešpekt", pos: "Oceňujem rozmanitosť a nikoho nesúdim podľa stereotypov.", neg: "Vylučovanie kohokoľvek, kto položí racionálnu otázku." },
    { v: "Podpora", pos: "Aktívne pomáham ostatným rásť a rozkvitať.", neg: "Helikoptérový manažér – hasenie problémov za iných." },
    { v: "Empatia", pos: "Dokážem sa hlboko vcítiť do prežívania iných ľudí.", neg: "Slepá submisivita zo strachu pred zranením citov." },
    { v: "Spolupráca", pos: "Oveľa radšej pracujem v skupine na spoločnom cieli.", neg: "Rozmazanie individuálnej zodpovednosti a alibizmus." },
    { v: "Tolerancia", pos: "Vytváram prostredie odolné voči predsudkom.", neg: "Tolerovanie flákačov na úkor výkonných ľudí." },
    { v: "Pokora", pos: "Priznávam vlastné chyby a počúvam expertov.", neg: "Slabosť a neustále znižovanie vlastnej autority." },
    { v: "Zábava", pos: "Snažím sa brať život s ľahkosťou a humorom.", neg: "Infantilná povinná zábava maskujúca reálne problémy." }
  ],
  YELLOW: [
    { v: "Synergia", pos: "Spájam odlišné myšlienky do celku, ktorý funguje lepšie.", neg: "Umelé prepájanie nesúvisiacich vecí pre ideológiu." },
    { v: "Komplexnosť", pos: "Vnímam situácie z viacerých uhlov – psychologicky aj ekonomicky.", neg: "Stratenie schopnosti akcie kvôli nekonečným teóriám." },
    { v: "Partnerstvo", pos: "Budujem vzťahy tak, aby profitoval celý ekosystém.", neg: "Naivné odovzdávanie know-how konkurencii bez boja." },
    { v: "Prepojenosť", pos: "Chápem, ako mikro-kroky ovplyvňujú globálny obraz.", neg: "Totálne rozptýlenie focusu a strata zamerania na zisk." },
    { v: "Inšpiratívnosť", pos: "Viem podať zložitú víziu jednoducho a nadchnúť okolie.", neg: "Arogantný vizionár bez kontaktu s realitou ľudí." },
    { v: "Integrita", pos: "Konám v hlbokom súlade s vnútorným presvedčením.", neg: "Puristický extrémizmus odmietajúci kompromis." },
    { v: "Majstrovstvo", pos: "Chcem do hĺbky pochopiť, ako funguje svet.", neg: "Elitárska veža zo slonoviny opovrhujúca operatívou." },
    { v: "Spontánnosť", pos: "Dokážem okamžite zmeniť plány podľa vývoja situácie.", neg: "Impulzívne menenie pravidiel vedúce k vyhoreniu tímu." },
    { v: "Seba-uvedomovanie", pos: "Dokážem izolovať vlastné ego a prepínať štýl vedenia.", neg: "Narcistické zacyklenie sa vo vlastnej terapii." },
    { v: "Zhoda", pos: "Hľadám spoločný zmysel, s ktorým sa stotožnia všetci.", neg: "Hľadanie dokonalej harmónie, ktorá paralyzuje dnešok." }
  ]
};

// Pomocná funkcia na plochý zoznam
const FLAT_VALUES = Object.entries(VALUES_DB).flatMap(([lvl, items]) => 
  items.map(i => ({ ...i, lvl }))
);

const THEORY: any = {
  BLUE: { name: "MODRÁ: Rád a Poriadok", col: "#2563eb", d: "Zameranie na stabilitu, pravidlá a disciplínu. Svet má mať poriadok a zmysel." },
  ORANGE: { name: "ORANŽOVÁ: Výkon a Úspech", col: "#ea580c", d: "Svet je plný príležitostí. Orientujete sa na efektivitu a merateľný úspech." },
  GREEN: { name: "ZELENÁ: Komunita a Harmónia", col: "#16a34a", d: "Ľudský faktor je prvoradý. Zameriavate sa na empatiu, vzťahy a inklúziu." },
  YELLOW: { name: "ŽLTÁ: Systémová Integrácia", col: "#ca8a04", d: "Vidíte svet ako komplexný systém. Orientujete sa na funkčnosť bez tlaku ega." }
};

export default function GrowClubApp() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState({ name: '', code: '', context: '' });
  const [pos, setPos] = useState<string[]>([]);
  const [neg, setNeg] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<any[]>([]);

  // Výpočty percent
  const getStats = (selection: string[]) => {
    let s: any = { BLUE:0, ORANGE:0, GREEN:0, YELLOW:0 };
    selection.forEach(val => {
      const item = FLAT_VALUES.find(i => i.v === val);
      if(item) s[item.lvl]++;
    });
    return s;
  };

  const posStats = useMemo(() => getStats(pos), [pos]);
  const negStats = useMemo(() => getStats(neg), [neg]);

  const submitResults = async () => {
    await supabase.from('teams').upsert({ team_code: user.code });
    await supabase.from('assessments').insert({
      team_code: user.code,
      user_name: user.name,
      context: user.context,
      pos_scores: posStats,
      neg_scores: negStats,
      pos_labels: pos,
      neg_labels: neg
    });
    setStep(4);
  };

  const fetchTeam = async () => {
    const { data } = await supabase.from('assessments').select('*').eq('team_code', user.code);
    if (data) setTeamData(data);
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-[#1e1a34] text-white p-4 md:p-10 font-sans">
      <header className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="font-serif text-4xl md:text-6xl tracking-tighter">FORBES <span className="text-[#c7a1f7]">GROWCLUB</span></h1>
        <p className="text-[#c7a1f7]/50 uppercase tracking-[0.5em] text-[10px] font-black mt-2">Professional Values Analysis</p>
      </header>

      <main className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
        <AnimatePresence mode="wait">

          {/* STEP 1: LOGIN */}
          {step === 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-serif mb-4">Nastavenie profilu</h2>
                <p className="text-white/40 text-sm italic">"Tieto výsledky nereprezentujú klinický nález, ale slúžia ako mapa na vašu sebareflexiu."</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input placeholder="Meno a Priezvisko" className="bg-white/10 p-5 rounded-2xl border border-white/10 outline-none focus:border-[#c7a1f7]" onChange={e=>setUser({...user, name: e.target.value})} />
                <input placeholder="Kód tímu" className="bg-white/10 p-5 rounded-2xl border border-white/10 outline-none uppercase" onChange={e=>setUser({...user, code: e.target.value.toUpperCase()})} />
                <select className="bg-[#2a2448] p-5 rounded-2xl border border-white/10" onChange={e=>setUser({...user, context: e.target.value})}>
                  <option value="">Zvoľte kontext (Práca / Súkromie)...</option>
                  <option value="Work">Pracovné prostredie</option>
                  <option value="Personal">Súkromný život</option>
                </select>
              </div>
              <button disabled={!user.name || !user.code || !user.context} className="w-full bg-[#c7a1f7] text-[#1e1a34] font-black p-5 rounded-full disabled:opacity-10 transition-all uppercase" onClick={()=>setStep(2)}>Začať analýzu</button>
            </motion.div>
          )}

          {/* STEP 2 & 3: SELECTION GRID */}
          {(step === 2 || step === 3) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8">
              <div className="flex justify-between items-center mb-8 bg-white/5 p-6 rounded-3xl">
                <div>
                  <h3 className="text-2xl font-serif">{step === 2 ? 'Hnací motor (+)' : 'Zóna odporu (x)'}</h3>
                  <p className="text-white/40 text-xs">{step === 2 ? 'Vyberte si svojich TOP 7 najprirodzenejších prejavov.' : 'Vyberte si 7 výrokov, ktoré najviac odmietate.'}</p>
                </div>
                <div className="text-3xl font-serif text-[#c7a1f7]">{(step === 2 ? pos : neg).length} <span className="text-sm opacity-20">/ 7</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {FLAT_VALUES.map((item, i) => {
                  const sel = step === 2 ? pos : neg;
                  const active = sel.includes(item.v);
                  return (
                    <button key={i} disabled={sel.length >= 7 && !active} className={`text-left p-5 rounded-2xl border transition-all h-full flex flex-col justify-between ${active ? 'bg-[#c7a1f7] text-[#1e1a34] border-[#c7a1f7] shadow-xl shadow-[#c7a1f7]/20' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                      onClick={() => {
                        const update = active ? sel.filter(v=>v!==item.v) : [...sel, item.v];
                        step === 2 ? setPos(update) : setNeg(update);
                      }}>
                      <span className={`text-[9px] font-black uppercase mb-2 ${active ? 'text-[#1e1a34]/60' : 'text-[#c7a1f7]'}`}>{item.v}</span>
                      <span className="text-xs leading-snug font-medium opacity-90">{step === 2 ? item.pos : item.neg}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-10 flex justify-between">
                <button className="opacity-20 hover:opacity-100" onClick={()=>setStep(step-1)}>Späť</button>
                <button disabled={(step === 2 ? pos : neg).length < 7} className="bg-[#c7a1f7] text-[#1e1a34] font-black py-4 px-12 rounded-full disabled:opacity-10" onClick={step===2 ? ()=>setStep(3) : submitResults}>Pokračovať</button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: INDIVIDUAL REPORT */}
          {step === 4 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-serif mb-2">Váš Hodnotový Profil</h2>
                <p className="text-white/40 uppercase tracking-widest text-[10px]">Vyhodnotenie pre: {user.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Pos Chart */}
                <div className="space-y-6">
                   <h3 className="flex items-center gap-2 text-xl font-serif text-green-400"><CheckCircle2 size={20}/> Hnací motor</h3>
                   {Object.keys(THEORY).map(lvl => {
                     const p = Math.round((posStats[lvl]/7)*100);
                     return (
                       <div key={lvl} className="space-y-1">
                         <div className="flex justify-between text-[10px] font-bold"><span>{lvl}</span><span>{p}%</span></div>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{width:0}} animate={{width:`${p}%`}} className="h-full" style={{background: THEORY[lvl].col}} />
                         </div>
                       </div>
                     )
                   })}
                </div>
                {/* Neg Chart */}
                <div className="space-y-6">
                   <h3 className="flex items-center gap-2 text-xl font-serif text-red-400"><ShieldAlert size={20}/> Zóna odporu</h3>
                   {Object.keys(THEORY).map(lvl => {
                     const p = Math.round((negStats[lvl]/7)*100);
                     return (
                       <div key={lvl} className="space-y-1">
                         <div className="flex justify-between text-[10px] font-bold"><span>{lvl}</span><span>{p}%</span></div>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{width:0}} animate={{width:`${p}%`}} className="h-full opacity-60" style={{background: THEORY[lvl].col}} />
                         </div>
                       </div>
                     )
                   })}
                </div>
              </div>

              {/* Behavior Breakdown */}
              <div className="pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white/5 p-8 rounded-3xl">
                   <h4 className="font-bold text-[#c7a1f7] uppercase text-xs mb-4 tracking-widest">Detailné zloženie vašich hodnôt:</h4>
                   <div className="flex flex-wrap gap-2">
                     {pos.map(v => <span key={v} className="bg-white/5 px-3 py-1 rounded-full text-[10px] border border-white/10">{v}</span>)}
                   </div>
                 </div>
                 <div className="bg-[#c7a1f7]/10 p-8 rounded-3xl border border-[#c7a1f7]/20">
                   <h4 className="font-bold text-[#c7a1f7] uppercase text-xs mb-2 tracking-widest">Dominantná úroveň</h4>
                   {(() => {
                      const dom = Object.keys(posStats).reduce((a,b) => posStats[a] > posStats[b] ? a : b);
                      return (
                        <>
                          <p className="text-xl font-serif mb-2">{THEORY[dom].name}</p>
                          <p className="text-sm opacity-70 leading-relaxed">{THEORY[dom].d}</p>
                        </>
                      )
                   })()}
                 </div>
              </div>

              <button className="w-full bg-white text-[#1e1a34] font-black p-5 rounded-full uppercase tracking-widest text-sm" onClick={fetchTeam}>Zobraziť Tímový Dashboard</button>
            </motion.div>
          )}

          {/* STEP 5: TEAM DASHBOARD */}
          {step === 5 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-12">
               <div className="flex justify-between items-center border-b border-white/10 pb-6">
                 <div>
                    <h2 className="text-3xl font-serif leading-none">Tímový Dashboard</h2>
                    <p className="text-[#c7a1f7] text-xs font-bold uppercase tracking-[0.3em] mt-2">{user.code} • {teamData.length} ČLENOV</p>
                 </div>
                 <BarChart3 size={32} className="text-white/20" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Zloženie tímu (Priemer)</h3>
                    {Object.keys(THEORY).map(lvl => {
                      const totalPossible = teamData.length * 7;
                      const sum = teamData.reduce((acc, curr) => acc + (curr.pos_scores[lvl] || 0), 0);
                      const perc = totalPossible > 0 ? Math.round((sum / totalPossible) * 100) : 0;
                      return (
                        <div key={lvl} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase"><span>{THEORY[lvl].name}</span><span>{perc}%</span></div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{width:0}} animate={{width: `${perc}%`}} className="h-full" style={{background: THEORY[lvl].col}} />
                          </div>
                        </div>
                      )
                    })}
                 </div>

                 <div className="space-y-6 bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-yellow-500" /> Friction Matrix
                    </h3>
                    <div className="space-y-4">
                       <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                          <p className="text-xs font-bold text-orange-500 uppercase mb-1">Výkon vs. Konsenzus</p>
                          <p className="text-[11px] text-white/60 leading-relaxed italic">Riziko, že vysoký tlak na výsledky (Oranžová) narazí na hlbokú potrebu dohody a vzťahov (Zelená).</p>
                       </div>
                       <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                          <p className="text-xs font-bold text-blue-500 uppercase mb-1">Inovácie vs. Pravidlá</p>
                          <p className="text-[11px] text-white/60 leading-relaxed italic">Vysoká Modrá rezistencia v tíme naznačuje alergiu na byrokraciu. Hrozí chaos pri expanzii.</p>
                       </div>
                    </div>
                 </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Kolektívny cloud hodnôt</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(teamData.flatMap(d => d.pos_labels))).map((label, idx) => (
                      <span key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-[#c7a1f7] italic">
                        {label}
                      </span>
                    ))}
                  </div>
               </div>
               <button onClick={()=>location.reload()} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-all underline">← Nový assessment</button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}