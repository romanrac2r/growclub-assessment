"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Users, ShieldAlert, CheckCircle2, Info, 
  AlertTriangle, LayoutDashboard, BarChart3, Mail, Target, 
  UserCheck, EyeOff, Zap, Flame, ArrowRightLeft, Search
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- KOMPLETNÁ DATABÁZA VŠETKÝCH 52 HODNÔT Z PDF ---
const VALUES_DB: any = {
  BLUE: [
    { v: "Poriadok", pos: "Vytvárate jasné, predvídateľné procesy a definujete transparentné pravidlá hry pre celú štruktúru.", neg: "Byrokracia: Odmietate procesy, ktoré paralyzujú firmu a strácajú zmysel v nezmyselných reportoch." },
    { v: "Stabilita", pos: "Zabezpečujete konzistentné pracovné podmienky a chránite tím pred náhlymi chaosmi zvonku.", neg: "Dogmatizmus: Vyrušuje vás blokovanie inovácií a zamŕzanie v status quo s vetou 'takto sme to robili vždy'." },
    { v: "Morálka", pos: "Idete príkladom v etickom správaní a vyžadujete čestné konanie aj v situáciách znižujúcich zisk.", neg: "Farizejstvo: Kriticky vás irituje povýšenecké moralizovanie a verejné pranierovanie iných za drobné chyby." },
    { v: "Disciplína", pos: "Vyžadujete zodpovedný prístup k termínom a kvalite; uplatňujete spravodlivý systém hodnotenia.", neg: "Mikromanažment: Stresuje vás dusivá kontrola, meranie času na toalete a drakonické tresty za omyly." },
    { v: "Presnosť", pos: "Formulujete zadania špecificky a s maximálnou jasnosťou, čím eliminujete domnienky a omyly.", neg: "Analysis Paralysis: Vyrušuje vás utápanie sa v detailoch a odďaľovanie rozhodnutí kvôli utopickej istote." },
    { v: "Štruktúra", pos: "Jasne rozdeľujete kompetencie a právomoci, aby nedochádzalo k duplicite práce a plytvaniu zdrojmi.", neg: "Silos: Odmietate nepriechodné oddelenia, kde komunikácia musí ísť len formálne cez nadriadených." },
    { v: "Lojálnosť", pos: "Stojíte za svojím tímom v krízach, obhajujete firmu navonok a budujete pocit bezpečia.", neg: "Slepá poslušnosť: Irituje vás, ak sa konštruktívna kritika trestá ako osobná zrada a vzbura." },
    { v: "Pracovitosť", pos: "Osobne demonštrujete silnú pracovnú etiku a spravodlivo rozdeľujete záťaž v tíme.", neg: "Workoholizmus: Odmietate glorifikáciu vyčerpania ako normy a podceňovanie ľudí s work-life balance." },
    { v: "Plnenie povinností", pos: "K záväzkom pristupujete s maximálnou vážnosťou a dôsledne vyhodnocujete doručenie výsledkov.", neg: "Alibizmus: Stresuje vás postoj 'to nie je v mojej náplni práce' alebo patologické preberanie úloh za iných." },
    { v: "Skromnosť", pos: "Nepovyšujete svoje ego nad pravidlá a prirodzene presúvate kredit za úspech na celý tím.", neg: "Ublížené martýrstvo: Vyrušuje vás umele potláčaná oslava úspechu a odmietanie adekvátneho PR firmy." }
  ],
  ORANGE: [
    { v: "Logika", pos: "Strategické rozhodnutia zakladáte výhradne na tvrdých dátach, analýzach trhu a vedeckých postupoch.", neg: "Chladná slepota: Odmietate ignoranciu psychológie a emócií, kde sú ľudia len čísla v tabuľke." },
    { v: "Úspech", pos: "Definujete víťazné míľniky a inšpirujete tím k prekonávaniu trhových očakávaní a meritokracii.", neg: "Bezohľadnosť: Irituje vás princíp 'účel svätí prostriedky', klamanie klientov a ničenie zdravia pre bonusy." },
    { v: "Jasné ciele", pos: "Využívate metodiky ako OKR, aby každý vedel, kam firma smeruje a aký je jeho príspevok.", neg: "Cynické metriky: Vyrušuje vás chaotické menenie cieľov podľa nálady alebo nastavovanie nesplniteľných plánov." },
    { v: "Ambicióznosť", pos: "Neustále posúvate limity, vyhľadávate nové trhy a motivujete tím k profesionálnemu rastu.", neg: "Chamtivosť: Odmietate narcistickú stratu kontaktu s realitou a agresívnu expanziu bez reálnych kapacít." },
    { v: "Zvedavosť", pos: "Aktívne podporujete výskum a inovácie; alokujete čas na experimenty bez okamžitého tlaku na ROI.", neg: "Shiny Object Syndrome: Irituje vás neustále skákanie od trendu k trendu bez ich stabilizácie a doťahovania." },
    { v: "Kreativita", pos: "Budujete psychologicky bezpečné prostredie pre brainstorming a divergentné nápady.", neg: "Neukotvené snívanie: Vyrušuje vás generovanie vízií bez ochoty k tvrdej práci a exekúcii nápadov." },
    { v: "Optimizmus", pos: "V krízach šírite sebadôveru, hľadáte skryté príležitosti a pôsobíte ako zdroj energie pre tím.", neg: "Toxická pozitivita: Odmietate zakazovanie pomenovať reálne hrozby a maskovanie krachu falošným šťastím." },
    { v: "Profesionalita", pos: "Reprezentujete firmu asertívne, vecne a s ohľadom na protokol; udržiavate vysokú kvalitu výstupov.", neg: "Korporátny žargón: Irituje vás budovanie odstupu cez chladný jazyk a odmietanie akejkoľvek ľudskosti." },
    { v: "Dokonalosť", pos: "Zavádzate optimalizačné procesy (LEAN) a dbáte na detaily, ktoré tvoria pridanú hodnotu.", neg: "Paralyzujúci perfekcionizmus: Stresuje vás neustále vracanie práce kvôli nepodstatným detailom (odtieň farby)." },
    { v: "Prosperita", pos: "Strategicky riadite rast s ohľadom na cash-flow a reinvestujete zisky do infraštruktúry tímu.", neg: "Asset Stripping: Odmietate agresívne sekanie nákladov len pre okamžitý zisk lídra na úkor budúcnosti." },
    { v: "Peniaze", pos: "Nastavujete transparentné bonusové schémy a edukujete tím o finančnom zdraví organizácie.", neg: "Korupcia moci: Irituje vás vnímanie peňazí ako nástroja vydierania a kupovania si slepej poslušnosti." },
    { v: "Nezávislosť", pos: "Decentralizujete riadenie, delegujete právomoci na expertov a rešpektujete ich autonómiu.", neg: "Izolacionizmus: Vyrušuje vás budovanie vlastných impérií v rámci firmy a sabotovanie spoločnej stratégie." },
    { v: "Seba-vyjadrenie", pos: "Proaktívne budujete osobné značky svojich ľudí a vnímate silné individuality ako prínos tímu.", neg: "Narcizmus: Odmietate kradnutie nápadov podriadených a monopolizovanie diskusie lídrom." }
  ],
  GREEN: [
    { v: "Harmónia", pos: "Zabezpečujete pokojné prostredie a včas identifikujete napätie skôr, než vyeskaluje do vojny.", neg: "Falošný pokoj: Irituje vás strach z konfrontácie a zametanie toxicity pod koberec kvôli 'pohode'." },
    { v: "Súdržnosť", pos: "Budujete hlboký pocit identity 'my sme jeden celok' a odstraňujete bariéry medzi manažmentom.", neg: "Groupthink: Vyrušuje vás dusivé sektárske prostredie, ktoré pasívne-agresívne trestá iný názor." },
    { v: "Spravodlivosť", pos: "Zohľadňujete individuálne potreby a znevýhodnenia; zastávate sa marginalizovaných kolegov.", neg: "Kolektívna vina: Odmietate rovnostársku utópiu, kde sú najlepší odmeňovaní rovnako ako najslabší." },
    { v: "Rovnosť", pos: "Ku každému pristupujete s rovnakou úctou a rušíte nezmyselné elitárske privilégiá vedenia.", neg: "Chaos v kompetenciách: Stresuje vás, ak majú laici rovnaké hlasovacie právo v expertných IT témach." },
    { v: "Konsenzus", pos: "Zapájate tím do formovania zmien, počúvate obavy a hľadáte úprimný súhlas všetkých strán.", neg: "Kríza rozhodovania: Vyrušuje vás paralýza, kde sa nepohne ani krok bez súhlasu posledného člena tímu." },
    { v: "Spolupatričnosť", pos: "Budujete sieť neformálnych vzťahov, kde sa každý cíti vítaný bez potreby nosiť masku.", neg: "Emocionálna manipulácia: Irituje vás vytváranie závislosti na firemnej 'rodine', ktorá sťažuje odchod inam." },
    { v: "Solidarita", pos: "Systematicky podporujete CSR aktivity a nezištne organizujete pomoc kolegom v životnej núdzi.", neg: "Povinné dobro: Odmietate sociálny nátlak na vzdávanie sa voľného času pre lídrove iniciatívy." },
    { v: "Šťastie", pos: "Meria spokojnosť a wellbeing; prispôsobujete podmienky (home office) prevencii vyhorenia.", neg: "Tyrania pozitivity: Vyrušuje vás neúprosná kultúra, kde je zakázané byť smutný alebo frustrovaný z krízy." },
    { v: "Mindfulness", pos: "Prejavujete plnú prítomnosť, bez súdenia počúvate tím a vnímate jemné zmeny v nálade.", neg: "Pseudo-spiritualita: Irituje vás zneužívanie ezoterického žargónu na zakrytie neschopnosti odborne riadiť." },
    { v: "Rešpekt", pos: "Oceňujete kognitívnu diverzitu a odlišné životné štýly bez akýchkoľvek stereotypov.", neg: "Vylučovanie: Odmietate, ak sa 'rešpekt' zmení na zbraň proti komukoľvek s racionálnou kritickou otázkou." },
    { v: "Zdieľanie", pos: "Presadzujete politiku otvorených dverí a platformy pre voľné zdieľanie informácií a know-how.", neg: "Strata intimity: Vyrušuje vás nútené zdieľanie súkromných tráum pred kolektívom na poradách." },
    { v: "Podpora", pos: "Poskytujete hlboký mentoring a štedro alokujete zdroje na rozvoj najvyššieho potenciálu ľudí.", neg: "Helikoptérový manažment: Irituje vás hasenie problémov za iných, čím sa ľudia stávajú nesamostatnými." },
    { v: "Férovosť", pos: "Garantujete rovnaké šance na rast a projekty absolútne bez vplyvu skrytých sympatií.", neg: "Bezcitný dogmatizmus: Odmietate neschopnosť urobiť logickú ľudskú výnimku z pravidiel v ťažkej situácii." },
    { v: "Empatia", pos: "Máte schopnosť vcítenia sa a automaticky prispôsobujete tón a jazyk potrebám kolegu.", neg: "Paralyzujúca submisivita: Vyrušuje vás neschopnosť dať kritiku zo strachu pred zranením citov." },
    { v: "Spolupráca", pos: "Podporujete cross-funkčné tímy a odmeňujete ľudí za to, ako pomohli uspieť iným oddeleniam.", neg: "Rozmazanie zodpovednosti: Irituje vás alibizmus 'zlyhali sme ako kolektív' pri konkrétnej chybe jednotlivca." },
    { v: "Tolerancia", pos: "Vytvárate radikálne otvorené prostredie odolné voči predsudkom akéhokoľvek druhu.", neg: "Slabosť: Odmietate tolerovanie chronických flákačov na úkor výkonných ľudí kvôli 'ťažkej povahe'." },
    { v: "Pokora", pos: "Autenticky priznávate vlastné manažérske chyby a úctivo počúvate názory expertov v miestnosti.", neg: "Znižovanie autority: Vyrušuje vás slabosť lídra, ktorý v čase krízy nedokáže prevziať velenie." },
    { v: "Zhoda", pos: "Pátrate po hlbokom jadre obáv a hľadáte skutočný prienik riešení cez štruktúrovanú debatu.", neg: "Mníchovský ústupok: Odmietate zradu stratégie firmy len kvôli krikľavému tlaku toxickej menšiny." },
    { v: "Zábava", pos: "Prirodzene zavádzate prvky humoru a odľahčenia do bežnej práce na uvoľnenie stresu tímu.", neg: "Infantilná zábava: Vyrušujú vás trápne hry, ktoré znižujú dôstojnosť dospelých profesionálov." }
  ],
  YELLOW: [
    { v: "Synergia", pos: "Orchestrálne prepájate protichodné procesy do celku, ktorého výkon je exponenciálne vyšší.", neg: "Intelektuálne násilie: Irituje vás umelé prepájanie vecí, ktoré k sebe logicky ani kontextuálne nepasujú." },
    { v: "Komplexnosť", pos: "Diagnostikujete krízu multidimenzionálne – beriete do úvahy trh, psychológiu aj ekológiu.", neg: "Akademické nafukovanie: Vyrušuje vás riešenie banálnych operatívnych úloh cez nekonečné teórie." },
    { v: "Partnerstvo", pos: "Dizajnujete win-win-win modely, kde benefituje firma, klient aj širší regionálny ekosystém.", neg: "Slabá obrana: Odmietate naivné odovzdávanie know-how konkurencii zo strachu z roly 'predátora'." },
    { v: "Prepojenosť", pos: "Vidíte 'big picture' a chápete dopad mikro-krokov na globálnu misiu celého podniku.", neg: "Totálne rozptýlenie: Irituje vás strata fokusu na jadro biznisu kvôli desiatkam irelevantných záujmov." },
    { v: "Inšpiratívnosť", pos: "Cez magnetickú víziu prekladáte zložité koncepty do jednoduchého jazyka, ktorému rozumie každý.", neg: "Nedostupná aura: Vyrušuje vás pôsobenie 'nadčloveka' a uletené frázy, ktoré v tíme vzbudzujú cynizmus." },
    { v: "Integrita", pos: "Preukazujete hlbokú vnútornú konzistenciu a flexibilnú prispôsobivosť kontextu reality.", neg: "Rigidný purizmus: Odmietate odmietanie pragmatických kompromisov kvôli abstraktným ideológiám." },
    { v: "Majstrovstvo", pos: "Ste celoživotným študentom princípov; trénujete všetky štruktúry do hĺbky pre transformáciu.", neg: "Veža zo slonoviny: Irituje vás elitárska pýcha a arogantné opovrhovanie 'obyčajnou' operatívou." },
    { v: "Spontánnosť", pos: "Máte fenomenálnu agilitu a schopnosť bleskovo otočiť smer firmy bez prasknutia štruktúry kmeňa.", neg: "Rozbitie lode: Stresuje vás impulzívne menenie pravidiel hry každý jeden deň, čo vedie k vyhoreniu tímu." },
    { v: "Seba-uvedomovanie", pos: "Brilantne izolujete vlastné ego, poznáte svoje biasy a plynulo prepínate štýl vedenia.", neg: "Fixácia na vnútro: Odmietate narcistické zacyklenie sa vo vlastnej terapii a analýzach traum z minulosti." },
    { v: "Zhoda (Rádu)", pos: "Nachádzate spoločný zmysel presahujúci egá, s ktorým sa každý v tíme hlboko stotožní.", neg: "Vesmírna harmónia: Vyrušuje vás hľadanie tak dokonalej zhody, že to paralyzuje riešenie akútnych problémov." }
  ]
};

const THEORY: any = {
  BLUE: { name: "MODRÁ: Rád a Poriadok", col: "#2563eb", d: "Tier 1: Zameranie na stabilitu, morálku a disciplínu. Svet má mať svoj poriadok." },
  ORANGE: { name: "ORANŽOVÁ: Výkon a Úspech", col: "#ea580c", d: "Tier 1: Orientácia na výsledky, efektivitu a strategické myslenie. Svet je ihrisko príležitostí." },
  GREEN: { name: "ZELENÁ: Vzťahy a Harmónia", col: "#16a34a", d: "Tier 1: Prioritou je ľudský faktor, inklúzia a súlad. Úspech je ovocím spokojnosti ľudí." },
  YELLOW: { name: "ŽLTÁ: Systémová Integrácia", col: "#ca8a04", d: "Tier 2: Monumentálny skok vedomia. Chápete nevyhnutnosť všetkých farieb a prepínate medzi nimi bez ega." }
};

const FLAT_VALUES = Object.entries(VALUES_DB).flatMap(([lvl, items]: any) => 
  items.map((i: any) => ({ ...i, lvl }))
);

export default function App() {
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
        <p className="text-[#c7a1f7]/50 uppercase tracking-[0.4em] text-[9px] font-black mt-2">Team Behavioral Diagnostics v4.2 (Complete Dataset)</p>
      </header>

      <main className="max-w-4xl mx-auto bg-[#1e1a34]/40 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <AnimatePresence mode="wait">

          {/* STEP 1: FORM */}
          {step === 1 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-10">
              <h2 className="text-3xl font-serif">Profil účastníka</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input placeholder="Vaše Meno" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none focus:border-[#c7a1f7]" onChange={e=>setUser({...user, name: e.target.value})} />
                <input placeholder="Kód Tímu" className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 outline-none uppercase" onChange={e=>setUser({...user, code: e.target.value.toUpperCase()})} />
                <select className="w-full bg-[#2a2448] p-5 rounded-2xl border border-white/10" onChange={e=>setUser({...user, context: e.target.value})}>
                  <option value="">Kontext hodnotenia...</option>
                  <option value="Práca">Pracovné prostredie / Leadership</option>
                  <option value="Súkromie">Súkromný život</option>
                </select>
                <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                   {user.isPublic ? <UserCheck className="text-green-400"/> : <EyeOff className="text-white/40"/>}
                   <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest">{user.isPublic ? 'Verejné meno' : 'Budem anonymný'}</p>
                      <p className="text-[10px] text-white/40 italic">Meno v tímovom reporte.</p>
                   </div>
                   <button onClick={()=>setUser({...user, isPublic: !user.isPublic})} className="text-[10px] bg-[#c7a1f7] text-[#0a0817] px-4 py-1.5 rounded-full font-black uppercase">Zmeniť</button>
                </div>
              </div>
              <button disabled={!user.name || !user.code || !user.context} className="w-full bg-[#c7a1f7] text-[#0a0817] font-black p-6 rounded-full uppercase tracking-widest shadow-lg" onClick={()=>setStep(2)}>Vstúpiť do analýzy</button>
            </motion.div>
          )}

          {/* STEP 2 & 3: GRID WITH SEARCH */}
          {(step === 2 || step === 3) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h3 className="text-2xl font-serif flex items-center gap-3">
                    {step === 2 ? <Zap className="text-green-400" size={24}/> : <ShieldAlert className="text-red-400" size={24}/>}
                    {step === 2 ? 'Hnací motor (+)' : 'Zóna odporu (x)'}
                  </h3>
                  <p className="text-white/40 text-xs mt-1 italic">{step === 2 ? 'Vyberte 4 až 7 prejavov, ktoré vás v práci nabíjajú.' : 'Vyberte 4 až 7 prejavov, ktoré vás bytostne stresujú.'}</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-4 top-3.5 text-white/20" size={16}/>
                      <input placeholder="Hľadať hodnotu..." className="bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 text-xs outline-none focus:border-[#c7a1f7]" onChange={e=>setSearch(e.target.value)} />
                   </div>
                   <div className="text-4xl font-serif text-[#c7a1f7] min-w-[80px] text-right">{(step === 2 ? pos : neg).length} <span className="text-sm opacity-20">/ 7</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredValues.map((item: any, i: number) => {
                  const sel = step === 2 ? pos : neg;
                  const active = sel.includes(item.v);
                  return (
                    <button key={i} disabled={sel.length >= 7 && !active} className={`text-left p-6 rounded-3xl border-2 transition-all flex flex-col justify-between min-h-[140px] group ${active ? 'bg-[#c7a1f7] border-[#c7a1f7] text-[#0a0817] shadow-xl' : 'bg-white/5 border-white/10 hover:border-white/20'} ${sel.length >= 7 && !active ? 'opacity-20 grayscale' : ''}`}
                      onClick={() => {
                        const update = active ? sel.filter(v=>v!==item.v) : [...sel, item.v];
                        step === 2 ? setPos(update) : setNeg(update);
                      }}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-black uppercase mb-3 ${active ? 'text-[#0a0817]/60' : 'text-[#c7a1f7]'}`}>{item.v}</span>
                        {active && <CheckCircle2 size={16} />}
                      </div>
                      <span className="text-sm font-medium leading-snug">{step === 2 ? item.pos : item.neg}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-between items-center border-t border-white/5 pt-10">
                <button className="text-white/20 text-xs font-black uppercase tracking-widest hover:text-white" onClick={()=>setStep(step-1)}>← Späť</button>
                <button disabled={(step === 2 ? pos : neg).length < 4 || isLoading} className="bg-[#c7a1f7] text-[#0a0817] font-black py-5 px-20 rounded-full uppercase text-sm tracking-widest" onClick={step===2 ? ()=>setStep(3) : submitResults}>
                  {isLoading ? 'Ukladám...' : 'Pokračovať'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: INDIVIDUAL DEEP DIVE */}
          {step === 4 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-20">
              <div className="text-center space-y-2">
                <h2 className="text-5xl font-serif tracking-tight">Váš Hodnotový Deep-Dive</h2>
                <div className="flex justify-center gap-4">
                  <span className="bg-[#c7a1f7]/10 px-4 py-1 rounded-full text-[10px] font-black text-[#c7a1f7] uppercase tracking-widest">{user.name}</span>
                  <span className="bg-white/5 px-4 py-1 rounded-full text-[10px] font-black text-white/30 uppercase tracking-widest">{user.context}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                 {/* POSITIVE */}
                 <div className="space-y-8">
                    <h3 className="text-2xl font-serif text-green-400 flex items-center gap-3 border-b border-white/5 pb-4"><CheckCircle2 size={26}/> Hnací motor</h3>
                    <div className="space-y-6">
                       {pos.map(v => {
                          const item = FLAT_VALUES.find((i:any) => i.v === v);
                          return (
                            <div key={v} className="bg-white/5 p-6 rounded-3xl border-l-4" style={{borderColor: THEORY[item?.lvl].col}}>
                               <div className="flex justify-between items-center mb-2">
                                  <p className="text-[10px] font-black uppercase" style={{color: THEORY[item?.lvl].col}}>{v}</p>
                                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{item?.lvl}</span>
                               </div>
                               <p className="text-sm text-white/80 italic leading-relaxed">{item?.pos}</p>
                            </div>
                          )
                       })}
                    </div>
                 </div>

                 {/* NEGATIVE */}
                 <div className="space-y-8">
                    <h3 className="text-2xl font-serif text-red-400 flex items-center gap-3 border-b border-white/5 pb-4"><ShieldAlert size={26}/> Zóna odporu</h3>
                    <div className="space-y-6">
                       {neg.map(v => {
                          const item = FLAT_VALUES.find((i:any) => i.v === v);
                          return (
                            <div key={v} className="bg-white/5 p-6 rounded-3xl border-l-4 opacity-70" style={{borderColor: THEORY[item?.lvl].col}}>
                               <div className="flex justify-between items-center mb-2">
                                  <p className="text-[10px] font-black uppercase text-red-400">{v}</p>
                                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{item?.lvl}</span>
                               </div>
                               <p className="text-sm text-white/60 italic leading-relaxed">{item?.neg}</p>
                            </div>
                          )
                       })}
                    </div>
                 </div>
              </div>

              {/* CRITICAL FRICTION ANALYSIS */}
              <div className="bg-[#c7a1f7]/5 p-12 rounded-[3.5rem] border border-[#c7a1f7]/20 relative overflow-hidden">
                <div className="absolute top-[-40px] right-[-40px] opacity-5"><ArrowRightLeft size={300} /></div>
                <h3 className="text-3xl font-serif text-[#c7a1f7] mb-8 flex items-center gap-4">
                  <AlertTriangle size={32}/> Analýza vnútorného pnutia
                </h3>
                <div className="space-y-8 relative z-10">
                   {internalFrictions.length > 0 ? (
                      internalFrictions.map(f => (
                        <div key={f} className="bg-[#c7a1f7]/10 p-8 rounded-[2.5rem] border border-[#c7a1f7]/20">
                           <p className="text-lg font-black uppercase text-[#c7a1f7] mb-4 tracking-tighter">Kritický rozpor v hodnote: {f}</p>
                           <p className="text-md text-white/90 leading-relaxed italic font-medium">
                             "Túto hodnotu milujete v jej konštruktívnom prejave, ale bytostne nenávidíte jej tieň. Pod tlakom ste na túto tému extrémne citlivý. Hrozí u vás paradoxné správanie: Irituje vás, ak iní v tejto oblasti zlyhávajú, no v strese sa môžete do rovnakého tieňa nevdojak preklopiť sami. Tento rozpor vás vnútorne vyrušuje a je vaším najväčším stresorom."
                           </p>
                        </div>
                      ))
                   ) : (
                      <p className="text-lg text-white/40 leading-relaxed italic max-w-2xl font-medium">Vaše nastavenie je momentálne zladené. Necítite priamy rozpor medzi tým, čo preferujete ako motor a čo odmietate ako spúšťač.</p>
                   )}
                </div>
              </div>

              <div className="text-center pt-10 border-t border-white/5 space-y-6">
                <p className="text-white/40 text-sm italic max-w-xl mx-auto leading-relaxed">Pre detailnejší rozbor vášho hodnotového nastavenia a facilitáciu tímu kontaktujte nášho Forbes GrowClub mentora:</p>
                <div className="flex justify-center items-center gap-4 group">
                   <Mail className="text-[#c7a1f7] group-hover:scale-110 transition-all" size={24}/>
                   <a href="mailto:roman.rac@growclub.sk" className="text-3xl font-serif hover:text-[#c7a1f7] transition-all border-b border-[#c7a1f7]/30 pb-1">roman.rac@growclub.sk</a>
                </div>
              </div>

              <button className="w-full bg-white text-[#0a0817] font-black p-7 rounded-full uppercase tracking-widest text-sm shadow-2xl hover:bg-[#c7a1f7] transition-all flex justify-center items-center gap-3" onClick={fetchTeam}>
                Zobraziť Tímový Dashboard <LayoutDashboard size={20} />
              </button>
            </motion.div>
          )}

          {/* STEP 5: TEAM DASHBOARD */}
          {step === 5 && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-8 md:p-16 space-y-20">
               <div className="flex justify-between items-center border-b border-white/10 pb-10">
                 <div className="space-y-1">
                    <h2 className="text-4xl font-serif tracking-tight leading-none">Tímový Dashboard</h2>
                    <p className="text-[#c7a1f7] text-[11px] font-black uppercase tracking-[0.4em]">{user.code} • ANALÝZA {teamData.length} PROFILOV</p>
                 </div>
                 <BarChart3 size={48} className="text-white/5" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                 {/* AVG Charts */}
                 <div className="space-y-12">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 italic">Kolektívny motor tímu</h3>
                    {Object.keys(THEORY).map(lvl => {
                      const totalPossible = teamData.length * 7;
                      const sum = teamData.reduce((acc, curr) => acc + (curr.pos_scores[lvl] || 0), 0);
                      const perc = totalPossible > 0 ? Math.round((sum / totalPossible) * 100) : 0;
                      return (
                        <div key={lvl} className="space-y-3">
                          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/80"><span>{THEORY[lvl].name}</span><span>{perc}%</span></div>
                          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{width:0}} animate={{width: `${perc}%`}} className="h-full shadow-lg" style={{background: THEORY[lvl].col}} />
                          </div>
                        </div>
                      )
                    })}
                 </div>

                 {/* Team Clashes */}
                 <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] text-orange-500 opacity-5"><Flame size={220} /></div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-10 italic relative z-10">
                      <Flame size={16} className="text-orange-500" /> Matica tímových stretov
                    </h3>
                    <div className="space-y-8 relative z-10">
                       {(() => {
                          const allPos = teamData.flatMap(d => d.pos_labels);
                          const allNeg = teamData.flatMap(d => d.neg_labels);
                          const clashes = allPos.filter(v => allNeg.includes(v));
                          const uniqueClashes = Array.from(new Set(clashes));

                          return uniqueClashes.length > 0 ? (
                             uniqueClashes.slice(0, 4).map(c => (
                               <div key={c} className="p-8 bg-orange-500/10 border border-orange-500/20 rounded-[2.5rem] space-y-2">
                                  <p className="text-sm font-black text-orange-500 uppercase tracking-tighter">Kritický kontrast: {c}</p>
                                  <p className="text-xs text-white/70 leading-relaxed italic font-medium">
                                    "Zatiaľ čo niekto túto hodnotu preferuje ako kľúčovú, iný ju v tíme vníma ako deštruktívnu. Pri zmene okolností alebo pod tlakom tu vzniká vysoké riziko nepochopenia a trenia."
                                  </p>
                               </div>
                             ))
                          ) : <p className="text-sm text-white/30 italic font-medium">Tím je v kľúčových prejavoch nezvyčajne vnútorne zladený.</p>;
                       })()}
                    </div>
                 </div>
               </div>

               {/* Individuals */}
               <div className="space-y-10 pt-16 border-t border-white/5">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 italic">Hodnotové ukotvenie jednotlivcov</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamData.map((member, i) => (
                      <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-[#c7a1f7]/30 transition-all cursor-default group relative overflow-hidden">
                         <div className="flex justify-between items-center mb-6">
                            <p className="text-md font-serif group-hover:text-[#c7a1f7] transition-colors truncate pr-2">{member.user_name}</p>
                            <UserCheck className="text-white/10" size={16}/>
                         </div>
                         <div className="space-y-3">
                            {Object.entries(member.pos_scores).map(([k,v]:any) => (
                               v > 0 && (
                                 <div key={k} className="flex items-center gap-2">
                                    <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                                       <div className="h-full rounded-full" style={{width: `${(v/7)*100}%`, background: THEORY[k].col}} />
                                    </div>
                                    <span className="text-[8px] font-black text-white/30 uppercase w-3">{k[0]}</span>
                                 </div>
                               )
                            ))}
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
               
               <button onClick={()=>location.reload()} className="text-[11px] font-black uppercase tracking-[0.4em] text-white/10 hover:text-white transition-all underline block mx-auto pt-20">← Späť na začiatok</button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-white/5 text-[9px] font-black uppercase tracking-[1.5em]">
        © 2026 FORBES GROWCLUB • SPIRAL DYNAMICS DIAGNOSTICS • FULL DATASET V4.2
      </footer>
    </div>
  );
}