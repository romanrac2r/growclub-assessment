"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Users, ShieldAlert, CheckCircle2, Info, 
  AlertTriangle, LayoutDashboard, User, BarChart3, ArrowRight, Search
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- KOMPLETNÁ DATABÁZA ZO VŠETKÝCH PDF ---
const VALUES_DB: any = {
  BLUE: [
    { v: "Poriadok", pos: "Mám rád, keď veci fungujú podľa jasných pravidiel a zabehnutých postupov.", neg: "Vytvára paralyzujúcu byrokraciu a strach z odchýlok." },
    { v: "Stabilita", pos: "Vyhľadávam predvídateľnosť a chránim seba aj tím pred chaosom.", neg: "Zamŕza v status quo a dogmaticky blokuje inovácie." },
    { v: "Morálka", pos: "Zásadne dodržiavam sľuby a konám čestne aj bez osobných výhod.", neg: "Povýšenecké moralizovanie a farizejstvo." },
    { v: "Disciplína", pos: "Mám silnú sebadisciplínu; vyžadujem dodržiavanie dohôd u seba aj iných.", neg: "Toxický mikromanažment a kultúra strachu." },
    { v: "Presnosť", pos: "Potrpím si na presné detaily a bezchybnosť v práci aj doma.", neg: "Analysis paralysis – utápanie sa v detailoch." },
    { v: "Štruktúra", pos: "Potrebujem jasné rozdelenie úloh, aby každý vedel, za čo nesie zodpovednosť.", neg: "Vytváranie nepriechodných izolovaných oddelení (silos)." },
    { v: "Lojálnosť", pos: "Som verný rodine aj firme; v krízach ich vždy chránim.", neg: "Vyžadovanie slepej poslušnosti, kritiku berie ako zradu." },
    { v: "Pracovitosť", pos: "Verím v poctivú tvrdú prácu a idem ostatným osobným príkladom.", neg: "Glorifikácia workoholizmu a vyčerpania." },
    { v: "Plnenie povinností", pos: "K záväzkom pristupujem s maximálnou vážnosťou a spoľahlivosťou.", neg: "Úzkoprsý alibizmus na štýl 'to nie je moja práca'." },
    { v: "Skromnosť", pos: "Úspechy radšej pripisujem spoločnému úsiliu než len sebe samému.", neg: "Falošná skromnosť prechádzajúca do mučeníctva." }
  ],
  ORANGE: [
    { v: "Logika", pos: "Rozhodujem sa výlučne na základe faktov, dát a racionálneho úsudku.", neg: "Chladná slepota voči ľudskej psychológii a emóciám." },
    { v: "Úspech", pos: "Motivuje ma dosahovanie výsledkov a prekonávanie ambicióznych cieľov.", neg: "Princíp 'účel svätí prostriedky' na úkor zdravia ľudí." },
    { v: "Jasné ciele", pos: "Svoj život riadim podľa presne merateľných metrík a ukazovateľov.", neg: "Stanovovanie nesplniteľných a stresujúcich cieľov." },
    { v: "Ambicióznosť", pos: "Neuspokojím sa s priemerom, chcem neustále osobnostne aj kariérne rásť.", neg: "Narcistická chamtivosť a ignorancia reálnych kapacít." },
    { v: "Zvedavosť", pos: "Rád objavujem nové technológie a trendy pre vyššiu efektivitu.", neg: "Syndróm blýskavých objektov – skákanie od trendu k trendu." },
    { v: "Kreativita", pos: "Baví ma prichádzať s inovatívnymi nápadmi a nebojím sa testovať nové veci.", neg: "Neukotvené snívanie a odmietanie prevádzkovej reality." },
    { v: "Optimizmus", pos: "V náročných situáciách zachovávam neoblomnú vieru v úspešný koniec.", neg: "Toxická pozitivita – zakazovanie pomenovať reálne hrozby." },
    { v: "Profesionalita", pos: "Zakladám si na špičkovej kvalite práce a vecnej asertívnej komunikácii.", neg: "Budovanie odstupu cez korporátny žargón bez ľudskosti." },
    { v: "Dokonalosť", pos: "Neustále hľadám spôsoby ako optimalizovať svoje zvyky pre excelentnosť.", neg: "Paralyzujúci perfekcionizmus, ktorý zdržuje projekty." },
    { v: "Prosperita", pos: "Dôležité je budovať materiálne zázemie a stabilný finančný rast.", neg: "Agresívne osekávanie nákladov pre krátkodobé dividendy." },
    { v: "Peniaze", pos: "Vnímam ich ako objektívne meradlo môjho úspechu a pridanej hodnoty.", neg: "Zneužívanie peňazí ako nástroja moci, korupcie a vydierania." },
    { v: "Nezávislosť", pos: "Najlepšie fungujem s plnou autonómiou a voľnosťou v rozhodovaní.", neg: "Extrémny individualizmus prechádzajúci do izolácie." },
    { v: "Seba-vyjadrenie", pos: "Rád prezentujem svoje schopnosti, budujem si meno a som jedinečný.", neg: "Narcistická exhibícia a privlastňovanie si zásluh tímu." }
  ],
  GREEN: [
    { v: "Harmónia", pos: "Záleží mi na pokojných vzťahoch a prirodzene pôsobím ako mediátor.", neg: "Strach z konfliktu a zametanie toxicity pod koberec." },
    { v: "Súdržnosť", pos: "Robím všetko pre to, aby rodina a tím držali pevne pokope.", neg: "Groupthink – pasívne-agresívne trestanie iného názoru." },
    { v: "Spravodlivosť", pos: "Citlivo vnímam potreby znevýhodnených a dbám na férové šance.", neg: "Uplatňovanie kolektívnej viny a rovnostárskej utópie." },
    { v: "Rovnosť", pos: "Ku každému pristupujem s rovnakou úctou bez ohľadu na status.", neg: "Popieranie hierarchie kompetencií, chaos v riadení." },
    { v: "Konsenzus", pos: "Nerád vnucujem riešenia, hľadám trpezlivú zhodu s väčšinou.", neg: "Kríza rozhodovania – neschopnosť urobiť krok bez každého." },
    { v: "Spolupatričnosť", pos: "Vytváram prostredie, kde ľudia môžu byť stopercentne sami sebou.", neg: "Vytváranie nezdravej emocionálnej závislosti na firme." },
    { v: "Solidarita", pos: "Cítim prirodzenú zodpovednosť nezištne pomáhať ľuďom v núdzi.", neg: "Agresívne a povinné 'dobro' pod sociálnym nátlakom." },
    { v: "Šťastie", pos: "Osobná pohoda a duševné zdravie sú viac než status či zisk.", neg: "Tyrania falošného šťastia; zakazovanie prejavov frustrácie." },
    { v: "Mindfulness", pos: "Vážim si prítomný okamih a venujem ľuďom svoju plnú pozornosť.", neg: "Únik do pseudo-spirituality pre neschopnosť riadiť firmu." },
    { v: "Rešpekt", pos: "Oceňujem rozmanitosť životných štýlov a nikoho nesúdim.", neg: "Vylučovanie kohokoľvek, kto položí racionálnu otázku." },
    { v: "Zdieľanie", pos: "Verím v otvorenosť; rád zdieľam vedomosti aj vlastné emócie.", neg: "Strata profesionálnych hraníc a nútená intimita na mítingoch." },
    { v: "Podpora", pos: "Vnímam sa ako človek, ktorý aktívne pomáha ostatným rásť.", neg: "Helikoptérový manažér – hasenie problémov za iných." },
    { v: "Férovosť", pos: "Záleží mi na transparentnom delení zdrojov bez uprednostňovania.", neg: "Dogmatický purizmus znemožňujúci logické výnimky." },
    { v: "Empatia", pos: "Dokážem sa hlboko vcítiť do prežívania iných a prispôsobiť sa.", neg: "Slepá submisivita zo strachu pred zranením citov iných." },
    { v: "Spolupráca", pos: "Oveľa radšej pracujem v skupine na spoločnom cieli než sám.", neg: "Rozmazanie individuálnej zodpovednosti a alibizmus." },
    { v: "Tolerancia", pos: "Vytváram prostredie odolné voči predsudkom a vítam diverzitu.", neg: "Tolerovanie flákačov na úkor výkonných a slušných ľudí." },
    { v: "Pokora", pos: "Priznávam vlastné chyby a úctivo počúvam názory expertov.", neg: "Slabosť a neustále znižovanie vlastnej autority v kríze." },
    { v: "Zhoda", pos: "Moje konanie smeruje k spájaniu ľudí a hľadaniu prienikov.", neg: "Mníchovská ústupčivosť; zrada stratégie kvôli krikľúňom." },
    { v: "Zábava", pos: "Snažím sa brať život s ľahkosťou; humor je pre mňa nevyhnutnosť.", neg: "Infantilná povinná zábava maskujúca reálne problémy." }
  ],
  YELLOW: [
    { v: "Synergia", pos: "Spájam odlišné myšlienky do celku, ktorý funguje exponenciálne lepšie.", neg: "Umelé prepájanie nesúvisiacich vecí pre ideológiu." },
    { v: "Komplexnosť", pos: "Vnímam situácie z viacerých uhlov naraz – psychologicky aj prakticky.", neg: "Stratenie schopnosti akcie kvôli nekonečným teóriám." },
    { v: "Partnerstvo", pos: "Budujem vzťahy tak, aby profitovali všetky strany aj širší ekosystém.", neg: "Naivné odovzdávanie know-how konkurencii bez boja." },
    { v: "Prepojenosť", pos: "Chápem, ako každý mikro-detail ovplyvňuje veľký globálny obraz.", neg: "Totálne rozptýlenie focusu a strata zamerania na zisk." },
    { v: "Inšpiratívnosť", pos: "Viem podať zložitú víziu jednoducho a nadchnúť okolie pre budúcnosť.", neg: "Arogantný vizionár bez kontaktu s realitou bežných ľudí." },
    { v: "Integrita", pos: "Konám v súlade s vnútorným presvedčením, no viem agilne meniť prístup.", neg: "Puristický extrémizmus odmietajúci pragmatický kompromis." },
    { v: "Majstrovstvo", pos: "Chcem do hĺbky pochopiť ako funguje svet a neustále sa vzdelávam.", neg: "Elitárska veža zo slonoviny opovrhujúca operatívou." },
    { v: "Spontánnosť", pos: "Dokážem okamžite a plynule zmeniť plány podľa vývoja situácie.", neg: "Impulzívne menenie pravidiel hry vedúce k vyhoreniu tímu." },
    { v: "Seba-uvedomovanie", pos: "Dokážem izolovať vlastné ego a vedome prepínať štýl vedenia.", neg: "Narcistické zacyklenie sa vo vlastnej terapii a analýzach." },
    { v: "Zhoda (Rádu)", pos: "Hľadám hlboký spoločný zmysel vecí, s ktorým sa stotožnia všetci.", neg: "Hľadanie vesmírnej harmónie, ktorá paralyzuje dnešné riešenia." }
  ]
};

const FLAT_VALUES = Object.entries(VALUES_DB).flatMap(([lvl, items]: any) => 
  items.map((i: any) => ({ ...i, lvl }))
);

const THEORY: any = {
  BLUE: { name: "MODRÁ: Systém a Poriadok", col: "#2563eb", d: "Vaším motorom je stabilita, morálka a zmysel pre povinnosť. Svet vnímate cez pravidlá, ktoré zabezpečujú bezpečie a predvídateľnosť. Ste pilierom spoľahlivosti v tíme." },
  ORANGE: { name: "ORANŽOVÁ: Výkon a Úspech", col: "#ea580c", d: "Svet je pre vás ihriskom plným príležitostí. Orientujete sa na výsledky, efektivitu a strategické myslenie. Ceníte si kompetentnosť, pokrok a merateľný úspech." },
  GREEN: { name: "ZELENÁ: Vzťahy a Komunita", col: "#16a34a", d: "Ľudský faktor je prvoradý. Zameriavate sa na empatiu, inklúziu a súlad v tíme. Veríte, že trvalý úspech je možný len vtedy, ak sú ľudia spokojní a vypočutí." },
  YELLOW: { name: "ŽLTÁ: Synergia a Vízia", col: "#ca8a04", d: "Dokážete integrovať protiklady. Vidíte svet ako komplexný systém. Orientujete sa na funkčnosť, flexibilitu a riešenia bez ega. Ste prirodzeným inovátorom systémov." }
};

export default function App() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState({ name: '', code: '', context: '' });
  const [pos, setPos] = useState<string[]>([]);
  const [neg, setNeg] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const stats = useMemo(() => {
    const calc = (selection: string[]) => {
      let s: any = { BLUE:0, ORANGE:0, GREEN:0, YELLOW:0 };
      selection.forEach(val => {
        const item = FLAT_VALUES.find(i => i.v === val);
        if(item) s[item.lvl]++;
      });
      return s;
    };
    return { pos: calc(pos), neg: calc(neg) };
  }, [pos, neg]);

  const submitResults = async () => {
    setIsLoading(true);
    try {
      await supabase.from('assessments').insert({
        team_code: user.code,
        user_name: user.name,
        context: user.context,
        pos_scores: stats.pos,
        neg_scores: stats.neg,
        pos_labels: pos,
        neg_labels: neg
      });
      setStep(4);
    } catch (e) {
      alert("Chyba pri ukladaní dát.");
    }
    setIsLoading(false);
  };

  const fetchTeamData = async () => {
    const { data } = await supabase.from('assessments').select('*').eq('team_code', user.code);
    if (data) setTeamData(data);
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-[#1e1a34] text-white p-4 md:p-10 font-sans selection:bg-[#c7a1f7] selection:text-[#1e1a34]">
      <header className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="font-serif text-4xl md:text-6xl tracking-tighter">FORBES <span className="text-[#c7a1f7]">GROWCLUB</span></h1>
        <p className="text-[#c7a1f7]/50 uppercase tracking-[0.5em] text-[10px] font-black mt-2 italic">Values & Behavioral Analytics</p>
      </header>

      <main className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
        <AnimatePresence mode="wait">

          {/* STEP 1: PROFIL */}
          {step === 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-8">
              <h2 className="text-3xl font-serif mb-4">Nastavenie Assessmentu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#c7a1f7] tracking-widest ml-1">Vaše Meno</label>
                  <input placeholder="napr. Peter Novák" className="w-full bg-white/10 p-5 rounded-2xl border border-white/10 outline-none focus:border-[#c7a1f7]" onChange={e=>setUser({...user, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-[#c7a1f7] tracking-widest ml-1">Kód Tímu</label>
                  <input placeholder="napr. GROW2024" className="w-full bg-white/10 p-5 rounded-2xl border border-white/10 outline-none uppercase" onChange={e=>setUser({...user, code: e.target.value.toUpperCase()})} />
                </div>
                <div className="space-y-2 col-span-full">
                  <label className="text-[10px] font-bold uppercase text-[#c7a1f7] tracking-widest ml-1">Kontext Hodnotenia</label>
                  <select className="w-full bg-[#2a2448] p-5 rounded-2xl border border-white/10" onChange={e=>setUser({...user, context: e.target.value})}>
                    <option value="">Zvoľte prostredie...</option>
                    <option value="Práca">Pracovné prostredie / Leadership</option>
                    <option value="Súkromie">Súkromný život / Rodina</option>
                  </select>
                </div>
              </div>
              <div className="p-5 bg-[#c7a1f7]/5 border border-[#c7a1f7]/20 rounded-2xl flex gap-4 items-start">
                <Info className="text-[#c7a1f7] shrink-0" size={24} />
                <p className="text-xs text-[#c7a1f7]/80 leading-relaxed">
                  "Upozornenie: Váš výsledok nereprezentuje absolútne schopnosti, ale vašu vnútornú hierarchiu priorít. Zvolený profil ukazuje nastavenie v 'ideálnom dni', skutočnou skúškou hodnôt je stres."
                </p>
              </div>
              <button disabled={!user.name || !user.code || !user.context} className="w-full bg-[#c7a1f7] text-[#1e1a34] font-black p-5 rounded-full disabled:opacity-10 transition-all uppercase tracking-widest" onClick={()=>setStep(2)}>Začať analýzu</button>
            </motion.div>
          )}

          {/* STEP 2 & 3: FORCED CHOICE GRID */}
          {(step === 2 || step === 3) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8">
              <div className="flex justify-between items-center mb-8 bg-white/5 p-6 rounded-3xl border border-white/10">
                <div>
                  <h3 className="text-2xl font-serif">{step === 2 ? 'Hnací motor (+)' : 'Zóna odporu (x)'}</h3>
                  <p className="text-white/40 text-xs mt-1">{step === 2 ? 'Vyberte presne TOP 7 prejavov, ktoré sú vám najbližšie.' : 'Vyberte presne TOP 7 prejavov, ktoré najviac odmietate.'}</p>
                </div>
                <div className="text-4xl font-serif text-[#c7a1f7]">{(step === 2 ? pos : neg).length} <span className="text-sm opacity-20">/ 7</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {FLAT_VALUES.map((item: any, i: number) => {
                  const sel = step === 2 ? pos : neg;
                  const active = sel.includes(item.v);
                  return (
                    <button key={i} disabled={sel.length >= 7 && !active} className={`text-left p-6 rounded-2xl border transition-all h-full flex flex-col justify-between min-h-[140px] ${active ? 'bg-[#c7a1f7] text-[#1e1a34] border-[#c7a1f7] shadow-xl shadow-[#c7a1f7]/20' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                      onClick={() => {
                        const update = active ? sel.filter(v=>v!==item.v) : [...sel, item.v];
                        step === 2 ? setPos(update) : setNeg(update);
                      }}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-black uppercase mb-3 tracking-tighter ${active ? 'text-[#1e1a34]/60' : 'text-[#c7a1f7]'}`}>{item.v}</span>
                        {active && <CheckCircle2 size={14} />}
                      </div>
                      <span className="text-[13px] leading-snug font-medium opacity-90">{step === 2 ? item.pos : item.neg}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-12 flex justify-between items-center border-t border-white/10 pt-8">
                <button className="text-white/20 text-xs font-bold uppercase tracking-widest hover:text-white" onClick={()=>setStep(step-1)}>Späť</button>
                <button disabled={(step === 2 ? pos : neg).length < 7 || isLoading} className="bg-[#c7a1f7] text-[#1e1a34] font-black py-4 px-16 rounded-full disabled:opacity-10 transition-all uppercase text-sm tracking-widest" onClick={step===2 ? ()=>setStep(3) : submitResults}>
                  {isLoading ? 'Ukladám...' : 'Pokračovať'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: INDIVIDUÁLNY REPORT */}
          {step === 4 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-16">
              <div className="text-center">
                <h2 className="text-4xl font-serif mb-2 tracking-tight">Váš Hodnotový Profil</h2>
                <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-bold">Vypracované pre: {user.name} • Kontext: {user.context}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="space-y-8">
                   <h3 className="flex items-center gap-3 text-2xl font-serif text-green-400 border-b border-white/10 pb-4"><CheckCircle2 size={24}/> Hnací motor</h3>
                   {Object.keys(THEORY).map(lvl => {
                     const p = Math.round((stats.pos[lvl]/7)*100);
                     return (
                       <div key={lvl} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span>{THEORY[lvl].name}</span><span>{p}%</span></div>
                         <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{width:0}} animate={{width:`${p}%`}} className="h-full" style={{background: THEORY[lvl].col}} />
                         </div>
                       </div>
                     )
                   })}
                </div>
                <div className="space-y-8">
                   <h3 className="flex items-center gap-3 text-2xl font-serif text-red-400 border-b border-white/10 pb-4"><ShieldAlert size={24}/> Zóna odporu</h3>
                   {Object.keys(THEORY).map(lvl => {
                     const p = Math.round((stats.neg[lvl]/7)*100);
                     return (
                       <div key={lvl} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span>{THEORY[lvl].name}</span><span>{p}%</span></div>
                         <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{width:0}} animate={{width:`${p}%`}} className="h-full opacity-60" style={{background: THEORY[lvl].col}} />
                         </div>
                       </div>
                     )
                   })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                 <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                   <h4 className="font-black text-[#c7a1f7] uppercase text-[10px] mb-6 tracking-[0.3em]">Vaša TOP 7 zostava</h4>
                   <div className="flex flex-wrap gap-2">
                     {pos.map(v => <span key={v} className="bg-white/5 px-4 py-2 rounded-full text-xs font-semibold border border-white/10 italic text-white/80">{v}</span>)}
                   </div>
                 </div>
                 <div className="bg-[#c7a1f7]/10 p-10 rounded-[2.5rem] border border-[#c7a1f7]/20 relative overflow-hidden">
                   <div className="absolute top-[-20px] right-[-20px] opacity-10"><BarChart3 size={150} /></div>
                   <h4 className="font-black text-[#c7a1f7] uppercase text-[10px] mb-4 tracking-[0.3em]">Dominantný vMEME systém</h4>
                   {(() => {
                      const dom = Object.keys(stats.pos).reduce((a,b) => stats.pos[a] > stats.pos[b] ? a : b);
                      return (
                        <>
                          <p className="text-2xl font-serif mb-4">{THEORY[dom].name}</p>
                          <p className="text-sm opacity-70 leading-relaxed font-medium">{THEORY[dom].d}</p>
                        </>
                      )
                   })()}
                 </div>
              </div>

              <div className="bg-red-950/20 p-8 rounded-3xl border border-red-500/20 italic text-xs text-white/50 leading-relaxed">
                "Psychológia nás učí, že to, čo na iných najviac odmietame, nám ukazuje naše najcitlivejšie spúšťače (tieň). Ak vás nejaký prístup extrémne irituje, berte to ako pozvánku na zamyslenie sa: Čo sa z tohto iného prístupu môžem konštruktívne naučiť?"
              </div>

              <button className="w-full bg-white text-[#1e1a34] font-black p-6 rounded-full uppercase tracking-widest text-sm hover:bg-[#c7a1f7] transition-all flex justify-center items-center gap-3" onClick={fetchTeamData}>
                Zobraziť Tímový Dashboard <LayoutDashboard size={20} />
              </button>
            </motion.div>
          )}

          {/* STEP 5: TEAM DASHBOARD */}
          {step === 5 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-12">
               <div className="flex justify-between items-center border-b border-white/10 pb-8">
                 <div>
                    <h2 className="text-4xl font-serif tracking-tight leading-none">Tímový Dashboard</h2>
                    <p className="text-[#c7a1f7] text-[10px] font-black uppercase tracking-[0.4em] mt-3">ANALÝZA TÍMU: {user.code} • {teamData.length} ČLENOV</p>
                 </div>
                 <BarChart3 size={40} className="text-white/10" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                 <div className="space-y-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2 italic">Zloženie tímu (Kolektívny priemer)</h3>
                    {Object.keys(THEORY).map(lvl => {
                      const total = teamData.length * 7;
                      const sum = teamData.reduce((acc, curr) => acc + (curr.pos_scores[lvl] || 0), 0);
                      const perc = total > 0 ? Math.round((sum / total) * 100) : 0;
                      return (
                        <div key={lvl} className="space-y-3">
                          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest"><span>{THEORY[lvl].name}</span><span>{perc}%</span></div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{width:0}} animate={{width: `${perc}%`}} className="h-full shadow-lg shadow-[#c7a1f7]/10" style={{background: THEORY[lvl].col}} />
                          </div>
                        </div>
                      )
                    })}
                 </div>

                 <div className="space-y-6 bg-white/5 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden">
                    <div className="absolute top-[-10px] right-[-10px] text-yellow-500 opacity-5"><AlertTriangle size={150} /></div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-4 italic">
                      <AlertTriangle size={14} className="text-yellow-500" /> Friction Matrix (Analýza trenia)
                    </h3>
                    <div className="space-y-5">
                       <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-[2rem]">
                          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Výkon vs. Konsenzus</p>
                          <p className="text-xs text-white/60 leading-relaxed font-medium italic">Vysoký Oranžový priemer v kombinácii so Zelenou rezistenciou naznačuje riziko tlaku na výsledky na úkor tímu.</p>
                       </div>
                       <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-[2rem]">
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Inovácie vs. Poriadok</p>
                          <p className="text-xs text-white/60 leading-relaxed font-medium italic">Modrá rezistencia v tíme signalizuje silnú alergiu na prebytočnú byrokraciu a statické pravidlá.</p>
                       </div>
                    </div>
                 </div>
               </div>

               <div className="space-y-8 pt-10 border-t border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Kolektívny cloud hodnôt tímu</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(teamData.flatMap(d => d.pos_labels))).map((label, idx) => (
                      <span key={idx} className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-[#c7a1f7] italic tracking-tight">
                        #{label}
                      </span>
                    ))}
                  </div>
               </div>
               
               <button onClick={()=>location.reload()} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all underline block mx-auto pt-10">← Začať nový assessment</button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-white/5 text-[9px] font-black uppercase tracking-[1em]">
        FORBES GROWCLUB • SPIRAL DYNAMICS TEAM ENGINE v3.0 • POWERED BY SUPABASE
      </footer>
    </div>
  );
}