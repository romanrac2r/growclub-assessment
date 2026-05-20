"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Users, ShieldAlert, CheckCircle2, Info, 
  AlertTriangle, LayoutDashboard, BarChart3, Mail, Target, 
  UserCheck, EyeOff, Zap, Flame, ArrowRightLeft
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- KOMPLETNÁ DATABÁZA ---
const VALUES_DB: any = {
  BLUE: [
    { v: "Poriadok", pos: "Máte radi systém a pokoj, ktorý prinášajú jasné pravidlá.", neg: "Byrokracia: Odmietate procesy, ktoré paralyzujú firmu a strácajú zmysel." },
    { v: "Stabilita", pos: "Vyhľadávate predvídateľnosť a chránite okolie pred chaosom.", neg: "Dogmatizmus: Vyrušuje vás blokovanie inovácií v mene status quo." },
    { v: "Morálka", pos: "Konáte čestne aj v situáciách, kde by skratka priniesla zisk.", neg: "Farizejstvo: Kriticky vás irituje povýšenecké moralizovanie iných." },
    { v: "Disciplína", pos: "Máte silnú sebadisciplínu a dôsledne dodržiavate dohody.", neg: "Mikromanažment: Stresuje vás kultúra kontroly a strachu z chýb." }
  ],
  ORANGE: [
    { v: "Úspech", pos: "Motivuje vás dosahovanie viditeľných výsledkov a víťazstvo.", neg: "Bezohľadnosť: Odmietate prístup 'účel svätí prostriedky' na úkor ľudí." },
    { v: "Logika", pos: "Rozhodujete sa na základe faktov a racionálneho úsudku.", neg: "Chlad: Vyrušuje vás ignorancia psychológie a emócií pri biznis rozhodnutiach." },
    { v: "Ambicióznosť", pos: "Neuspokojíte sa s priemerom a chcete neustále rásť.", neg: "Chamtivosť: Irituje vás narcistická potreba expanzie bez zdrojov." },
    { v: "Profesionalita", pos: "Zakladáte si na špičkovej kvalite a vecnej komunikácii.", neg: "Arogancia: Odmietate schovávanie sa za žargón a budovanie odstupu." }
  ],
  GREEN: [
    { v: "Harmónia", pos: "Pôsobíte ako mediátor, ktorý dbá na priateľské vzťahy.", neg: "Zametanie problémov: Neznášate, keď sa kvôli pokoju nerieši toxicita." },
    { v: "Súdržnosť", pos: "Budujete silnú tímovú identitu, kde je každý prijatý.", neg: "Groupthink: Irituje vás pasívne-agresívne trestanie iného názoru." },
    { v: "Empatia", pos: "Dokážete sa hlboko vcítiť do prežívania iných ľudí.", neg: "Submisivita: Vyrušuje vás neschopnosť dať kritiku zo strachu pred zranením citov." },
    { v: "Férovosť", pos: "Garantujete rovnaké šance a transparentné delenie zdrojov.", neg: "Dogmatický purizmus: Stresuje vás neschopnosť urobiť logickú ľudskú výnimku." }
  ],
  YELLOW: [
    { v: "Synergia", pos: "Prepájate nekompatibilné procesy do funkčného celku.", neg: "Ideológia: Odmietate umelé tlačenie nesúvisiacich vecí do spolupráce." },
    { v: "Komplexnosť", pos: "Vnímate situácie z viacerých uhlov (ekonomicky aj ľudsky).", neg: "Teoretizovanie: Neznášate stratu zmyslu pre realitu v nekonečných debatách." },
    { v: "Integrita", pos: "Konáte v súlade s vnútorným presvedčením bez ohľadu na tlak.", neg: "Extrémizmus: Irituje vás odmietanie nutného pragmatického kompromisu." },
    { v: "Majstrovstvo", pos: "Chcete do hĺbky pochopiť ako funguje svet a princípy.", neg: "Elitárstvo: Odmietate opovrhovanie operatívou z 'veže zo slonoviny'." }
  ]
};

const THEORY: any = {
  BLUE: { name: "MODRÁ: Poriadok", col: "#2563eb", d: "Stabilita a pravidlá." },
  ORANGE: { name: "ORANŽOVÁ: Výkon", col: "#ea580c", d: "Výsledky a efektivita." },
  GREEN: { name: "ZELENÁ: Vzťahy", col: "#16a34a", d: "Komunita a inklúzia." },
  YELLOW: { name: "ŽLTÁ: Synergia", col: "#ca8a04", d: "Systémová integrácia." }
};

const FLAT_VALUES = Object.entries(VALUES_DB).flatMap(([lvl, items]: any) => 
  items.map((i: any) => ({ ...i, lvl }))
);

export default function App() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState({ name: '', code: '', context: '', isPublic: true });
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

  const internalFrictions = useMemo(() => {
    return pos.filter(v => neg.includes(v));
  }, [pos, neg]);

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
        <p className="text-[#c7a1f7]/50 uppercase tracking-[0.4em] text-[9px] font-black mt-2">Team Behavioral Diagnostics v4.0</p>
      </header>

      <main className="max-w-4xl mx-auto bg-[#1e1a34]/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <AnimatePresence mode="wait">

          {/* STEP 1: FORM */}
          {step === 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-10">
              <h2 className="text-3xl font-serif">Nastavenie profilu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input placeholder="Vaše Meno" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-[#c7a1f7]" onChange={e=>setUser({...user, name: e.target.value})} />
                <input placeholder="Kód Tímu" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none uppercase" onChange={e=>setUser({...user, code: e.target.value.toUpperCase()})} />
                <select className="w-full bg-[#2a2448] p-5 rounded-2xl border border-white/10" onChange={e=>setUser({...user, context: e.target.value})}>
                  <option value="">Kontext hodnotenia...</option>
                  <option value="Práca">Práca / GrowClub</option>
                  <option value="Súkromie">Súkromný život</option>
                </select>
                <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                   {user.isPublic ? <UserCheck className="text-green-400"/> : <EyeOff className="text-white/40"/>}
                   <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest">{user.isPublic ? 'Moje meno bude verejné' : 'Budem anonymný'}</p>
                      <p className="text-[10px] text-white/40">V tímovom reporte sa zobrazí meno alebo ID.</p>
                   </div>
                   <button onClick={()=>setUser({...user, isPublic: !user.isPublic})} className="text-[10px] bg-[#c7a1f7] text-[#0a0817] px-3 py-1 rounded-full font-bold">Zmeniť</button>
                </div>
              </div>
              <button disabled={!user.name || !user.code || !user.context} className="w-full bg-[#c7a1f7] text-[#0a0817] font-black p-5 rounded-full uppercase tracking-widest shadow-lg shadow-[#c7a1f7]/10" onClick={()=>setStep(2)}>Začať</button>
            </motion.div>
          )}

          {/* STEP 2 & 3: FORCED CHOICE */}
          {(step === 2 || step === 3) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-serif">{step === 2 ? 'Hnací motor (+)' : 'Zóna odporu (x)'}</h3>
                  <p className="text-white/40 text-xs mt-1 italic">{step === 2 ? 'Vyberte 4 až 7 hodnôt, ktoré sú vaším kompasom.' : 'Vyberte 4 až 7 prejavov, ktoré vás naozaj vyrušujú.'}</p>
                </div>
                <div className="text-4xl font-serif text-[#c7a1f7]">{(step === 2 ? pos : neg).length} <span className="text-sm opacity-20">/ 7</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FLAT_VALUES.map((item: any, i: number) => {
                  const sel = step === 2 ? pos : neg;
                  const active = sel.includes(item.v);
                  return (
                    <button key={i} disabled={sel.length >= 7 && !active} className={`text-left p-6 rounded-3xl border-2 transition-all flex flex-col justify-between min-h-[140px] ${active ? 'bg-[#c7a1f7] border-[#c7a1f7] text-[#0a0817] shadow-xl' : 'bg-white/5 border-white/5 hover:border-white/20'} ${sel.length >= 7 && !active ? 'opacity-20' : ''}`}
                      onClick={() => {
                        const update = active ? sel.filter(v=>v!==item.v) : [...sel, item.v];
                        step === 2 ? setPos(update) : setNeg(update);
                      }}>
                      <span className={`text-[10px] font-black uppercase mb-3 ${active ? 'text-[#0a0817]/60' : 'text-[#c7a1f7]'}`}>{item.v}</span>
                      <span className="text-sm font-medium leading-snug">{step === 2 ? item.pos : item.neg}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-12 flex justify-between">
                <button className="text-white/20 text-xs font-bold uppercase tracking-widest hover:text-white" onClick={()=>setStep(step-1)}>Späť</button>
                <button disabled={(step === 2 ? pos : neg).length < 4 || isLoading} className="bg-[#c7a1f7] text-[#0a0817] font-black py-4 px-16 rounded-full uppercase text-sm tracking-widest" onClick={step===2 ? ()=>setStep(3) : submitResults}>Pokračovať</button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: INDIVIDUAL REPORT */}
          {step === 4 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-16">
              <div className="text-center">
                <h2 className="text-4xl font-serif mb-2 tracking-tight leading-none">Individuálna Analýza</h2>
                <p className="text-white/30 uppercase tracking-[0.3em] text-[9px] font-bold italic">Deep Dive Behavioral Report</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {/* Pos Section */}
                 <div className="space-y-6">
                    <h3 className="text-xl font-serif text-green-400 flex items-center gap-3 border-b border-white/5 pb-4"><Zap size={22}/> Čo vás nabíja</h3>
                    <div className="space-y-4">
                       {pos.map(v => {
                          const item = FLAT_VALUES.find((i:any) => i.v === v);
                          return (
                            <div key={v} className="bg-white/5 p-4 rounded-2xl border-l-4 border-green-500/50">
                               <p className="text-[10px] font-black uppercase text-green-400 mb-1">{v}</p>
                               <p className="text-xs text-white/70 italic leading-relaxed">{item?.pos}</p>
                            </div>
                          )
                       })}
                    </div>
                 </div>

                 {/* Neg Section */}
                 <div className="space-y-6">
                    <h3 className="text-xl font-serif text-red-400 flex items-center gap-3 border-b border-white/5 pb-4"><ShieldAlert size={22}/> Čo vás vyčerpáva</h3>
                    <div className="space-y-4">
                       {neg.map(v => {
                          const item = FLAT_VALUES.find((i:any) => i.v === v);
                          return (
                            <div key={v} className="bg-white/5 p-4 rounded-2xl border-l-4 border-red-500/50">
                               <p className="text-[10px] font-black uppercase text-red-400 mb-1">{v}</p>
                               <p className="text-xs text-white/70 italic leading-relaxed">{item?.neg}</p>
                            </div>
                          )
                       })}
                    </div>
                 </div>
              </div>

              {/* Contradiction Analysis */}
              <div className="bg-[#c7a1f7]/5 p-10 rounded-[3rem] border border-[#c7a1f7]/20 relative overflow-hidden">
                <div className="absolute top-[-20px] right-[-20px] opacity-5"><ArrowRightLeft size={200} /></div>
                <h3 className="text-xl font-serif text-[#c7a1f7] mb-6 flex items-center gap-3">
                  <AlertTriangle size={24}/> Analýza vnútorného trenia (Conflicts)
                </h3>
                <div className="space-y-6 relative z-10">
                   {internalFrictions.length > 0 ? (
                      internalFrictions.map(f => (
                        <div key={f} className="bg-[#c7a1f7]/10 p-6 rounded-[2rem] border border-[#c7a1f7]/20">
                           <p className="text-sm font-black uppercase text-[#c7a1f7] mb-2 tracking-widest">Kritické pnutie v hodnote: {f}</p>
                           <p className="text-sm text-white/80 leading-relaxed italic">
                             "Zároveň túto hodnotu preferujete aj odmietate jej tieň. To signalizuje, že v stresových situáciách bojujete s jej správnym využitím. Irituje vás jej zneužitie, no pod tlakom sa môžete do tohto tieňa nevdojak sami preklopiť. Toto pnutie vás môže vnútorne vyrušovať a stresovať."
                           </p>
                        </div>
                      ))
                   ) : (
                      <p className="text-sm text-white/50 leading-relaxed italic">Vaše nastavenie je momentálne vnútorne zladené a jasne vyprofilované. Necítite rozpor v tom, čo preferujete a čo odmietate.</p>
                   )}
                </div>
              </div>

              <div className="text-center pt-6 border-t border-white/5">
                <p className="text-white/40 text-xs mb-4">Pre profesionálnu facilitáciu týchto výsledkov kontaktujte mentora GrowClubu:</p>
                <div className="flex justify-center items-center gap-3">
                   <Mail className="text-[#c7a1f7]" size={20}/>
                   <a href="mailto:roman.rac@growclub.sk" className="text-2xl font-serif hover:text-[#c7a1f7] transition-all">roman.rac@growclub.sk</a>
                </div>
              </div>

              <button className="w-full bg-white text-[#0a0817] font-black p-6 rounded-full uppercase tracking-widest text-sm shadow-2xl hover:bg-[#c7a1f7] transition-all flex justify-center items-center gap-3" onClick={fetchTeam}>
                Zobraziť Tímový Report <LayoutDashboard size={20} />
              </button>
            </motion.div>
          )}

          {/* STEP 5: TEAM DASHBOARD */}
          {step === 5 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-12">
               <div className="flex justify-between items-center border-b border-white/10 pb-8">
                 <h2 className="text-4xl font-serif">Tímový Dashboard: {user.code}</h2>
                 <BarChart3 size={40} className="text-white/5" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                 {/* Team Charts */}
                 <div className="space-y-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic mb-4">Kolektívny motor (Priemer tímu)</h3>
                    {Object.keys(THEORY).map(lvl => {
                      const totalPossible = teamData.length * 7;
                      const sum = teamData.reduce((acc, curr) => acc + (curr.pos_scores[lvl] || 0), 0);
                      const perc = totalPossible > 0 ? Math.round((sum / totalPossible) * 100) : 0;
                      return (
                        <div key={lvl} className="space-y-2">
                          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/70"><span>{THEORY[lvl].name}</span><span>{perc}%</span></div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{width:0}} animate={{width: `${perc}%`}} className="h-full shadow-lg shadow-[#c7a1f7]/10" style={{background: THEORY[lvl].col}} />
                          </div>
                        </div>
                      )
                    })}
                 </div>

                 {/* Friction Matrix */}
                 <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-6">
                      <Flame size={14} className="text-orange-500" /> Riziko stretu v tíme
                    </h3>
                    <div className="space-y-6">
                       {(() => {
                          const allPos = teamData.flatMap(d => d.pos_labels);
                          const allNeg = teamData.flatMap(d => d.neg_labels);
                          const clashes = allPos.filter(v => allNeg.includes(v));
                          const uniqueClashes = Array.from(new Set(clashes));

                          return uniqueClashes.length > 0 ? (
                             uniqueClashes.slice(0, 3).map(c => (
                               <div key={c} className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-[2rem]">
                                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Kontrast v hodnote: {c}</p>
                                  <p className="text-[11px] text-white/60 font-medium leading-relaxed italic">
                                    Niektorí členovia túto hodnotu preferujú ako motor, iní ju vnímajú ako vyrušujúcu. Pod tlakom tu vzniká riziko nepochopenia a trenia.
                                  </p>
                               </div>
                             ))
                          ) : <p className="text-xs text-white/30 italic">Tím je v kľúčových prejavoch nezvyčajne zladený.</p>;
                       })()}
                    </div>
                 </div>
               </div>

               {/* Individual Grid */}
               <div className="space-y-8 pt-10 border-t border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Zloženie jednotlivcov</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamData.map((member, i) => (
                      <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-[#c7a1f7]/20 transition-all group">
                         <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-serif group-hover:text-[#c7a1f7] transition-colors">{member.user_name}</p>
                            <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">ID: {member.id.slice(0,4)}</span>
                         </div>
                         <div className="flex gap-1.5 h-1">
                            {Object.entries(member.pos_scores).map(([k,v]:any) => (
                               v > 0 && <div key={k} style={{width: `${(v/7)*100}%`, background: THEORY[k].col}} className="rounded-full shadow-sm"/>
                            ))}
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
               
               <button onClick={()=>location.reload()} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all underline block mx-auto pt-10">← Nový assessment</button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-white/5 text-[9px] font-black uppercase tracking-[1.5em]">
        FORBES GROWCLUB • SPIRAL DYNAMICS • SUPABASE CONNECTED
      </footer>
    </div>
  );
}