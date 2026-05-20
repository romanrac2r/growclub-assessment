"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users, User, ShieldAlert, Activity, LayoutDashboard, CheckCircle2, Info } from 'lucide-react';

// INICIALIZÁCIA SUPABASE
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// DÁTA ZO SCREENSHOTOV (Ukážka - doplň zvyšných 50 hodnôt podľa PDF)
const VALUES = {
  POS: [
    { id: 'p1', lvl: 'BLUE', v: 'Poriadok', t: 'Mám rád, keď veci fungujú podľa jasných pravidiel a zabehnutých postupov.' },
    { id: 'p2', lvl: 'BLUE', v: 'Stabilita', t: 'Vo svojom živote vyhľadávam predvídateľnosť a robím všetko pre ochranu pred chaosom.' },
    { id: 'p3', lvl: 'ORANGE', v: 'Úspech', t: 'Motivuje ma dosahovanie viditeľných výsledkov a prekonávanie cieľov.' },
    { id: 'p4', lvl: 'ORANGE', v: 'Logika', t: 'Pri rozhodovaní sa riadim výlučne chladnými faktami a racionálnym úsudkom.' },
    { id: 'p5', lvl: 'GREEN', v: 'Harmónia', t: 'Záleží mi na pokojných vzťahoch a prirodzene pôsobím ako mediátor.' },
    { id: 'p6', lvl: 'GREEN', v: 'Spravodlivosť', t: 'Citlivo vnímam potreby znevýhodnených a snažím sa o férové šance.' },
    { id: 'p7', lvl: 'YELLOW', v: 'Synergia', t: 'Fascinuje ma spájanie odlišných myšlienok do nových celkov.' },
    { id: 'p8', lvl: 'YELLOW', v: 'Komplexnosť', t: 'Problémy vnímam z viacerých uhlov naraz - psychologicky aj prakticky.' }
  ],
  NEG: [
    { id: 'n1', lvl: 'BLUE', v: 'Byrokracia', t: 'Odmietam nezmyselnú byrokraciu, ktorá paralyzuje firmu a zabíja zmysel.' },
    { id: 'n2', lvl: 'BLUE', v: 'Moralizovanie', t: 'Neznášam farizejstvo a verejné pranierovanie za triviálne chyby.' },
    { id: 'n3', lvl: 'ORANGE', v: 'Bezohľadnosť', t: 'Odmietam ničenie zdravia ľudí kvôli krátkodobému finančnému zisku.' },
    { id: 'n4', lvl: 'ORANGE', v: 'Narcizmus', t: 'Irituje ma čistý narcizmus a monopoly na pozornosť.' },
    { id: 'n5', lvl: 'GREEN', v: 'Falošná harmónia', t: 'Neznášam zametanie problémov pod koberec kvôli strachu z konfliktu.' },
    { id: 'n6', lvl: 'GREEN', v: 'Strata hraníc', t: 'Prekáža mi nútené zdieľanie intimity a tráum na poradách.' },
    { id: 'n7', lvl: 'YELLOW', v: 'Teoretizovanie', t: 'Neznášam stratu zmyslu pre realitu v nekonečných akademických teóriách.' },
    { id: 'n8', lvl: 'YELLOW', v: 'Elitárstvo', t: 'Prekáža mi arogantné opovrhovanie operatívou v mene vyšších systémov.' }
  ]
};

export default function App() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [ctx, setCtx] = useState('');
  const [pos, setPos] = useState<string[]>([]);
  const [neg, setNeg] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<any[]>([]);

  // 1. Uloženie do DB
  const submitToDB = async () => {
    const calc = (ids: string[], pool: any[]) => {
      let s = { BLUE:0, ORANGE:0, GREEN:0, YELLOW:0 };
      ids.forEach(id => {
        const item = pool.find(i => i.id === id);
        if(item) s[item.lvl as keyof typeof s]++;
      });
      return s;
    };

    const pScores = calc(pos, VALUES.POS);
    const nScores = calc(neg, VALUES.NEG);

    // Ak tím neexistuje, vytvoríme ho
    await supabase.from('teams').upsert({ team_code: code }).select();

    // Uložíme výsledok
    await supabase.from('assessments').insert({
      team_code: code,
      user_name: name,
      context: ctx,
      pos_scores: pScores,
      neg_scores: nScores,
      pos_labels: pos.map(id => VALUES.POS.find(v=>v.id===id)?.v),
      neg_labels: neg.map(id => VALUES.NEG.find(v=>v.id===id)?.v)
    });

    setStep(4);
  };

  // 2. Načítanie tímu
  useEffect(() => {
    if (step === 5 && code) {
      const fetchTeam = async () => {
        const { data } = await supabase.from('assessments').where('team_code', 'eq', code).select('*');
        if (data) setTeamData(data);
      };
      fetchTeam();
    }
  }, [step, code]);

  return (
    <div className="min-h-screen bg-[#1e1a34] text-white p-6 md:p-12 font-sans">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="font-serif text-4xl mb-2 tracking-tighter">FORBES <span className="text-[#c7a1f7]">GROWCLUB</span></h1>
        <p className="text-[#c7a1f7]/60 uppercase tracking-[0.3em] text-xs font-bold">Values Assessment Engine</p>
      </header>

      <main className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: ONBOARDING */}
          {step === 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
              <h2 className="text-3xl font-serif">Nastavenie kontextu</h2>
              <div className="space-y-4">
                <input placeholder="Vaše meno" className="w-full bg-white/10 p-4 rounded-xl border border-white/20 focus:border-[#c7a1f7] outline-none" onChange={e=>setName(e.target.value)} />
                <input placeholder="Kód tímu (6 znakov)" className="w-full bg-white/10 p-4 rounded-xl border border-white/20" onChange={e=>setCode(e.target.value.toUpperCase())} maxLength={6} />
                <select className="w-full bg-[#1e1a34] p-4 rounded-xl border border-white/20" onChange={e=>setCtx(e.target.value)}>
                  <option value="">Vyberte prostredie...</option>
                  <option value="Práca">Práca / GrowClub</option>
                  <option value="Súkromie">Súkromný život</option>
                </select>
              </div>
              <div className="p-4 bg-[#c7a1f7]/10 border border-[#c7a1f7]/30 rounded-xl italic text-sm text-[#c7a1f7]">
                "Naše hodnoty sa dynamicky menia podľa prostredia. Držte sa jedného nastavenia."
              </div>
              <button disabled={!name || !code || !ctx} className="w-full bg-[#c7a1f7] text-[#1e1a34] font-bold p-4 rounded-full disabled:opacity-20" onClick={()=>setStep(2)}>ZAČAŤ ANALÝZU</button>
            </motion.div>
          )}

          {/* STEP 2 & 3: FORCED CHOICE SELECTION */}
          {(step === 2 || step === 3) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}}>
               <h3 className="text-2xl font-serif mb-2">{step === 2 ? 'Fáza 1: Hnací motor' : 'Fáza 2: Zóna odporu'}</h3>
               <p className="text-white/40 mb-6 text-sm">{step === 2 ? 'Čo vás poháňa?' : 'Čo vás irituje?'}</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                 {(step === 2 ? VALUES.POS : VALUES.NEG).map(item => {
                   const sel = step === 2 ? pos : neg;
                   const isSelected = sel.includes(item.id);
                   return (
                     <button key={item.id} className={`text-left p-4 rounded-xl border-2 transition-all ${isSelected ? 'bg-[#c7a1f7] text-[#1e1a34] border-[#c7a1f7]' : 'bg-white/5 border-white/10 hover:border-[#c7a1f7]/50'}`}
                        onClick={() => {
                          const update = isSelected ? sel.filter(id=>id!==item.id) : (sel.length < 7 ? [...sel, item.id] : sel);
                          step === 2 ? setPos(update) : setNeg(update);
                        }}>
                       <span className="text-[10px] font-black uppercase text-[#c7a1f7] block mb-1">{item.v}</span>
                       <span className="text-sm font-medium">{item.t}</span>
                     </button>
                   );
                 })}
               </div>
               <div className="flex justify-between items-center">
                  <span className="font-bold text-[#c7a1f7]">{(step === 2 ? pos : neg).length} / 7</span>
                  <button disabled={(step === 2 ? pos : neg).length < 4} className="bg-[#c7a1f7] text-[#1e1a34] font-bold py-3 px-8 rounded-full" 
                          onClick={step === 2 ? () => setStep(3) : submitToDB}>DALEJ</button>
               </div>
            </motion.div>
          )}

          {/* STEP 4: RESULTS */}
          {step === 4 && (
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-serif">Analýza dokončená!</h2>
              <p className="text-white/60">Dáta boli uložené do databázy vášho tímu <strong>{code}</strong>.</p>
              <button className="w-full bg-[#c7a1f7] text-[#1e1a34] font-bold p-4 rounded-full" onClick={()=>setStep(5)}>ZOBRAZIŤ TÍMOVÝ DASHBOARD</button>
            </div>
          )}

          {/* STEP 5: TEAM DASHBOARD (Simplified) */}
          {step === 5 && (
            <div className="space-y-8">
               <h2 className="text-3xl font-serif">Tímový Dashboard: {code}</h2>
               <div className="bg-[#c7a1f7]/10 p-4 border border-[#c7a1f7]/30 rounded-xl text-xs italic">
                  "Trenie v tíme vzniká stretom odlišných pohľadov na to, čo je dôležité."
               </div>
               {/* Tu by bola logika pre Friction Matrix s dátami z teamData */}
               <div className="p-10 text-center border border-dashed border-white/20 rounded-xl">
                  Práve sa analyzujú dáta pre {teamData.length} členov...
               </div>
               <button onClick={()=>location.reload()} className="text-sm underline text-white/40">Späť na začiatok</button>
            </div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}