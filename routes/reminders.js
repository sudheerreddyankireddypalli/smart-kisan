/**
 * Smart Kisan - Crop-Stage Reminders
 * Data-driven agricultural guidance based on days elapsed since planting.
 * Strict ethical adherence: general agronomic cultural practices only,
 * absolutely no medical-style or specific pesticide prescriptions.
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalAuth } = require('../middleware/auth');

const DISCLAIMER = {
    te: 'సాధారణ మార్గదర్శకత్వం మాత్రమే: వాతావరణ పరిస్థితులు మరియు నేల రకాన్ని బట్టి పద్ధతులు మారవచ్చు. ఎరువులు లేదా రసాయనాల వినియోగానికి ముందు మీ స్థానిక మండల వ్యవసాయ అధికారి (AEO/AO) లేదా విశ్వవిద్యాలయ శాస్త్రవేత్తలను సంప్రదించండి.',
    en: 'General guidance only: Cultural practices vary with local climate and soil conditions. Always consult your local agricultural extension officer (AO/AEO) or university advisory before fertilizer or chemical applications.'
};

const CROP_CALENDARS = {
    'turmeric': {
        crop_en: 'Turmeric',
        crop_te: 'పసుపు',
        stages: [
            {
                min_days: 0,
                max_days: 15,
                stage_name_en: 'Rhizome Planting & Bed Preparation',
                stage_name_te: 'నాటు మరియు బెడ్ తయారీ దశ',
                guidance_te: 'ఎత్తైన మడులు (Raised beds) తయారుచేసుకోవాలి. విత్తన కొమ్ములను చీడపీడలు లేని ఆరోగ్యకరమైన వాటిని ఎంచుకోవాలి. తేలికపాటి తడి అందించాలి; నీరు నిలవకుండా డ్రైనేజీ వసతి ఉండాలి.',
                guidance_en: 'Prepare raised beds for proper drainage. Use healthy, pest-free seed rhizomes. Ensure light initial irrigation; avoid waterlogging at all costs.'
            },
            {
                min_days: 16,
                max_days: 35,
                stage_name_en: 'Sprouting & First Intercultivation',
                stage_name_te: 'మొలక మరియు మొదటి అంతరకృషి',
                guidance_te: 'మొలకలు 70-80% వరకు వస్తాయి. మొదటి కలుపు తీత చేపట్టాలి. పచ్చిరొట్ట లేదా ఎండుటాకులతో మల్చింగ్ (Mulching) వేస్తే తేమ ఆరిపోకుండా ఉంటుంది.',
                guidance_en: 'Sprouting reaches 70-80%. Conduct first weeding. Apply organic green mulch or straw to conserve soil moisture and prevent weed flushes.'
            },
            {
                min_days: 36,
                max_days: 60,
                stage_name_en: 'Vegetative Growth & Earthing Up',
                stage_name_te: 'శాకీయ ఎదుగుదల & మొదళ్లకు మట్టి ఎగదోయడం',
                guidance_te: 'మొక్కలు బాగా వేళ్లూనుకుంటాయి. రెండవ కలుపు తీసి, మొక్కల మొదళ్లకు మట్టి ఎగదోయాలి (Earthing-up). సేంద్రీయ ఎరువులు అందించడానికి అనుకూల సమయం.',
                guidance_en: 'Plants develop robust root systems. Perform second intercultivation and earthing up to support rhizome formation. Incorporate organic manure.'
            },
            {
                min_days: 61,
                max_days: 90,
                stage_name_en: 'Tiller Development & Nutrient Management',
                stage_name_te: 'పిలకల అభివృద్ధి & పోషక యాజమాన్యం',
                guidance_te: 'పిలకల సంఖ్య పెరుగుతుంది. నేలలో తగినంత తేమ ఉండేలా చూసుకోవాలి. ఆకుమచ్చ మరియు కాండం తొలిచే పురుగుల లక్షణాలను క్రమం తప్పకుండా గమనించాలి.',
                guidance_en: 'Tillering increases. Maintain consistent soil moisture. Regularly inspect crop for leaf spot or stem borer symptoms with cultural traps.'
            },
            {
                min_days: 91,
                max_days: 135,
                stage_name_en: 'Rhizome Development & Bulking',
                stage_name_te: 'కొమ్ముల ఊరడం & అభివృద్ధి దశ',
                guidance_te: 'కొమ్ములు లావు ఎక్కే ప్రధాన దశ. నీటి ఎద్దడి రాకుండా 7-10 రోజుల వ్యవధిలో తేలికపాటి నీటిపారుదల అందించాలి. నీరు నిల్వ ఉంటే దుంపకుళ్లు తెగులు వచ్చే ప్రమాదం ఉంది.',
                guidance_en: 'Critical rhizome bulking phase. Provide light irrigations every 7-10 days. Avoid prolonged stagnant water to protect against rhizome rot.'
            },
            {
                min_days: 136,
                max_days: 200,
                stage_name_en: 'Late Bulking & Curcumin Accumulation',
                stage_name_te: 'చివరి ఎదుగుదల & కొమ్ముల పరిపక్వత',
                guidance_te: 'కొమ్ముల్లో రంగు మరియు గుణం పెరుగుతాయి. కలుపు లేకుండా చూసుకోవాలి. నేల గట్టిపడకుండా తేమను సమతుల్యంగా ఉంచాలి.',
                guidance_en: 'Curcumin accumulation occurs. Keep field weed-free and avoid sudden soil drying. Maintain gentle drainage channels.'
            },
            {
                min_days: 201,
                max_days: 260,
                stage_name_en: 'Maturity & Pre-Harvest Preparation',
                stage_name_te: 'పంట పరిపక్వత & కోత సన్నాహాలు',
                guidance_te: 'ఆకులు పసుపు రంగులోకి మారి ఎండిపోతాయి. కోతకు 10-15 రోజుల ముందు నీరు పెట్టడం పూర్తిగా నిలిపివేయాలి. కొమ్ములకు గాయాలు కాకుండా జాగ్రత్తగా తవ్వాలి.',
                guidance_en: 'Leaves turn dry and yellowish. Stop irrigation completely 10-15 days prior to harvest. Dig rhizomes carefully without inflicting wounds.'
            }
        ]
    },
    'paddy': {
        crop_en: 'Rice / Paddy',
        crop_te: 'వరి',
        stages: [
            {
                min_days: 0,
                max_days: 25,
                stage_name_en: 'Nursery & Transplanting',
                stage_name_te: 'నారుమడి మరియు నాట్లు వేసే దశ',
                guidance_te: 'ఆరోగ్యకరమైన 20-25 రోజుల నారును ఎంచుకొని చదరపు మీటరుకు సరిపడా గుబుర్లు నాటాలి. నిలకడగా 2 సెం.మీ నీరు ఉంచాలి.',
                guidance_en: 'Transplant healthy 20-25 day seedlings with recommended spacing. Maintain shallow standing water (2 cm).'
            },
            {
                min_days: 26,
                max_days: 50,
                stage_name_en: 'Active Tillering Stage',
                stage_name_te: 'పిలకలు పెట్టే దశ',
                guidance_te: 'కలుపు నివారణ చర్యలు చేపట్టాలి. పిలకలు ఎక్కువగా రావడానికి ప్రత్యామ్నాయ తడి మరియు ఆరబెట్టే (AWD) పద్ధతి పాటించవచ్చు.',
                guidance_en: 'Control weeds. Alternate wetting and drying (AWD) can stimulate productive tillering and root vigor.'
            },
            {
                min_days: 51,
                max_days: 75,
                stage_name_en: 'Panicle Initiation & Booting',
                stage_name_te: 'చిరుపొట్ట మరియు వెన్ను బయటకు వచ్చే దశ',
                guidance_te: 'ఈ దశలో నీటి ఎద్దడి అస్సలు రానివ్వకూడదు. ఎల్లప్పుడూ 3-5 సెం.మీ నీరు ఉండేలా చూడాలి. కాండం తొలిచే పురుగును గమనించాలి.',
                guidance_en: 'Crucial moisture stage: keep 3-5 cm standing water continuously. Inspect for stem borer or leaf folder symptoms.'
            },
            {
                min_days: 76,
                max_days: 105,
                stage_name_en: 'Flowering & Grain Filling',
                stage_name_te: 'పూత మరియు పాలుపోసుకునే దశ',
                guidance_te: 'గింజలో పాలు పోసుకునే సమయం. తేమ నిలకడగా ఉండాలి. బలమైన గాలుల నుండి జాగ్రత్త పడాలి.',
                guidance_en: 'Grain milky to dough stage. Maintain steady moisture. Monitor for blast or false smut on panicles.'
            },
            {
                min_days: 106,
                max_days: 135,
                stage_name_en: 'Ripening & Harvesting',
                stage_name_te: 'పంట కోత మరియు నూర్పిడి దశ',
                guidance_te: '85% వెన్నులు బంగారు రంగులోకి వచ్చినప్పుడు కోత చేపట్టాలి. కోతకు వారం రోజుల ముందు నీటిని తీసివేయాలి.',
                guidance_en: 'Harvest when 85-90% panicles turn golden straw yellow. Drain field 7-10 days before mechanical harvest.'
            }
        ]
    },
    'cotton': {
        crop_en: 'Cotton',
        crop_te: 'పత్తి',
        stages: [
            {
                min_days: 0,
                max_days: 25,
                stage_name_en: 'Germination & Seedling',
                stage_name_te: 'మొలక & మొలక ఎదుగుదల దశ',
                guidance_te: 'చీడపీడలు లేని విత్తనం నాటాలి. ఒత్తుగా ఉన్న మొక్కలను తీసివేసి (Thinning) చదరపు మీటరుకు సిఫార్సు చేసిన మొక్కల సంఖ్యను ఉంచాలి.',
                guidance_en: 'Ensure optimum plant population by thinning excess seedlings within 15 days of germination.'
            },
            {
                min_days: 26,
                max_days: 60,
                stage_name_en: 'Vegetative & Square Formation',
                stage_name_te: 'శాకీయ దశ & పూమొగ్గ (స్క్వేర్) దశ',
                guidance_te: 'మొదటి గుంటుక లేదా అంతరకృషి ద్వారా కలుపు తీసి మట్టిని వదులు చేయాలి. రసం పీల్చే పురుగుల ఉధృతిని పసుపు జిగురు బోర్డులతో గమనించాలి.',
                guidance_en: 'Intercultivate to loosen soil and manage weeds. Install yellow and blue sticky traps to monitor sucking pests.'
            },
            {
                min_days: 61,
                max_days: 100,
                stage_name_en: 'Peak Flowering & Boll Development',
                stage_name_te: 'పూత & కాయ తయారయ్యే దశ',
                guidance_te: 'పూత మరియు పిందె రాలకుండా తేమ సమతుల్యతను కాపాడాలి. వర్షపు నీరు నిలవకుండా డ్రైనేజీ చూడాలి.',
                guidance_en: 'Avoid moisture stress during peak flowering. Provide drainage after heavy monsoon showers.'
            },
            {
                min_days: 101,
                max_days: 160,
                stage_name_en: 'Boll Bursting & Picking',
                stage_name_te: 'కాయలు పగలడం & పత్తి ఏరడం',
                guidance_te: 'బాగా విచ్చుకున్న కాయలను ఎండ ఉన్నప్పుడు తెల్లవారుజాము మంచు ఆరిన తర్వాత మాత్రమే ఏరాలి. రాలిపడిన ఎండిన ఆకులు చేరకుండా జాగ్రత్త వహించాలి.',
                guidance_en: 'Pick clean, fully opened bolls when morning dew has evaporated. Store in dry, clean bags to prevent discoloration.'
            }
        ]
    },
    'chilli': {
        crop_en: 'Red Chilli',
        crop_te: 'ఎర్ర మిరప',
        stages: [
            {
                min_days: 0,
                max_days: 30,
                stage_name_en: 'Transplanting & Establishment',
                stage_name_te: 'నాట్లు వేయడం & వేరు వ్యవస్థ పాదుకొనే దశ',
                guidance_te: 'బోదెలు మరియు కాలువల పద్ధతిలో ఆరోగ్యకరమైన నారు నాటుకోవాలి. నీరు నిలబడకుండా జాగ్రత్త పడాలి.',
                guidance_en: 'Transplant 35-40 day seedlings on ridges. Protect against early damping-off with proper drainage.'
            },
            {
                min_days: 31,
                max_days: 65,
                stage_name_en: 'Branching & Flower Induction',
                stage_name_te: 'కొమ్మల విభజన & పూత ప్రారంభం',
                guidance_te: 'అంతరకృషి చేపట్టి మొదళ్లకు మట్టి ఎగదోయాలి. తామర పురుగులు (Thrips) మరియు నల్లి నివారణకు సాంస్కృతిక పద్ధతులు పాటించాలి.',
                guidance_en: 'Intercultivate and earth up plants. Use blue sticky traps to monitor thrips and mites.'
            },
            {
                min_days: 66,
                max_days: 110,
                stage_name_en: 'Fruit Set & Pod Development',
                stage_name_te: 'కాయలు పిందె కట్టడం & ఎదుగుదల',
                guidance_te: 'కాయలు రంగు మారడానికి మరియు నాణ్యతకు క్రమం తప్పని తేమ అవసరం. నీటి ఎద్దడి వల్ల పూత రాలే అవకాశం ఉంది.',
                guidance_en: 'Consistent irrigation schedule prevents blossom-end rot and premature flower drop.'
            },
            {
                min_days: 111,
                max_days: 170,
                stage_name_en: 'Harvesting & Drying',
                stage_name_te: 'కాయల కోత & ఆరబెట్టడం',
                guidance_te: 'పూర్తిగా ఎరుపు రంగుకు మారిన కాయలను మాత్రమే కోయాలి. పరిశుభ్రమైన టార్పాలిన్ లేదా సిమెంట్ కల్లాలపై ఆరబెట్టాలి.',
                guidance_en: 'Pick well-ripened deep red pods. Sun-dry on clean tarpaulins to prevent fungal contamination and aflatoxin.'
            }
        ]
    }
};

/**
 * GET /api/reminders
 * Returns general guidance calendar matched to farmer's active cycles.
 */
router.get('/', async (req, res) => {
    try {
        let activeCycles = [];
        if (req.user) {
            const result = await db.query(
                `SELECT id, crop_name, crop_name_te, start_date, area_acres, status
                 FROM cycles
                 WHERE user_id = $1 AND status = 'active'
                 ORDER BY start_date DESC`,
                [req.user.id]
            );
            activeCycles = result.rows;
        }

        const now = new Date();
        const cycleReminders = [];

        for (const cycle of activeCycles) {
            const startDate = new Date(cycle.start_date);
            const daysElapsed = Math.max(0, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));

            // Find matching calendar
            const cropKey = Object.keys(CROP_CALENDARS).find(k =>
                cycle.crop_name.toLowerCase().includes(k) ||
                (cycle.crop_name_te && cycle.crop_name_te.includes(CROP_CALENDARS[k].crop_te))
            ) || 'turmeric';

            const calendar = CROP_CALENDARS[cropKey];
            const currentStage = calendar.stages.find(s => daysElapsed >= s.min_days && daysElapsed <= s.max_days)
                || calendar.stages[calendar.stages.length - 1];

            const upcomingStages = calendar.stages.filter(s => s.min_days > daysElapsed);

            cycleReminders.push({
                cycle_id: cycle.id,
                crop_name: cycle.crop_name,
                crop_name_te: cycle.crop_name_te,
                start_date: cycle.start_date,
                days_elapsed: daysElapsed,
                current_stage: currentStage,
                upcoming_stages: upcomingStages
            });
        }

        return res.json({
            disclaimer: DISCLAIMER,
            active_cycles_reminders: cycleReminders,
            all_calendars: CROP_CALENDARS
        });
    } catch (err) {
        console.error('Error in reminders service:', err);
        return res.status(500).json({
            error: 'SERVICE_ERROR',
            message: 'గుర్తుంపుల సమాచారం పొందడంలో లోపం / Failed to get crop reminders.'
        });
    }
});

module.exports = router;
