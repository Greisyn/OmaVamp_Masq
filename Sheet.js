.pragma library

// Field lists + plain-text renderer shared by SheetService.qml.
// Vampire: The Masquerade 20th Anniversary Edition (Neonate sheet).
// Mirrors the OmaWolf layout: identity, attributes, talents/skills/knowledges,
// virtues/pools, advantages text blocks, plain-text export for LLM roleplay.

function identityKeys() {
    return ["charName", "player", "chronicle", "nature", "demeanor",
            "concept", "clan", "generation", "sire"];
}

function identityLabels() {
    return {
        charName: "Name", player: "Player", chronicle: "Chronicle",
        nature: "Nature", demeanor: "Demeanor", concept: "Concept",
        clan: "Clan", generation: "Generation", sire: "Sire"
    };
}

function attributeGroups() {
    return [
        { cat: "Physical", keys: ["str", "dex", "sta"], labels: ["Strength", "Dexterity", "Stamina"] },
        { cat: "Social", keys: ["cha", "man", "app"], labels: ["Charisma", "Manipulation", "Appearance"] },
        { cat: "Mental", keys: ["per", "intl", "wit"], labels: ["Perception", "Intelligence", "Wits"] }
    ];
}

function abilityGroups() {
    return [
        { cat: "Talents",
          keys: ["alertness", "athletics", "awareness", "brawl", "empathy", "expression", "intimidation", "leadership", "streetwise", "subterfuge"],
          labels: ["Alertness", "Athletics", "Awareness", "Brawl", "Empathy", "Expression", "Intimidation", "Leadership", "Streetwise", "Subterfuge"] },
        { cat: "Skills",
          keys: ["animalKen", "crafts", "drive", "etiquette", "firearms", "larceny", "melee", "performance", "stealth", "survival"],
          labels: ["Animal Ken", "Crafts", "Drive", "Etiquette", "Firearms", "Larceny", "Melee", "Performance", "Stealth", "Survival"] },
        { cat: "Knowledges",
          keys: ["academics", "computer", "finance", "investigation", "law", "medicine", "occult", "politics", "science", "technology"],
          labels: ["Academics", "Computer", "Finance", "Investigation", "Law", "Medicine", "Occult", "Politics", "Science", "Technology"] }
    ];
}

function poolKeys() {
    return ["conscience", "selfControl", "courage", "humanity", "willpower", "bloodPool", "experience"];
}

function poolLabels() {
    return { conscience: "Conscience/Conviction", selfControl: "Self-Control/Instinct",
             courage: "Courage", humanity: "Humanity/Path", willpower: "Willpower",
             bloodPool: "Blood Pool", experience: "Experience" };
}

function textKeys() {
    return ["backgrounds", "disciplines", "rituals", "merits", "flaws",
            "otherTraits", "combat", "gear", "history", "appearance",
            "personality", "goals", "weakness", "ooc"];
}

function textLabels() {
    return { backgrounds: "Backgrounds", disciplines: "Disciplines",
             rituals: "Rituals / Paths", merits: "Merits", flaws: "Flaws",
             otherTraits: "Other Traits", combat: "Combat",
             gear: "Gear / Equipment", history: "History", appearance: "Appearance",
             personality: "Personality", goals: "Goals",
             weakness: "Clan Weakness",
             ooc: "OOC Instructions to LLM" };
}

function defaultData() {
    // True blank sheet: empty fields, Attributes 1 (V20 minimum),
    // Virtues 1 (like Attributes), all Abilities 0, other pools 0.
    return {
        charName: "", player: "", chronicle: "", nature: "", demeanor: "",
        concept: "", clan: "", generation: "", sire: "",
        str: 1, dex: 1, sta: 1, cha: 1, man: 1, app: 1, per: 1, intl: 1, wit: 1,
        alertness: 0, athletics: 0, awareness: 0, brawl: 0, empathy: 0,
        expression: 0, intimidation: 0, leadership: 0, streetwise: 0, subterfuge: 0,
        animalKen: 0, crafts: 0, drive: 0, etiquette: 0, firearms: 0,
        larceny: 0, melee: 0, performance: 0, stealth: 0, survival: 0,
        academics: 0, computer: 0, finance: 0, investigation: 0, law: 0,
        medicine: 0, occult: 0, politics: 0, science: 0, technology: 0,
        conscience: 1, selfControl: 1, courage: 1,
        humanity: 0, willpower: 0, bloodPool: 0, experience: 0,
        backgrounds: "", disciplines: "", rituals: "", merits: "", flaws: "",
        otherTraits: "", combat: "", gear: "", history: "", appearance: "",
        personality: "", goals: "", weakness: "", ooc: ""
    };
}

function clampDot(v) {
    var n = parseInt(v, 10);
    if (!isFinite(n)) return 0;
    return Math.max(0, Math.min(5, n));
}

function clampPool(v) {
    var n = parseInt(v, 10);
    if (!isFinite(n)) return 0;
    return Math.max(0, Math.min(10, n));
}

// Valid [lo, hi] range per numeric data key, mirroring the +/- limits in
// SheetWindow.qml. Used by the service to clamp hand-edited JSON on load
// so crafted files cannot inject out-of-range values into the UI/export.
function limits() {
    var lim = {};
    var ag = attributeGroups();
    for (var g = 0; g < ag.length; g++)
        for (var j = 0; j < ag[g].keys.length; j++)
            lim[ag[g].keys[j]] = [0, 5];
    var bg = abilityGroups();
    for (var h = 0; h < bg.length; h++)
        for (var k = 0; k < bg[h].keys.length; k++)
            lim[bg[h].keys[k]] = [0, 5];
    lim["conscience"] = [0, 5];
    lim["selfControl"] = [0, 5];
    lim["courage"] = [0, 5];
    lim["humanity"] = [0, 10];
    lim["willpower"] = [0, 10];
    lim["bloodPool"] = [0, 20];
    lim["experience"] = [0, 10];
    return lim;
}

function bulletBlock(s) {
    var lines = String(s || "").split("\n");
    var out = [];
    for (var i = 0; i < lines.length; i++) {
        var t = lines[i].replace(/^\s+|\s+$/g, "");
        if (t !== "") out.push("  - " + t);
    }
    if (!out.length) out.push("  - ");
    return out.join("\n");
}

function renderText(d) {
    var L = [];
    var labels = identityLabels();
    var keys = identityKeys();
    L.push("VAMPIRE: THE MASQUERADE 20th - CHARACTER SHEET (Plain Text for LLM)");
    L.push("======================================================================");
    L.push("");
    L.push("== IDENTITY ==");
    for (var i = 0; i < keys.length; i++)
        L.push(labels[keys[i]] + ": " + (d[keys[i]] !== undefined ? d[keys[i]] : ""));
    L.push("");
    L.push("== ATTRIBUTES ==");
    var ag = attributeGroups();
    for (var g = 0; g < ag.length; g++) {
        L.push(ag[g].cat + ":");
        for (var j = 0; j < ag[g].keys.length; j++)
            L.push("  " + ag[g].labels[j] + ": " + (d[ag[g].keys[j]] || 0) + "/5");
    }
    L.push("");
    L.push("== ABILITIES ==");
    var bg = abilityGroups();
    for (var h = 0; h < bg.length; h++) {
        L.push(bg[h].cat + ":");
        for (var k = 0; k < bg[h].keys.length; k++)
            L.push("  " + bg[h].labels[k] + ": " + (d[bg[h].keys[k]] || 0) + "/5");
    }
    L.push("");
    L.push("== ADVANTAGES ==");
    var tl = textLabels();
    var order = ["backgrounds", "disciplines", "rituals", "merits", "flaws", "otherTraits"];
    for (var m = 0; m < order.length; m++) {
        L.push(tl[order[m]] + ":");
        L.push(bulletBlock(d[order[m]]));
        L.push("");
    }
    L.push("== VIRTUES / POOLS ==");
    L.push("Conscience/Conviction: " + (d.conscience !== undefined ? d.conscience : 0) + "/5");
    L.push("Self-Control/Instinct: " + (d.selfControl !== undefined ? d.selfControl : 0) + "/5");
    L.push("Courage: " + (d.courage !== undefined ? d.courage : 0) + "/5");
    L.push("Humanity/Path: " + (d.humanity !== undefined ? d.humanity : 0));
    L.push("Willpower: " + (d.willpower !== undefined ? d.willpower : 0));
    L.push("Blood Pool: " + (d.bloodPool !== undefined ? d.bloodPool : 0));
    L.push("Experience: " + (d.experience !== undefined ? d.experience : 0));
    L.push("");
    L.push("Health: [ ] Bruised, [ ] Hurt(-1), [ ] Injured(-1), [ ] Wounded(-2), [ ] Mauled(-2), [ ] Crippled(-5), [ ] Incapacitated");
    L.push("");
    L.push("== BLOOD REFERENCE ==");
    L.push("Gen 13: max 10 blood, 1/turn. Gen 12-11: 11-12 blood, 1/turn.");
    L.push("Gen 10-9: 13-14 blood, 2-3/turn. Gen 8: 15 blood, 3/turn.");
    L.push("Slashing/stabbing does lethal to vampires; sunlight/fire/aggravated is hardest to soak.");
    L.push("Frenzy: roll Self-Control/Instinct (diff per provocation). Remorse: roll Conscience/Conviction to keep Humanity.");
    L.push("");
    L.push("== COMBAT ==");
    L.push(bulletBlock(d.combat));
    L.push("");
    L.push("== DESCRIPTION / ROLEPLAY ==");
    var dk = ["gear", "history", "appearance", "personality", "goals", "weakness", "ooc"];
    for (var q = 0; q < dk.length; q++) {
        L.push(tl[dk[q]] + ":");
        L.push(bulletBlock(d[dk[q]]));
    }
    L.push("");
    L.push("== LLM INSTRUCTIONS ==");
    var nm = d.charName && String(d.charName).length ? d.charName : "this character";
    L.push("'You are the Storyteller for Vampire: The Masquerade 20th. I play " + nm + ". Use this sheet for stats. Call for rolls like Dexterity+Stealth (diff X). Track Blood Pool/Willpower/Humanity/Health. Roleplay NPCs, don't godmode my PC.'");
    L.push("======================================================================");
    return L.join("\n") + "\n";
}

// Unique per-character file name, e.g. "Elena-Marchand.txt".
function sheetFileName(d) {
    var base = d && d.charName ? String(d.charName).replace(/^\s+|\s+$/g, "") : "";
    if (base === "") base = "unnamed-vampire";
    base = base.replace(/\s+/g, "-").replace(/[^A-Za-z0-9-_]/g, "-")
               .replace(/-+/g, "-").replace(/^-+|-+$/g, "");
    if (base === "") base = "unnamed-vampire";
    if (base.length > 80) base = base.slice(0, 80);
    return base + ".txt";
}

// Parse an exported plain-text sheet back into a data object.
// Tolerant: skips unknown lines.
function parseText(text) {
    var d = defaultData();
    var warnings = [];
    var labelToIdentity = {};
    var ik = identityKeys(), il = identityLabels();
    for (var i = 0; i < ik.length; i++) labelToIdentity[il[ik[i]]] = ik[i];
    var attrMap = {};
    var ag = attributeGroups();
    for (var g = 0; g < ag.length; g++)
        for (var j = 0; j < ag[g].keys.length; j++)
            attrMap[ag[g].labels[j].toLowerCase()] = { key: ag[g].keys[j], max: 5 };
    var bg = abilityGroups();
    for (var h = 0; h < bg.length; h++)
        for (var k = 0; k < bg[h].keys.length; k++)
            attrMap[bg[h].labels[k].toLowerCase()] = { key: bg[h].keys[k], max: 5 };
    var poolMap = {};
    var pl = poolLabels();
    for (var pk in pl) poolMap[pl[pk].toLowerCase()] = pk;
    // Tolerate short aliases the renderer never writes but users type.
    poolMap["conscience"] = "conscience";
    poolMap["conviction"] = "conscience";
    poolMap["self-control"] = "selfControl";
    poolMap["self control"] = "selfControl";
    poolMap["instinct"] = "selfControl";
    poolMap["courage"] = "courage";
    poolMap["humanity"] = "humanity";
    poolMap["path"] = "humanity";
    poolMap["humanity/path"] = "humanity";
    poolMap["willpower"] = "willpower";
    poolMap["blood pool"] = "bloodPool";
    poolMap["blood"] = "bloodPool";
    poolMap["experience"] = "experience";
    poolMap["exp"] = "experience";
    var textMap = {};
    var tl = textLabels();
    for (var tk in tl) textMap[tl[tk].toLowerCase()] = tk;
    textMap["discipline"] = "disciplines";
    textMap["rituals / paths"] = "rituals";
    textMap["rituals"] = "rituals";
    textMap["paths"] = "rituals";
    textMap["other traits"] = "otherTraits";
    textMap["combat"] = "combat";
    textMap["gear / equipment"] = "gear";
    textMap["gear"] = "gear";
    textMap["clan weakness"] = "weakness";
    textMap["weakness"] = "weakness";
    textMap["ooc instructions to llm"] = "ooc";

    var lines = String(text || "").split("\n");
    var section = "";
    var currentList = null;
    for (var n = 0; n < lines.length; n++) {
        var t = lines[n].replace(/^\s+|\s+$/g, "");
        if (t === "") { currentList = null; continue; }
        if (t.indexOf("==") === 0) { section = t.toUpperCase(); currentList = null; continue; }
        var m;
        if (section.indexOf("IDENTITY") >= 0) {
            m = t.match(/^([^:]+):\s*(.*)$/);
            if (m) {
                var key = labelToIdentity[m[1].replace(/^\s+|\s+$/g, "")];
                if (key) d[key] = m[2].replace(/^\s+|\s+$/g, "");
            }
            continue;
        }
        if (section.indexOf("ATTRIBUTES") >= 0 || section.indexOf("ABILITIES") >= 0) {
            m = t.match(/^(.+?):\s*(\d+)\s*\/\s*5\s*$/);
            if (m) {
                var spec = attrMap[m[1].replace(/^\s+|\s+$/g, "").toLowerCase()];
                if (spec) {
                    var v = parseInt(m[2], 10);
                    d[spec.key] = Math.max(0, Math.min(spec.max, isFinite(v) ? v : 0));
                }
            }
            continue;
        }
        if (section.indexOf("VIRTUES") >= 0 || section.indexOf("POOLS") >= 0) {
            m = t.match(/^([^:]+):\s*(\d+)/);
            if (m) {
                var pk2 = poolMap[m[1].replace(/^\s+|\s+$/g, "").toLowerCase()];
                if (pk2) {
                    var v2 = parseInt(m[2], 10);
                    var mx = (pk2 === "bloodPool") ? 20 : (pk2 === "conscience" || pk2 === "selfControl" || pk2 === "courage") ? 5 : 10;
                    d[pk2] = Math.max(0, Math.min(mx, isFinite(v2) ? v2 : 0));
                }
            }
            continue;
        }
        if (section.indexOf("ADVANTAGES") >= 0 || section.indexOf("DESCRIPTION") >= 0 || section.indexOf("COMBAT") >= 0) {
            if (section.indexOf("COMBAT") >= 0 && currentList === null) currentList = "combat";
            m = t.match(/^([^:]+):\s*(.*)$/);
            if (m && textMap[m[1].replace(/^\s+|\s+$/g, "").toLowerCase()] !== undefined) {
                currentList = textMap[m[1].replace(/^\s+|\s+$/g, "").toLowerCase()];
                d[currentList] = m[2].replace(/^\s+|\s+$/g, "");
                continue;
            }
            if (currentList) {
                var b = t.match(/^-\s?(.*)$/);
                if (b) {
                    if (d[currentList] !== "") d[currentList] += "\n";
                    d[currentList] += b[1];
                }
            }
            continue;
        }
    }
    var tks = textKeys();
    for (var q = 0; q < tks.length; q++) {
        var parts = String(d[tks[q]] || "").split("\n");
        var kept = [];
        for (var r = 0; r < parts.length; r++) {
            var pv = parts[r].replace(/^\s+|\s+$/g, "");
            if (pv !== "" && pv !== "-") kept.push(pv);
        }
        d[tks[q]] = kept.join("\n");
    }
    if ((d.charName || "") === "") warnings.push("No character name found — check the file is an exported sheet.");
    return { data: d, warnings: warnings };
}
