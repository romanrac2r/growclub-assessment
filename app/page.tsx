"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users, ShieldAlert, CheckCircle2, Info, AlertTriangle, LayoutDashboard } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const VALUES = {
  POS: [
    { id: 'p1', lvl: 'BLUE', v: 'Poriadok', t: 'Mám rád, keď veci fungujú podľa jasných pravidiel.' },
    { id: 'p2', lvl: 'BLUE', v: 'Stabilita', t: 'Vo svojom živote vyhľadávam predvídateľnosť.' },
    { id: 'p3', lvl: 'ORANGE', v: 'Úspech', t: 'Motivuje ma dosahovanie viditeľných výsledkov.' },
    { id: 'p4', lvl: 'ORANGE', v: 'Logika', t: 'Rozhodujem sa na základe faktov a dát.' },
    { id: 'p5', lvl: 'GREEN', v: 'Harmónia', t: 'Záleží mi na pokojných vzťahoch v tíme.' },
    { id: 'p6', lvl: 'GREEN', v: 'Empatia', t: 'Dokážem sa hlboko vcítiť do prežívania iných.' },
    { id: 'p7', lvl: 'YELLOW', v: 'Synergia', t: 'Fascinuje ma spájanie odlišných myšlienok.' },
    { id: 'p8', lvl: 'YELLOW', v: 'Komplexnosť', t: 'Problémy vnímam z viacerých uhlov naraz.' }
  ],
  NEG: [
    { id: 'n1', lvl: 'BLUE', v: 'Byrokracia', t: 'Odmietam nezmyselnú byrokraciu a pravidlá.' },
    { id: 'n2', lvl: 'ORANGE', v: 'Bezohľadnosť', t: 'Neznášam ničenie zdravia ľudí kvôli zisku.' },
    { id: 'n3', lvl: 'GREEN', v: 'Falošná harmónia', t: 'Neznášam zametanie problémov pod koberec.' },
    { id: 'n4', lvl: 'YELLOW', v: 'Odtrhnutie', t: 'Neznášam stratu zmyslu pre realitu v teóriách.' }
  ]
};

const THEORY: any = {
  BLUE: { name: "MODRÁ: Poriadok", col: "#2563eb" },
  ORANGE: { name: "ORANŽOVÁ: Výkon", col: "#ea580c" },
  GREEN: { name: "ZELENÁ: Vzťahy", col: "#16a34a" },
  YELLOW: { name: "ŽLTÁ: Synergia", col: "#ca8a04" }
};

export default function App() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [ctx, setCtx] = useState('');
  const [pos, setPos] = useState<string[]>([]);
  const [neg, setNeg] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<any[]>([]);

  const submitToDB = async () => {
    const calc = (ids: string[], pool: any[]) => {
      let s: any = { BLUE: 0, ORANGE: 0, GREEN: 0, YELLOW: 0 };
      ids.forEach(id => {
        const item = pool.find(i => i.id === id);
        if (item) s[item.lvl]++;
      });
      return s;
    };

    await supabase.from('teams').upsert({ team_code: code });
    await supabase.from('assessments').insert({
      team_code: code,
      user_name: name,
      context: ctx,
      pos_scores: calc(pos, VALUES.POS),
      neg_scores: calc(neg, VALUES.NEG),
      pos_labels: pos.map(id => VALUES.POS.find(v => v.id === id)?.v),
      neg_labels: neg.map(id => VALUES.NEG.find(v => v.id === id)?.v)
    });
    setStep(4);
  };

  useEffect(() => {
    if (step === 5 && code) {
      const fetchTeam = async () => {
        // TOTO JE OPRAVENÁ ČASŤ (.select().eq() namiesto .where())
        const { data } = await supabase
          .from('assessments')
          .select('*')
          .eq('team_code', code);
        if (data) setTeamData(data);
      };
      fetchTeam();
    }
  }, [step, code]);

  return (
    <div className="min-h-screen bg-[#1e1a34] text-white p-6 font-sans">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="font-serif text-4xl mb-2 tracking-tighter text-white">FORBES <span className="text-[#c7a1f7]">GROWCLUB</span></h1>
        <p className="text-[#c7a1f7]/60 uppercase tracking-[0.3em] text-[10px] font-bold">Values Assessment</p>
      </header>

      <main className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-serif">Kto ste a kde sa nachádzate?</h2>
              <input placeholder="Meno" className="w-full bg-white/10 p-4 rounded-xl border border-white/20 outline-none" onChange={e => setName(e.target.value)} />
              <input placeholder="Kód tímu" className="w-full bg-white/10 p-4 rounded-xl border border-white/20 outline-none" onChange={e => setCode(e.target.value.toUpperCase())} />
              <select className="w-full bg-[#1e1a34] p-4 rounded-xl border border-white/20 outline-none" onChange={e => setCtx(e.target.value)}>
                <option value="">Kontext...</option>
                <option value="Praca">Práca</option>
                <option value="Sukromie">Súkromie</option>
              </select>
              <button disabled={!name || !code || !ctx} className="w-full bg-[#c7a1f7] text-[#1e1a34] font-bold p-4 rounded-full disabled:opacity-20 transition-all" onClick={() => setStep(2)}>ZAČAŤ</button>
            </motion.div>
          )}

          {(step === 2 || step === 3) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-xl font-serif mb-6">{step === 2 ? 'Fáza 1: Hnací motor (+)' : 'Fáza 2: Zóna odporu (x)'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {(step === 2 ? VALUES.POS : VALUES.NEG).map(item => {
                  const sel = step === 2 ? pos : neg;
                  const isSelected = sel.includes(item.id);
                  return (
                    <button key={item.id} className={`text-left p-4 rounded-xl border-2 transition-all ${isSelected ? 'bg-[#c7a1f7] text-[#1e1a34] border-[#c7a1f7]' : 'bg-white/5 border-white/10'}`}
                      onClick={() => {
                        const update = isSelected ? sel.filter(id => id !== item.id) : (sel.length < 7 ? [...sel, item.id] : sel);
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

          {step === 4 && (
            <div className="text-center py-10 space-y-6">
              <CheckCircle2 size={60} className="mx-auto text-[#c7a1f7]" />
              <h2 className="text-3xl font-serif">Hotovo!</h2>
              <button className="w-full bg-[#c7a1f7] text-[#1e1a34] font-bold p-4 rounded-full" onClick={() => setStep(5)}>DASHBOARD TÍMU</button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-serif">Tím: {code}</h2>
              <div className="space-y-6">
                {Object.keys(THEORY).map(lvl => {
                  const total = teamData.length * 7;
                  const sum = teamData.reduce((acc, curr) => acc + (curr.pos_scores[lvl] || 0), 0);
                  const perc = total > 0 ? Math.round((sum / total) * 100) : 0;
                  return (
                    <div key={lvl}>
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                        <span>{THEORY[lvl].name}</span>
                        <span>{perc}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${perc}%` }} className="h-full" style={{ background: THEORY[lvl].col }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-sm font-bold uppercase mb-4 text-white/40 tracking-widest">Hodnoty v tíme</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(teamData.flatMap(d => d.pos_labels))).map((l, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-[#c7a1f7]">{l}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => location.reload()} className="text-xs text-white/20 underline">Späť na začiatok</button>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}