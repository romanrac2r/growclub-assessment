"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Users, ShieldAlert, CheckCircle2, Info, 
  AlertTriangle, LayoutDashboard, BarChart3, Mail, Target, 
  UserCheck, EyeOff, Zap, Flame, Search
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- KOMPLETNÁ DATABÁZA HODNÔT (Skrátené "Ja" výroky) ---
const VALUES_DB: any = {
  BLUE: [
    { v: "Poriadok", pos: "Mám rád, keď veci fungujú podľa jasných pravidiel a zabehnutých postupov.", neg: "Odmietam nezmyselnú byrokraciu a procesy bez účelu." },
    { v: "Stabilita", pos: "Vyhľadávam predvídateľnosť a chránim seba aj okolie pred chaosom.", neg: "Prekáža mi zamŕzanie v status quo a blokovanie inovácií." },
    { v: "Morálka", pos: "Konám čestne a dodržiavam sľuby aj bez finančného prospechu.", neg: "Irituje ma povýšenecké moralizovanie a farizejstvo." },
    { v: "Disciplína", pos: "Vyžadujem dôsledné dodržiavanie dohôd u seba aj u iných.", neg: "Neznášam mikromanažment a kultúru všadeprítomného strachu." },
    { v: "Presnosť", pos: "Potrpím si na jasnosť, bezchybnosť a presné detaily.", neg: "Odmietam utápanie sa v detailoch na úkor akcie." },
    { v: "Štruktúra", pos: "Potrebujem systém a jasné rozdelenie zodpovednosti.", neg: "Prekáža mi vytváranie nepriechodných oddelení a informačných bariér." },
    { v: "Lojálnosť", pos: "Som verný tímu a firme; v krízach ich vždy chránim.", neg: "Irituje ma vyžadovanie slepej poslušnosti bez diskusie." },
    { v: "Pracovitosť", pos: "Verím v poctivú prácu a idem ostatným osobným príkladom.", neg: "Odmietam glorifikáciu vyčerpania a workoholizmu ako normy." },
    { v: "Plnenie povinností", pos: "K záväzkom pristupujem s maximálnou vážnosťou a spoľahlivosťou.", neg: "Neznášam alibizmus a prístup 'toto nie je moja práca'." },
    { v: "Skromnosť", pos: "Neprejavujem ego a úspechy pripisujem spoločnému úsiliu.", neg: "Prekáža mi falošná skromnosť prechádzajúca do mučeníctva." }
  ],
  ORANGE: [
    { v: "Logika", pos: "Rozhodujem sa na základe faktov, dát a racionálneho úsudku.", neg: "Odmietam chladné prehliadanie emócií a psychológie tímu." },
    { v: "Úspech", pos: "Motivuje ma dosahovanie viditeľných výsledkov a víťazstvá.", neg: "Irituje ma prístup 'účel svätí prostriedky' na úkor zdravia ľudí." },
    { v: "Jasné ciele", pos: "Riadim sa podľa presne merateľných metrík a viem, kam smerujem.", neg: "Prekáža mi chaotické menenie cieľov a nesplniteľné očakávania." },
    { v: "Ambicióznosť", pos: "Neuspokojím sa s priemerom a hľadám nové príležitosti pre rast.", neg: "Odmietam narcistickú chamtivosť a expanziu bez zdrojov." },
    { v: "Zvedavosť", pos: "Rád objavujem nové technológie a hľadám efektívnejšie cesty.", neg: "Neznášam neustále skákanie z trendu na trend bez doťahovania." },
    { v: "Kreativita", pos: "Baví ma inovatívne myslenie a testovanie nových riešení.", neg: "Prekáža mi generovanie vízií bez ochoty k reálnej exekúcii." },
    { v: "Optimizmus", pos: "V náročných situáciách zachovávam vieru v úspešný koniec.", neg: "Odmietam toxickú pozitivitu a zakazovanie pomenovať riziká." },
    { v: "Profesionalita", pos: "Zakladám si na špičkovej kvalite a vecnej komunikácii.", neg: "Irituje ma budovanie odstupu cez korporátny žargón." },
    { v: "Dokonalosť", pos: "Optimalizujem procesy tak, aby som dosiahol maximálnu efektivitu.", neg: "Neznášam deštruktívny perfekcionizmus, ktorý zdržuje spustenie." },
    { v: "Prosperita", pos: "Dbám na finančný rast a materiálne zázemie pre seba aj tím.", neg: "Odmietam agresívne sekanie nákladov pre krátkodobý zisk lídra." },
    { v: "Peniaze", pos: "Vnímam ich ako objektívne meradlo úspechu a pridanej hodnoty.", neg: "Irituje ma zneužívanie peňazí ako nástroja moci a vydierania." },
    { v: "Nezávislosť", pos: "Najlepšie fungujem s plnou autonómiou a slobodou v rozhodovaní.", neg: "Odmietam budovanie izolovaných impérií v rámci firmy." },
    { v: "Seba-vyjadrenie", pos: "Rád prezentujem svoje meno a budujem si značku cez jedinečnosť.", neg: "Prekáža mi kradnutie nápadov iných a narcistická exhibícia." }
  ],
  GREEN: [
    { v: "Harmónia", pos: "Záleží mi na priateľských vzťahoch a urovnávaní sporov.", neg: "Neznášam zametanie toxicity pod koberec kvôli strachu z konfliktu." },
    { v: "Súdržnosť", pos: "Robím všetko pre to, aby tím držal pokope a každý sa cítil prijatý.", neg: "Odmietam dusivé sektárske prostredie a trestanie iného názoru." },
    { v: "Spravodlivosť", pos: "Citlivo vnímam potreby znevýhodnených a dbám na férové šance.", neg: "Irituje ma kolektívna vina a odmeňovanie najslabších rovnako." },
    { v: "Rovnosť", pos: "Ku každému pristupujem s rovnakou úctou bez ohľadu na status.", neg: "Odmietam popieranie hierarchie kompetencií v odborných témach." },
    { v: "Konsenzus", pos: "Hľadám trpezlivú zhodu s väčšinou pred dôležitým krokom.", neg: "Prekáža mi paralýza, kde sa nespraví nič bez súhlasu každého." },
    { v: "Spolupatričnosť", pos: "Vytváram prostredie, kde ľudia môžu byť sami sebou bez masiek.", neg: "Odmietam emocionálnu manipuláciu cez koncept 'firemnej rodiny'." },
    { v: "Solidarita", pos: "Cítim zodpovednosť nezištne pomáhať kolegom v núdzi.", neg: "Neznášam nátlak na vzdávanie sa voľného času pre 'dobro'." },
    { v: "Šťastie", pos: "Osobná pohoda a duševné zdravie sú pre mňa dôležitejšie ako zisk.", neg: "Irituje ma zakazovanie frustrácie v mene núteného šťastia." },
    { v: "Mindfulness", pos: "Vážim si prítomný okamih a venujem ľuďom plnú pozornosť.", neg: "Odmietam pseudo-spiritualitu na zakrytie neschopnosti riadiť." },
    { v: "Rešpekt", pos: "Oceňujem rozmanitosť a nikoho nesúdim podľa stereotypov.", neg: "Irituje ma, ak sa iný názor vníma ako nedostatok rešpektu." },
    { v: "Zdieľanie", pos: "Verím v otvorenosť a rád zdieľam vedomosti aj emócie.", neg: "Odmietam stratu hraníc a nútenú intimitu na poradách." },
    { v: "Podpora", pos: "Vnímam sa ako človek, ktorý aktívne pomáha ostatným rásť.", neg: "Neznášam helikoptérový manažment a hasenie problémov za iných." },
    { v: "Férovosť", pos: "Záleží mi na transparentnom delení zdrojov bez uprednostňovania.", neg: "Odmietam dogmatický purizmus znemožňujúci ľudskú výnimku." },
    { v: "Empatia", pos: "Dokážem sa hlboko vcítiť do prežívania iných a prispôsobiť sa.", neg: "Irituje ma neschopnosť dať kritiku zo strachu pred zranením citov." },
    { v: "Spolupráca", pos: "Oveľa radšej pracujem v skupine na spoločnom cieli než sám.", neg: "Neznášam alibistické schovávanie sa za kolektív pri zlyhaní." },
    { v: "Tolerancia", pos: "Vytváram inkluzívne prostredie odolné voči predsudkom.", neg: "Prekáža mi slabošské tolerovanie flákačov na úkor výkonných." },
    { v: "Pokora", pos: "Priznávam vlastné chyby a úctivo počúvam expertov.", neg: "Odmietam znižovanie autority lídra v čase vážnej krízy." },
    { v: "Zhoda", pos: "Hľadám prieniky a jemné kompromisy bez narušenia vzťahov.", neg: "Irituje ma zrada stratégie kvôli hlučnej menšine sťažovateľov." },
    { v: "Zábava", pos: "Vnášam do práce humor a ľahkosť na uvoľnenie tlaku.", neg: "Odmietam infantilnú povinnú zábavu a trápne hry." }
  ],
  YELLOW: [
    { v: "Synergia", pos: "Prepájam nekompatibilné procesy do exponenciálne lepšieho celku.", neg: "Neznášam umelé tlačenie nesúvisiacich vecí k sebe pre ideológiu." },
    { v: "Komplexnosť", pos: "Vnímam situácie multidimenzionálne – psychologicky aj ekonomicky.", neg: "Prekáža mi strata zmyslu pre akciu v nekonečných teóriách." },
    { v: "Partnerstvo", pos: "Budujem vzťahy tak, aby profitoval celý ekosystém.", neg: "Odmietam naivné odovzdávanie know-how konkurencii bez boja." },
    { v: "Prepojenosť", pos: "Vidím, ako každý mikro-detail ovplyvňuje globálny obraz firmy.", neg: "Irituje ma rozptýlenie zdrojov do irelevantných oblastí bez fokusu." },
    { v: "Inšpiratívnosť", pos: "Viem podať zložitú víziu jednoducho a nadchnúť okolie.", neg: "Odmietam rolu arogantného vizionára bez kontaktu s realitou." },
    { v: "Integrita", pos: "Konám v súlade s vnútorným presvedčením agilne podľa kontextu.", neg: "Neznášam puristický extrémizmus odmietajúci kompromis." },
    { v: "Majstrovstvo", pos: "Som celoživotným študentom princípov a hlbokej práce.", neg: "Irituje ma elitárska pýcha a opovrhovanie operatívou." },
    { v: "Spontánnosť", pos: "Mám agilitu zmeniť plány okamžite podľa situácie na trhu.", neg: "Odmietam impulzívne menenie pravidiel vedúce k vyhoreniu tímu." },
    { v: "Seba-uvedomovanie", pos: "Izolujem vlastné ego a plynulo prepínam štýl vedenia.", neg: "Prekáža mi zacyklenie sa vo vlastnej terapii na úkor riadenia." },
    { v: "Zhoda (Rádu)", pos: "Hľadám hlboký spoločný zmysel, s ktorým sa stotožnia všetci.", neg: "Odmietam hľadanie vesmírnej harmónie, ktorá paralyzuje dnešok." }
  ]
};

const THEORY: any = {
  BLUE: { name: "MODRÁ: Rád a Stabilita", col: "#2563eb" },
  ORANGE: { name: "ORANŽOVÁ: Výkon a Úspech", col: "#ea580c" },
  GREEN: { name: "ZELENÁ: Vzťahy a Harmónia", col: "#16a34a" },
  YELLOW: { name: "ŽLTÁ: Synergia a Systém", col: "#ca8a04" }
};

const FLAT_VALUES = Object.entries(VALUES_DB).flatMap(([lvl, items]: any) => 
  items.map((i: any) => ({ ...i, lvl }))
);

export default function GrowClubDiagnostics() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState({ name: '', code: '', context: '', isPublic: true });
  const [search, setSearch] = useState('');
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

  const internalFrictions = useMemo(() => pos.filter(v => neg.includes(v)), [pos, neg]);

  const filteredValues = FLAT_VALUES.filter(v => v.v.toLowerCase().includes(search.toLowerCase()));

  const submitResults = async () => {
    setIsLoading(true);
    await supabase.from('assessments').insert({
      team_code: user.code,
      user_name: user.isPublic ? user.name : 'Anonymný člen',
      context: user.context,
      pos_scores: stats.pos,
      neg_scores: stats.neg,
      pos_labels: pos,
      neg_labels: neg
    });
    setStep(4);
    setIsLoading(false);
  };

  const fetchTeam = async () => {
    const { data } = await supabase.from('assessments').select('*').eq('team_code', user.code);
    if (data) setTeamData(data);
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-[#0a0817] text-white p-4 md:p-10 font-sans selection:bg-[#c7a1f7] selection:text-[#0a0817]">
      <header className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl tracking-tighter">FORBES <span className="text-[#c7a1f7]">GROWCLUB</span></h1>
        <p className="text-[#c7a1f7]/50 uppercase tracking-[0.4em] text-[9px] font-black mt-2">Team Behavioral Diagnostics v5.0</p>
      </header>

      <main className="max-w-5xl mx-auto bg-[#1e1a34]/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <AnimatePresence mode="wait">

          {/* STEP 1: INITIAL FORM */}
          {step === 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-10">
              <h2 className="text-3xl font-serif">Nastavenie Assessmentu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input placeholder="Vaše Meno" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-[#c7a1f7]" onChange={e=>setUser({...user, name: e.target.value})} />
                <input placeholder="Kód Tímu" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none uppercase" onChange={e=>setUser({...user, code: e.target.value.toUpperCase()})} />
                <select className="w-full bg-[#2a2448] p-5 rounded-2xl border border-white/10" onChange={e=>setUser({...user, context: e.target.value})}>
                  <option value="">Zvoľte kontext...</option>
                  <option value="Práca">Práca / GrowClub</option>
                  <option value="Súkromie">Súkromný život</option>
                </select>
                <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                   {user.isPublic ? <UserCheck className="text-green-400"/> : <EyeOff className="text-white/40"/>}
                   <div className="flex-1 text-left">
                      <p className="text-xs font-bold uppercase tracking-widest">{user.isPublic ? 'Verejné meno' : 'Budem anonymný'}</p>
                   </div>
                   <button onClick={()=>setUser({...user, isPublic: !user.isPublic})} className="text-[10px] bg-[#c7a1f7] text-[#0a0817] px-4 py-2 rounded-full font-black uppercase tracking-widest">Zmeniť</button>
                </div>
              </div>
              <button disabled={!user.name || !user.code || !user.context} className="w-full bg-[#c7a1f7] text-[#0a0817] font-black p-6 rounded-full uppercase tracking-widest" onClick={()=>setStep(2)}>Vstúpiť do analýzy</button>
            </motion.div>
          )}

          {/* SELECTION GRID */}
          {(step === 2 || step === 3) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="text-left">
                  <h3 className="text-2xl font-serif flex items-center gap-3">
                    {step === 2 ? <Zap className="text-green-400" size={24}/> : <ShieldAlert className="text-red-400" size={24}/>}
                    {step === 2 ? 'Fáza 1: Hnací motor' : 'Fáza 2: Zóna odporu'}
                  </h3>
                  <p className="text-white/40 text-xs mt-1 italic">{step === 2 ? 'Vyberte 4 až 7 prejavov, ktoré sú pre vás prirodzené.' : 'Vyberte 4 až 7 prejavov, ktoré vás naozaj vyrušujú.'}</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-4 top-3.5 text-white/20" size={16}/>
                      <input placeholder="Hľadať hodnotu..." className="bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 text-xs outline-none focus:border-[#c7a1f7]" onChange={e=>setSearch(e.target.value)} />
                   </div>
                   <div className="text-4xl font-serif text-[#c7a1f7]">{(step === 2 ? pos : neg).length} <span className="text-sm opacity-20">/ 7</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredValues.map((item: any, i: number) => {
                  const sel = step === 2 ? pos : neg;
                  const active = sel.includes(item.v);
                  return (
                    <button key={i} disabled={sel.length >= 7 && !active} className={`text-left p-6 rounded-3xl border-2 transition-all flex flex-col justify-between min-h-[140px] ${active ? 'bg-[#c7a1f7] border-[#c7a1f7] text-[#0a0817]' : 'bg-white/5 border-white/10 opacity-90'} ${sel.length >= 7 && !active ? 'opacity-20 grayscale' : ''}`}
                      onClick={() => {
                        const update = active ? sel.filter(v=>v!==item.v) : [...sel, item.v];
                        step === 2 ? setPos(update) : setNeg(update);
                      }}>
                      <span className={`text-[10px] font-black uppercase mb-3 ${active ? 'text-[#0a0817]/60' : 'text-[#c7a1f7]'}`}>{item.v}</span>
                      <span className="text-[13px] font-medium leading-snug">{step === 2 ? item.pos : item.neg}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-between items-center border-t border-white/5 pt-10">
                <button className="text-white/20 text-xs font-black uppercase tracking-widest" onClick={()=>setStep(step-1)}>← Späť</button>
                <button disabled={(step === 2 ? pos : neg).length < 4 || isLoading} className="bg-[#c7a1f7] text-[#0a0817] font-black py-5 px-20 rounded-full uppercase text-sm tracking-widest shadow-xl shadow-[#c7a1f7]/10" onClick={step===2 ? ()=>setStep(3) : submitResults}>Pokračovať</button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: INDIVIDUAL ANALYTICS */}
          {step === 4 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-20">
              <div className="text-center space-y-3">
                <h2 className="text-5xl font-serif tracking-tight">Osobná Diagnostika</h2>
                <div className="flex justify-center gap-3">
                  <span className="bg-[#c7a1f7]/10 px-4 py-1 rounded-full text-[9px] font-black text-[#c7a1f7] uppercase tracking-widest">{user.name}</span>
                  <span className="bg-white/5 px-4 py-1 rounded-full text-[9px] font-black text-white/30 uppercase tracking-widest">{user.context}</span>
                </div>
              </div>

              {/* 2-COLUMN PERCENTAGE CHART */}
              <div className="space-y-10">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/30 text-center italic">Sila vMEME systémov: Hnací motor vs. Zóna odporu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {Object.keys(THEORY).map(lvl => {
                    const pPos = Math.round((stats.pos[lvl]/pos.length)*100) || 0;
                    const pNeg = Math.round((stats.neg[lvl]/neg.length)*100) || 0;
                    return (
                      <div key={lvl} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 text-center space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest" style={{color: THEORY[lvl].col}}>{THEORY[lvl].name}</p>
                        <div className="flex justify-center gap-3 items-end h-32">
                           <div className="w-6 rounded-full transition-all duration-1000 shadow-lg" style={{height: `${pPos}%`, background: THEORY[lvl].col}} title="Motor" />
                           <div className="w-6 rounded-full transition-all duration-1000 opacity-30 shadow-md" style={{height: `${pNeg}%`, background: THEORY[lvl].col}} title="Odpor" />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold opacity-60 px-2 uppercase tracking-tighter">
                           <span>Motor: {pPos}%</span>
                           <span>Odpor: {pNeg}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* BEHAVIORAL BREAKDOWN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 text-left">
                 <div className="space-y-6">
                    <h3 className="text-xl font-serif text-green-400 flex items-center gap-3 border-b border-white/5 pb-4"><Zap size={22}/> Vaše konštruktívne prejavy</h3>
                    {pos.map(v => (
                       <div key={v} className="bg-white/5 p-6 rounded-3xl border-l-4" style={{borderColor: THEORY[FLAT_VALUES.find(i=>i.v===v)?.lvl].col}}>
                          <p className="text-[10px] font-black uppercase opacity-60 mb-1">{v}</p>
                          <p className="text-sm text-white/80 italic leading-snug">{FLAT_VALUES.find(i=>i.v===v)?.pos}</p>
                       </div>
                    ))}
                 </div>
                 <div className="space-y-6">
                    <h3 className="text-xl font-serif text-red-400 flex items-center gap-3 border-b border-white/5 pb-4"><ShieldAlert size={22}/> Vaše deštruktívne alergie</h3>
                    {neg.map(v => (
                       <div key={v} className="bg-white/5 p-6 rounded-3xl border-l-4 opacity-70 border-red-500/50">
                          <p className="text-[10px] font-black uppercase opacity-60 mb-1">{v}</p>
                          <p className="text-sm text-white/60 italic leading-snug">{FLAT_VALUES.find(i=>i.v===v)?.neg}</p>
                       </div>
                    ))}
                 </div>
              </div>

              {/* FRICTION SUMMARY */}
              <div className="bg-[#c7a1f7]/5 p-12 rounded-[3.5rem] border border-[#c7a1f7]/20 relative overflow-hidden text-left">
                <h3 className="text-3xl font-serif text-[#c7a1f7] mb-8 flex items-center gap-4"><AlertTriangle size={32}/> Analýza vnútorného pnutia</h3>
                <div className="space-y-8 relative z-10">
                   {internalFrictions.length > 0 ? (
                      internalFrictions.map(f => (
                        <div key={f} className="bg-[#c7a1f7]/10 p-8 rounded-[2.5rem] border border-[#c7a1f7]/20">
                           <p className="text-lg font-black uppercase text-[#c7a1f7] mb-4">Kritický rozpor: {f}</p>
                           <p className="text-md text-white/80 leading-relaxed italic">
                             "Túto hodnotu milujete v jej konštruktívnom prejave, ale bytostne nenávidíte jej tieň. Toto je váš kritický spúšťač – irituje vás, ak iní v tejto oblasti zlyhávajú, no pod tlakom a stresom hrozí, že do tohto negatívneho tieňa sami nevdojak prepadnete. Tento rozpor vás vnútorne vyrušuje najviac."
                           </p>
                        </div>
                      ))
                   ) : (
                      <p className="text-lg text-white/40 italic">Vaše nastavenie je momentálne zladené a necítite priamy rozpor medzi motorom a odporom.</p>
                   )}
                </div>
              </div>

              <div className="text-center pt-10 border-t border-white/5 space-y-6">
                <p className="text-white/40 text-sm italic max-w-xl mx-auto">Pre detailnejší rozbor vašich výsledkov kontaktujte mentora GrowClubu:</p>
                <div className="flex justify-center items-center gap-4 group">
                   <Mail className="text-[#c7a1f7]" size={24}/>
                   <a href="mailto:roman.rac@growclub.sk" className="text-3xl font-serif hover:text-[#c7a1f7] transition-all border-b-2 border-[#c7a1f7]/30 pb-1">roman.rac@growclub.sk</a>
                </div>
              </div>

              <button className="w-full bg-white text-[#0a0817] font-black p-7 rounded-full uppercase tracking-widest text-sm shadow-2xl hover:bg-[#c7a1f7] transition-all flex justify-center items-center gap-3" onClick={fetchTeam}>
                Zobraziť Tímový Report <LayoutDashboard size={20} />
              </button>
            </motion.div>
          )}

          {/* STEP 5: TEAM ANALYTICS */}
          {step === 5 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-20">
               <div className="flex justify-between items-center border-b border-white/10 pb-10">
                 <div className="text-left space-y-1">
                    <h2 className="text-4xl font-serif">Tímový Dashboard</h2>
                    <p className="text-[#c7a1f7] text-[11px] font-black uppercase tracking-[0.4em]">{user.code} • ANALÝZA {teamData.length} PROFILOV</p>
                 </div>
                 <BarChart3 size={48} className="text-white/5" />
               </div>

               {/* TEAM 2-COLUMN CHART */}
               <div className="space-y-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 text-center italic">Kolektívne ťažisko: Hnací motor vs. Zóna odporu tímu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {Object.keys(THEORY).map(lvl => {
                    const totalPosPossible = teamData.length * 7;
                    const sumPos = teamData.reduce((acc, curr) => acc + (curr.pos_scores[lvl] || 0), 0);
                    const sumNeg = teamData.reduce((acc, curr) => acc + (curr.neg_scores[lvl] || 0), 0);
                    const pPos = Math.round((sumPos / totalPosPossible) * 100) || 0;
                    const pNeg = Math.round((sumNeg / totalPosPossible) * 100) || 0;

                    return (
                      <div key={lvl} className="bg-white/5 p-8 rounded-[3rem] border border-white/10 text-center space-y-6 relative overflow-hidden">
                        <p className="text-[11px] font-black uppercase tracking-widest relative z-10" style={{color: THEORY[lvl].col}}>{THEORY[lvl].name}</p>
                        <div className="flex justify-center gap-4 items-end h-40 relative z-10">
                           <div className="w-8 rounded-full shadow-2xl transition-all duration-1000" style={{height: `${pPos}%`, background: THEORY[lvl].col}} />
                           <div className="w-8 rounded-full shadow-md transition-all duration-1000 opacity-20" style={{height: `${pNeg}%`, background: THEORY[lvl].col}} />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold opacity-60 uppercase relative z-10 px-2 tracking-tighter">
                           <span>Motor: {pPos}%</span>
                           <span>Odpor: {pNeg}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

               {/* TEAM CLASHES */}
               <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden text-left">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-10"><Flame size={16} className="text-orange-500" /> Matica rizík nezvládnutého tlaku</h3>
                  <div className="space-y-8">
                     {(() => {
                        const allPos = teamData.flatMap(d => d.pos_labels);
                        const allNeg = teamData.flatMap(d => d.neg_labels);
                        const clashes = allPos.filter(v => allNeg.includes(v));
                        const uniqueClashes = Array.from(new Set(clashes));

                        return uniqueClashes.length > 0 ? (
                           uniqueClashes.slice(0, 4).map(c => (
                             <div key={c} className="p-8 bg-orange-500/10 border border-orange-500/20 rounded-[2.5rem]">
                                <p className="text-sm font-black text-orange-500 uppercase mb-2">Pnutie v hodnote: {c}</p>
                                <p className="text-[12px] text-white/70 italic font-medium leading-relaxed">
                                  "Zatiaľ čo časť tímu túto hodnotu vníma ako kľúčovú, iná ju označila za vyrušujúcu. Pod tlakom tu vzniká riziko fatálneho nepochopenia. Vyžaduje sa facilitácia prechodu k zrelému využitiu tejto hodnoty bez pádov do tieňa."
                                </p>
                             </div>
                           ))
                        ) : <p className="text-sm text-white/30 italic">Tím je v kľúčových prejavoch nezvyčajne zladený.</p>;
                     })()}
                  </div>
               </div>

               {/* INDIVIDUAL CARDS GRID */}
               <div className="space-y-10 pt-16 border-t border-white/5">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 italic text-center">Profilové ukotvenie členov tímu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                    {teamData.map((member, i) => (
                      <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-[#c7a1f7]/30 transition-all group overflow-hidden relative">
                         <div className="flex justify-between items-center mb-6">
                            <p className="text-md font-serif group-hover:text-[#c7a1f7] transition-colors truncate pr-2">
                               {member.user_name}
                            </p>
                            {member.user_name === 'Anonymný člen' ? <EyeOff size={16} className="text-white/10"/> : <UserCheck size={16} className="text-[#c7a1f7]/40"/>}
                         </div>
                         <div className="space-y-4">
                            {Object.entries(member.pos_scores).map(([k,v]:any) => (
                               v > 0 && (
                                 <div key={k} className="space-y-1">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40"><span>{k[0]}</span><span>{Math.round((v/7)*100)}%</span></div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                       <div className="h-full rounded-full shadow-sm" style={{width: `${(v/7)*100}%`, background: THEORY[k].col}} />
                                    </div>
                                 </div>
                               )
                            ))}
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
               
               <button onClick={()=>location.reload()} className="text-[11px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white transition-all underline block mx-auto pt-20">← Nový assessment</button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-white/5 text-[9px] font-black uppercase tracking-[1.5em]">
        © 2026 FORBES GROWCLUB • SPIRAL DYNAMICS TEAM ENGINE V5.0
      </footer>
    </div>
  );
}