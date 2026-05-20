"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Users, ShieldAlert, CheckCircle2, Info, 
  AlertTriangle, LayoutDashboard, BarChart3, Mail, BookOpen, Target
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const VALUES_DB: any = {
  BLUE: [
    { v: "Poriadok", pos: "Mám rád, keď veci fungujú podľa jasných pravidiel a zmysluplného systému.", neg: "Vytvára paralyzujúcu byrokraciu a strach z akýchkoľvek odchýlok." },
    { v: "Stabilita", pos: "Vyhľadávam predvídateľnosť a chránim seba aj tím pred nečakaným chaosom.", neg: "Zamŕza v status quo a dogmaticky blokuje nevyhnutné inovácie." },
    { v: "Morálka", pos: "Zásadne dodržiavam svoje sľuby a konám čestne aj v situáciách znižujúcich zisk.", neg: "Povýšenecké moralizovanie a verejné pranierovanie iných za prehrešky." },
    { v: "Disciplína", pos: "Vyžadujem zodpovedný prístup k termínom a vysokú mieru sebakontroly.", neg: "Toxický mikromanažment a vytváranie kultúry všadeprítomného strachu." },
    { v: "Presnosť", pos: "Potrpím si na jasnosť a bezchybnosť; dbám na vysoký štandard výstupov.", neg: "Analysis paralysis – utápanie sa v detailoch pri hľadaní utopickej istoty." },
    { v: "Štruktúra", pos: "Potrebujem jasné rozdelenie kompetencií, aby nedochádzalo k duplicite práce.", neg: "Vytváranie nepriechodných izolovaných oddelení (silos) bez komunikácie." },
    { v: "Lojálnosť", pos: "Stojím za svojím tímom v krízach a budujem pocit bezpečia a dôvery.", neg: "Vyžadovanie slepej poslušnosti; kritiku vníma ako osobnú zradu." },
    { v: "Pracovitosť", pos: "Verím v poctivú prácu, idem príkladom a oceňujem vytrvalosť.", neg: "Glorifikácia vyčerpania a workoholizmu ako jedinej normy hodnoty." },
    { v: "Plnenie povinností", pos: "K záväzkom pristupujem s maximálnou vážnosťou a spoľahlivo ich doručím.", neg: "Úzkoprsý alibizmus založený na vete 'to nie je v mojej pracovnej náplni'." },
    { v: "Skromnosť", pos: "Nepovyšujem svoje ego nad pravidlá a kredit za úspech presúvam na celý tím.", neg: "Umele potláča zaslúžené oslavy úspechu z pozície ublíženého martýra." }
  ],
  ORANGE: [
    { v: "Logika", pos: "Rozhodujem sa výlučne na základe tvrdých dát a racionálneho úsudku.", neg: "Chladná slepota voči ľudskej psychológii a emocionálnym dopadom." },
    { v: "Úspech", pos: "Motivuje ma dosahovanie viditeľných výsledkov a prekonávanie cieľov.", neg: "Princíp 'účel svätí prostriedky' na úkor zdravia a etiky." },
    { v: "Jasné ciele", pos: "Svoj život riadim podľa presne merateľných metrík a vízií.", neg: "Chaotické menenie cieľov alebo nastavovanie nesplniteľných metrík." },
    { v: "Ambicióznosť", pos: "Neuspokojím sa s priemerom; neustále hľadám nové príležitosti pre rast.", neg: "Narcistická chamtivosť a naivná expanzia bez reálnych zdrojov." },
    { v: "Zvedavosť", pos: "Aktívne podporujem výskum a inovácie bez okamžitého tlaku na zisk.", neg: "Syndróm blýskavých objektov – skákanie od trendu k trendu bez doťahovania." },
    { v: "Kreativita", pos: "Budujem bezpečné prostredie pre nápady a zlyhanie vnímam ako učenie.", neg: "Generovanie nesplniteľných vízií a trestanie pragmatických pripomienok." },
    { v: "Optimizmus", pos: "V náročných situáciách zachovávam neoblomnú vieru v úspešný koniec.", neg: "Toxická pozitivita – zakazovanie pomenovať reálne finančné riziká." },
    { v: "Profesionalita", pos: "Reprezentujem firmu na vysokej úrovni cez vecnú asertívnu komunikáciu.", neg: "Budovanie odstupu cez korporátny žargón a odmietanie ľudskosti." },
    { v: "Dokonalosť", pos: "Optimalizujem procesy tak, aby som dosiahol maximálnu možnú efektivitu.", neg: "Paralyzujúci perfekcionizmus, ktorý zdržuje spustenie kvôli detailom." },
    { v: "Prosperita", pos: "Strategicky riadim rast a zabezpečujem férové finančné ohodnotenie tímu.", neg: "Agresívne osekávanie nákladov len pre maximalizáciu krátkodobých ziskov." },
    { v: "Peniaze", pos: "Peniaze vnímam ako transparentný nástroj merania zdravia firmy a úspechu.", neg: "Zneužívanie peňazí ako nástroja moci, korupcie a kupovania si poslušnosti." },
    { v: "Nezávislosť", pos: "Decentralizujem riadenie a plne rešpektujem autonómiu expertov v tíme.", neg: "Extrémny individualizmus; budovanie izolovaných impérií v rámci firmy." },
    { v: "Seba-vyjadrenie", pos: "Podporujem ľudí v budovaní ich osobnej značky a prezentácii unikátnych ideí.", neg: "Čistý narcizmus; kradnutie nápadov iných a monopol na pozornosť." }
  ],
  GREEN: [
    { v: "Harmónia", pos: "Pôsobím ako empatický mediátor predchádzajúci otvoreným konfliktom.", neg: "Strach z konfrontácie vedúci k tolerovaniu toxicity a slabej morálky." },
    { v: "Súdržnosť", pos: "Budujem silnú tímovú identitu a búram zbytočné korporátne bariéry.", neg: "Vytváranie dusivého sektárskeho prostredia a skupinového myslenia." },
    { v: "Spravodlivosť", pos: "Zohľadňujem individuálne potreby a potrebu sociálnej spravodlivosti.", neg: "Presadzovanie absurdity kolektívnej viny; odmeňovanie najslabších rovnako." },
    { v: "Rovnosť", pos: "Ku každému pristupujem s rovnakou úctou bez ohľadu na jeho funkčný status.", neg: "Absolútne popieranie hierarchie kompetencií vedúce k organizačnému chaosu." },
    { v: "Konsenzus", pos: "Zapájam tím do rozhodovania pre hladkú a dobrovoľnú implementáciu zmien.", neg: "Kríza rozhodovania – neschopnosť urobiť krok bez súhlasu úplne každého." },
    { v: "Spolupatričnosť", pos: "Vytváram komunitu, kde sa každý cíti vítaný taký, aký v skutočnosti je.", neg: "Emocionálna manipulácia a vytváranie nezdravej závislosti na 'rodine'." },
    { v: "Solidarita", pos: "Nezištne pomáham kolegom v ťažkej životnej alebo zdravotnej situácii.", neg: "Agresívne 'dobro' – vyvíjanie nátlaku na vzdávanie sa voľného času a odmien." },
    { v: "Šťastie", pos: "Odmietam paradigmu, že výkon je viac ako zdravie; dbám na psychickú pohodu.", neg: "Tyrania falošného šťastia; neprípustnosť prejaviť smútok či frustráciu." },
    { v: "Mindfulness", pos: "Prejavujem plnú, nerušenú prítomnosť a hlboko počúvam potreby iných.", neg: "Únik do pseudo-spirituality a žargónu na zakrytie neschopnosti riadiť." },
    { v: "Rešpekt", pos: "Oceňujem diverzitu skúseností a hodnotím ľudí podľa vnútorného charakteru.", neg: "Rešpekt ako zbraň; vylúčenie každého, kto položí racionálnu kritickú otázku." },
    { v: "Zdieľanie", pos: "Likvidujem informačné monopoly a zavádzam platformy pre voľný tok know-how.", neg: "Brutálna strata hraníc; nútené zdieľanie súkromných tráum pred kolektívom." },
    { v: "Podpora", pos: "Fungujem ako kouč a architekt rastu, ktorý pomáha ľuďom naplniť potenciál.", neg: "Vznik patologickej záchranárskej dynamiky; bránenie ľuďom v dospelom raste." },
    { v: "Férovosť", pos: "Garantujem rovnaké príležitosti a transparentnú distribúciu projektov.", neg: "Bezcitný dogmatizmus zakazujúci urobiť aj logickú ľudskú výnimku." },
    { v: "Empatia", pos: "Mám schopnosť kognitívneho vcítenia sa a prispôsobenia komunikácie.", neg: "Slepá submisivita; neschopnosť dať kritiku zo strachu pred zranením citov." },
    { v: "Spolupráca", pos: "Rozbíjam silá a odmeňujem ľudí za to, ako pomohli uspieť aj iným tímom.", neg: "Totálne rozmazanie individuálnej zodpovednosti a schovávanie sa za kolektív." },
    { v: "Tolerancia", pos: "Vytváram inkluzívne prostredie odolné voči predsudkom akéhokoľvek druhu.", neg: "Demotivujúce tolerovanie chronických flákačov na úkor poctivých ľudí." },
    { v: "Pokora", pos: "Autenticky a otvorene priznávam vlastné manažérske chyby pred celým tímom.", neg: "Trápne znižovanie vlastnej autority; neschopnosť veliť ani v existenčnej kríze." },
    { v: "Zhoda", pos: "Hľadám skutočný prienik obáv a riešení cez vysokú kultúru debaty.", neg: "Mníchovský ústupok; zrada stratégie len pre uspokojenie hlučnej menšiny." },
    { v: "Zábava", pos: "Zavádzam prvky gamifikácie a humoru na uvoľnenie dlhotrvajúceho stresu.", neg: "Organizovanie infantilnej zábavy, ktorá znižuje dôstojnosť profesionálov." }
  ],
  YELLOW: [
    { v: "Synergia", pos: "Prepájam zdanlivo nekompatibilné procesy do exponenciálne výkonného celku.", neg: "Umelé tlačenie do spolupráce projektov, ktoré k sebe logicky nepasujú." },
    { v: "Komplexnosť", pos: "Analyzujem problémy multidimenzionálne a nachádzam systémové páky.", neg: "Stratenie schopnosti akcie kvôli nekonečnému akademickému teoretizovaniu." },
    { v: "Partnerstvo", pos: "Dizajnujem udržateľné stratégie tak, aby profitoval celý širší ekosystém.", neg: "Rezignácia na obranu firmy a naivné odovzdávanie know-how konkurencii." },
    { v: "Prepojenosť", pos: "Výborne chápem dopad lokálnych mikro-krokov na globálnu stratégiu firmy.", neg: "Totálne rozptýlenie focusu a zdrojov do desiatok irelevantných oblastí." },
    { v: "Inšpiratívnosť", pos: "Cez majstrovskú komunikáciu nadchnem okolie pre zložitú víziu budúcnosti.", neg: "Zlyhanie komunikácie; pôsobenie ako odtrhnutý a arogantný vizionár." },
    { v: "Integrita", pos: "Konám v hlbokom súlade s komplexnými etickými a fyzikálnymi zákonmi.", neg: "Puristický extrémizmus; odmietanie nutného pragmatického kompromisu." },
    { v: "Majstrovstvo", pos: "Som celoživotným študentom princípov a uplatňujem koncept hlbokej práce.", neg: "Budovanie elitárskej veže zo slonoviny a opovrhovanie operatívou." },
    { v: "Spontánnosť", pos: "Mám mimoriadnu agilitu pri zmenách na trhu bez straty vnútornej stability.", neg: "Katastrofálny rozklad a chaos spôsobený impulzívnym menením pravidiel." },
    { v: "Seba-uvedomovanie", pos: "Brilantne izolujem vlastné ego a plynulo prepínam štýl vedenia podľa situácie.", neg: "Narcistické zacyklenie sa vo vlastnej terapii a analýzach rán z minulosti." },
    { v: "Zhoda (Rádu)", pos: "Nachádzam hlboký zmysel (purpose), s ktorým sa tím prirodzene stotožní.", neg: "Hľadanie natoľko 'dokonalej' vesmírnej harmónie, že paralyzuje dnešok." }
  ]
};

const THEORY: any = {
  BLUE: { 
    name: "MODRÁ (Tier 1): Rád a Poriadok", 
    col: "#2563eb", 
    d: "Vaším kompasom je stabilita, morálka a zmysel pre povinnosť. Svet vnímate cez pravidlá, ktoré zabezpečujú bezpečie a predvídateľnosť. V tíme ste pilierom spoľahlivosti, no dajte si pozor, aby ste sa nestali väzňom vlastných procesov.",
    f: "Trenie vzniká, ak sa Modrá zložka cíti ohrozená chaosom alebo neetickým správaním (Oranžová skratka)."
  },
  ORANGE: { 
    name: "ORANŽOVÁ (Tier 1): Výkon a Úspech", 
    col: "#ea580c", 
    d: "Svet je pre vás ihriskom plným príležitostí. Orientujete sa na merateľné výsledky, efektivitu a strategické myslenie. Ceníte si kompetentnosť a pokrok. Rizikom je 'tunelové videnie' orientované na zisk, ktoré môže prehliadať ľudské emócie (Zelená) alebo dlhodobú stabilitu (Modrá).",
    f: "Konflikt nastáva pri tlaku na rýchle výsledky na úkor času potrebného na budovanie vzťahov (Zelená)."
  },
  GREEN: { 
    name: "ZELENÁ (Tier 1): Vzťahy a Harmónia", 
    col: "#16a34a", 
    d: "Ľudský faktor je pre vás prvoradý. Zameriavate sa na empatiu, inklúziu a súlad v komunite. Veríte, že úspech je výsledkom spokojnosti ľudí. Výzvou je udržať akcieschopnosť a neupadnúť do paralýzy z nekonečného hľadania konsenzu.",
    f: "Trenie zažívate pri konfrontácii s chladnou logikou alebo hierarchickými príkazmi bez diskusie."
  },
  YELLOW: { 
    name: "ŽLTÁ (Tier 2): Systémová Integrácia", 
    col: "#ca8a04", 
    d: "Predstavujete 'monumentálny skok' vo vedomí. Už nebojujete proti iným systémom, ale chápete ich nevyhnutnosť. Vidíte svet ako komplexný systém. Orientujete sa na funkčnosť bez tlaku ega. Dokážete prepínať medzi poriadkom, výkonom a empatiou podľa toho, čo situácia vyžaduje.",
    f: "Pôsobíte arogantne pre ľudí z 1. rádu, ktorí nedokážu uchopiť vašu nelineárnu komplexnosť."
  }
};

const FLAT_VALUES = Object.entries(VALUES_DB).flatMap(([lvl, items]: any) => 
  items.map((i: any) => ({ ...i, lvl }))
);

export default function GrowClubApp() {
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
      alert("Chyba pri ukladaní.");
    }
    setIsLoading(false);
  };

  const fetchTeamData = async () => {
    const { data } = await supabase.from('assessments').select('*').eq('team_code', user.code);
    if (data) setTeamData(data);
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-[#0a0817] text-white p-4 md:p-10 font-sans selection:bg-[#c7a1f7] selection:text-[#0a0817]">
      <header className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="font-serif text-4xl md:text-6xl tracking-tighter">FORBES <span className="text-[#c7a1f7]">GROWCLUB</span></h1>
        <p className="text-[#c7a1f7]/50 uppercase tracking-[0.5em] text-[10px] font-black mt-2 italic">Professional Behavioral Matice v3.2</p>
      </header>

      <main className="max-w-5xl mx-auto bg-[#1e1a34]/60 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <AnimatePresence mode="wait">

          {/* STEP 1: ONBOARDING */}
          {step === 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-serif">Vitajte v hodnotovej diagnostike</h2>
                <p className="text-white/60 leading-relaxed max-w-2xl">
                  Špirálová dynamika (Spiral Dynamics) je evolučný model ľudských hodnôt. Pomáha nám pochopiť, prečo ľudia konajú tak, ako konajú, a kde v tímoch vzniká napätie. 
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-[#c7a1f7] tracking-widest block ml-1">Vaše Meno</label>
                  <input placeholder="napr. Martin" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 focus:border-[#c7a1f7] outline-none transition-all" onChange={e=>setUser({...user, name: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-[#c7a1f7] tracking-widest block ml-1">Kód Tímu (pre zdieľanie)</label>
                  <input placeholder="napr. CEO-TEAM" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 focus:border-[#c7a1f7] outline-none uppercase" onChange={e=>setUser({...user, code: e.target.value.toUpperCase()})} />
                </div>
                <div className="col-span-full space-y-4">
                   <label className="text-[10px] font-black uppercase text-[#c7a1f7] tracking-widest block ml-1">Kontext Hodnotenia</label>
                   <select className="w-full bg-[#2a2448] p-5 rounded-2xl border border-white/10 outline-none cursor-pointer" onChange={e=>setUser({...user, context: e.target.value})}>
                    <option value="">Zvoľte prostredie...</option>
                    <option value="Práca">Pracovné prostredie / Leadership</option>
                    <option value="Súkromie">Súkromný život / Rodina</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-[#c7a1f7]/5 border border-[#c7a1f7]/20 rounded-3xl flex gap-5 items-center italic">
                <Info className="text-[#c7a1f7] shrink-0" size={30} />
                <p className="text-sm text-white/70">
                  "Naše hodnoty sú adaptáciou na životné podmienky. V práci môžete fungovať z Oranžového výkonu, no doma zo Zelenej harmónie. Vyberte si jeden kontext."
                </p>
              </div>
              <button disabled={!user.name || !user.code || !user.context} className="w-full bg-[#c7a1f7] text-[#1e1a34] font-black p-6 rounded-full disabled:opacity-10 transition-all uppercase tracking-[0.2em] shadow-lg shadow-[#c7a1f7]/20" onClick={()=>setStep(2)}>Začať analýzu</button>
            </motion.div>
          )}

          {/* STEP 2 & 3: FORCED CHOICE GRID */}
          {(step === 2 || step === 3) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10 bg-white/5 p-8 rounded-[2rem] border border-white/5">
                <div className="space-y-1">
                  <h3 className="text-3xl font-serif flex items-center gap-3">
                    {step === 2 ? <Target className="text-green-400" size={24}/> : <ShieldAlert className="text-red-400" size={24}/>}
                    {step === 2 ? 'Fáza 1: Hnací motor' : 'Fáza 2: Zóna odporu'}
                  </h3>
                  <p className="text-white/40 text-xs">
                    {step === 2 ? 'Vyberte 4 až 7 prejavov, ktoré sú pre vás v tomto prostredí najprirodzenejšie.' : 'Vyberte 4 až 7 výrokov, ktoré vo vás vyvolávajú silnú nechuť alebo ich odmietate.'}
                  </p>
                </div>
                <div className="text-5xl font-serif text-[#c7a1f7] opacity-80">{(step === 2 ? pos : neg).length} <span className="text-sm opacity-20 uppercase tracking-widest">/ 7</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FLAT_VALUES.map((item: any, i: number) => {
                  const sel = step === 2 ? pos : neg;
                  const active = sel.includes(item.v);
                  const disabled = sel.length >= 7 && !active;
                  return (
                    <button key={i} disabled={disabled} className={`text-left p-6 rounded-3xl border transition-all h-full flex flex-col justify-between min-h-[160px] group ${active ? 'bg-[#c7a1f7] text-[#1e1a34] border-[#c7a1f7] shadow-xl' : 'bg-white/5 border-white/5 hover:border-white/20'} ${disabled ? 'opacity-20 grayscale' : ''}`}
                      onClick={() => {
                        const update = active ? sel.filter(v=>v!==item.v) : [...sel, item.v];
                        step === 2 ? setPos(update) : setNeg(update);
                      }}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-black uppercase mb-4 tracking-tight ${active ? 'text-[#1e1a34]/60' : 'text-[#c7a1f7]'}`}>{item.v}</span>
                        {active && <CheckCircle2 size={16} />}
                      </div>
                      <span className="text-[14px] leading-tight font-medium opacity-95">{step === 2 ? item.pos : item.neg}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-14 flex justify-between items-center border-t border-white/5 pt-10">
                <button className="text-white/30 text-xs font-black uppercase tracking-[0.3em] hover:text-white" onClick={()=>setStep(step-1)}>← Späť</button>
                <button disabled={(step === 2 ? pos : neg).length < 4 || isLoading} className="bg-[#c7a1f7] text-[#1e1a34] font-black py-5 px-20 rounded-full disabled:opacity-10 transition-all uppercase text-sm tracking-widest shadow-xl shadow-[#c7a1f7]/10" onClick={step===2 ? ()=>setStep(3) : submitResults}>
                  {isLoading ? 'Spracúvam...' : 'Pokračovať'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: ENHANCED INDIVIDUAL REPORT */}
          {step === 4 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-serif tracking-tight">Individuálna Analýza Hodnôt</h2>
                <div className="flex justify-center gap-3">
                  <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black text-[#c7a1f7] uppercase tracking-widest">{user.name}</span>
                  <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest">{user.context}</span>
                </div>
              </div>

              {/* Education Intro */}
              <div className="bg-[#c7a1f7]/5 p-10 rounded-[3rem] border border-[#c7a1f7]/10 space-y-6">
                <h3 className="text-xl font-serif flex items-center gap-3 text-[#c7a1f7]"><BookOpen size={22}/> Čo je Špirálová dynamika?</h3>
                <p className="text-sm leading-relaxed text-white/70">
                   Váš výsledok je postavený na teórii prof. Clare W. Gravesa. Táto teória hovorí, že ľudské vedomie sa vyvíja v stupňoch (vMEMEs), ktoré reagujú na zložitosť prostredia. Každá farba predstavuje iný spôsob, ako vnímame 'čo je správne'. Naše hodnoty nie sú vytesané do kameňa – sú mapou nášho ukotvenia v konkrétnom čase a kontexte.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                {/* Drive Section */}
                <div className="space-y-8">
                   <div className="space-y-3">
                      <h3 className="flex items-center gap-3 text-2xl font-serif text-green-400 border-b border-white/5 pb-4"><CheckCircle2 size={24}/> Hnací motor</h3>
                      <p className="text-xs text-white/50 leading-relaxed italic">
                        Tento profil ukazuje vaše nastavenie v 'ideálnom dni'. Definuje, čo vás motivuje k akcii a aké vzorce správania považujete za konštruktívne.
                      </p>
                   </div>
                   {Object.keys(THEORY).map(lvl => {
                     const p = Math.round((stats.pos[lvl]/pos.length)*100);
                     return (
                       <div key={lvl} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]"><span>{THEORY[lvl].name}</span><span>{p}%</span></div>
                         <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{width:0}} animate={{width:`${p}%`}} className="h-full" style={{background: THEORY[lvl].col}} />
                         </div>
                       </div>
                     )
                   })}
                </div>

                {/* Shadow Section */}
                <div className="space-y-8">
                   <div className="space-y-3">
                      <h3 className="flex items-center gap-3 text-2xl font-serif text-red-400 border-b border-white/5 pb-4"><ShieldAlert size={24}/> Zóna odporu</h3>
                      <p className="text-xs text-white/50 leading-relaxed italic">
                        Ukazuje vaše 'citlivé spúšťače'. Psychológia tieňa hovorí, že to, čo na iných najviac odmietame, odhaľuje naše najväčšie body napätia.
                      </p>
                   </div>
                   {Object.keys(THEORY).map(lvl => {
                     const p = Math.round((stats.neg[lvl]/neg.length)*100);
                     return (
                       <div key={lvl} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]"><span>{THEORY[lvl].name}</span><span>{p}%</span></div>
                         <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{width:0}} animate={{width:`${p}%`}} className="h-full opacity-50" style={{background: THEORY[lvl].col}} />
                         </div>
                       </div>
                     )
                   })}
                </div>
              </div>

              {/* Dominant Deep Dive */}
              <div className="pt-10 border-t border-white/5 space-y-10">
                 <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 relative overflow-hidden group">
                   <div className="absolute top-[-30px] right-[-30px] opacity-10 group-hover:scale-110 transition-transform duration-700 text-[#c7a1f7]"><Target size={250} /></div>
                   <h4 className="font-black text-[#c7a1f7] uppercase text-[10px] mb-6 tracking-[0.4em]">Detailná Analýza Dominancie</h4>
                   {(() => {
                      const dom = Object.keys(stats.pos).reduce((a,b) => stats.pos[a] > stats.pos[b] ? a : b);
                      return (
                        <div className="space-y-6 relative z-10">
                          <p className="text-4xl font-serif text-white">{THEORY[dom].name}</p>
                          <p className="text-lg text-white/80 leading-relaxed italic font-medium max-w-3xl">{THEORY[dom].d}</p>
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 max-w-xl">
                             <p className="text-xs font-black uppercase tracking-widest text-[#c7a1f7] mb-3">Dynamika v tíme</p>
                             <p className="text-sm text-white/60 leading-relaxed">{THEORY[dom].f}</p>
                          </div>
                        </div>
                      )
                   })()}
                 </div>

                 {/* Friction Matrix logic check for Individual */}
                 <div className="bg-yellow-950/20 p-10 rounded-[3rem] border border-yellow-500/20 space-y-4">
                    <h4 className="font-black text-yellow-500 uppercase text-[10px] tracking-[0.3em]">Váš osobný Friction Check (Trenie)</h4>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Skutočnou skúškou hodnôt nie je úspech, ale kríza. Ak váš <strong>Hnací motor</strong> obsahuje vysokú mieru výkonu (Oranžová), ale vaša <strong>Zóna odporu</strong> obsahuje poriadok (Modrá), hrozí u vás 'rebelantský' rozklad procesov pri hľadaní výsledkov. Trenie vzniká tam, kde jedna hodnota v stresovej situácii kanibalizuje druhú.
                    </p>
                 </div>
              </div>

              <div className="text-center pt-10 space-y-6 border-t border-white/5">
                <p className="text-white/40 text-sm">Pre detailnejší rozbor vašich výsledkov a analýzu tímovej dynamiky kontaktujte mentora Forbes GrowClub:</p>
                <div className="flex justify-center items-center gap-3 group">
                   <Mail className="text-[#c7a1f7] group-hover:scale-125 transition-transform" size={24}/>
                   <a href="mailto:roman.rac@growclub.sk" className="text-2xl font-serif text-white hover:text-[#c7a1f7] transition-all border-b-2 border-[#c7a1f7]/40 pb-1">roman.rac@growclub.sk</a>
                </div>
              </div>

              <button className="w-full bg-white text-[#1e1a34] font-black p-6 rounded-full uppercase tracking-[0.3em] text-sm hover:bg-[#c7a1f7] transition-all flex justify-center items-center gap-3 shadow-2xl" onClick={fetchTeamData}>
                Zobraziť Tímový Dashboard <LayoutDashboard size={20} />
              </button>
            </motion.div>
          )}

          {/* STEP 5: TEAM DASHBOARD (Simplified) */}
          {step === 5 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-12">
               <div className="flex justify-between items-center border-b border-white/10 pb-8">
                 <div>
                    <h2 className="text-4xl font-serif tracking-tight leading-none">Tímová Dynamika</h2>
                    <p className="text-[#c7a1f7] text-[10px] font-black uppercase tracking-[0.4em] mt-3">{user.code} • ANALÝZA {teamData.length} PROFILOV</p>
                 </div>
                 <BarChart3 size={44} className="text-white/5" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                 <div className="space-y-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Kolektívny priemer (Hnací motor)</h3>
                    {Object.keys(THEORY).map(lvl => {
                      const totalPossible = teamData.length * 7;
                      const sum = teamData.reduce((acc, curr) => acc + (curr.pos_scores[lvl] || 0), 0);
                      const perc = totalPossible > 0 ? Math.round((sum / totalPossible) * 100) : 0;
                      return (
                        <div key={lvl} className="space-y-3">
                          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/80"><span>{THEORY[lvl].name}</span><span>{perc}%</span></div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{width:0}} animate={{width: `${perc}%`}} className="h-full shadow-lg shadow-[#c7a1f7]/10" style={{background: THEORY[lvl].col}} />
                          </div>
                        </div>
                      )
                    })}
                 </div>

                 <div className="space-y-6 bg-white/5 p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden">
                    <div className="absolute top-[-10px] right-[-10px] text-yellow-500 opacity-5"><AlertTriangle size={180} /></div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-6 italic">
                      <AlertTriangle size={14} className="text-yellow-500" /> Friction Matrix (Analýza trenia)
                    </h3>
                    <div className="space-y-6">
                       <div className="p-8 bg-orange-500/10 border border-orange-500/20 rounded-[2.5rem]">
                          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">Výkon vs. Konsenzus (Orange vs Green)</p>
                          <p className="text-xs text-white/60 leading-relaxed font-medium italic">Ak je priemerný hnací motor tímu Oranžový a súčasne existuje silná Zelená rezistencia, hrozí rozpad tímu z vnútra kvôli pocitu bezcitnosti.</p>
                       </div>
                       <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem]">
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Inovácie vs. Poriadok (Orange vs Blue)</p>
                          <p className="text-xs text-white/60 leading-relaxed font-medium italic">Modrá rezistencia v tíme signalizuje alergiu na pravidlá. V čase rastu to môže viesť k nebezpečnému chaosu a strate kontroly nad dátami.</p>
                       </div>
                    </div>
                 </div>
               </div>

               <div className="space-y-8 pt-14 border-t border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Unikátne hodnotové ukotvenia v tíme</h3>
                  <div className="flex flex-wrap gap-3">
                    {Array.from(new Set(teamData.flatMap(d => d.pos_labels))).map((label, idx) => (
                      <span key={idx} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-[#c7a1f7] italic tracking-tight hover:bg-[#c7a1f7]/10 transition-all cursor-default">
                        #{label}
                      </span>
                    ))}
                  </div>
               </div>
               
               <button onClick={()=>location.reload()} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all underline block mx-auto pt-20">← Späť na úvodnú obrazovku</button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-white/5 text-[9px] font-black uppercase tracking-[1em]">
        © 2026 FORBES GROWCLUB • METODOLÓGIA ŠPIRÁLOVEJ DYNAMIKY • POWERED BY SUPABASE
      </footer>
    </div>
  );
}