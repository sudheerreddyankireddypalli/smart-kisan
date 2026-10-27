package com.smartkisan.app.domain.ai

import com.smartkisan.app.data.model.CropDiagnosisResult

object CropDoctorEngine {

    private val knowledgeBase = listOf(
        // Chilli Diseases
        CropDiagnosisResult(
            cropName = "Chilli (మిరప)",
            diseaseNameEn = "Chilli Leaf Curl Virus (Begomovirus)",
            diseaseNameTe = "మిరప ఆకు ముడత తెగులు",
            pathogenType = "Viral Pathogen (Vector: Whitefly / తెల్లదోమ)",
            confidencePercent = 94,
            severity = "HIGH (తీవ్రమైనది)",
            symptomsTe = "ఆకుల అంచులు పైకి ముడుచుకుపోవడం, ఈనెలు గరుకుగా మారడం, పూత పిందె రాలిపోవడం మరియు మొక్క గిడసబారిపోవడం.",
            symptomsEn = "Upward curling of leaves, puckering of veins, flower bud drop and stunted plant stature.",
            organicTreatmentTe = "లీటరు నీటికి 5 మి.లీ వేప నూనె (10,000 ppm) కలిపి పిచికారీ చేయండి. తెల్లదోమల నివారణకు ఎకరానికి 15-20 పసుపు రంగు జిగురు అట్టలు (Yellow Sticky Traps) అమర్చండి.",
            chemicalTreatmentTe = "రసాయనిక నివారణకు లీటరు నీటికి 1.25 గ్రాముల డయాఫెంతియురాన్ 50% WP (Diafenthiuron) లేదా 0.2 గ్రాముల ఎసిటామిప్రిడ్ 20% SP కలిపి మొక్కలన్నింటికీ తడిచేలా పిచికారీ చేయండి.",
            dosagePerAcre = "ఎకరానికి 200 లీటర్ల నీటిలో 250 గ్రాముల మందు",
            safetyWithholdingDays = 7,
            voiceAdvisoryTe = "రైతు సోదరులకు నమస్కారం. మీ మిరప పంటలో ఆకు ముడత తెగులు గుర్తించబడింది. ఇది తెల్లదోమ ద్వారా వ్యాపిస్తుంది. వెంటనే ఎకరానికి ఇరవై పసుపు జిగురు అట్టలు అమర్చండి. రసాయనిక నివారణకు లీటరు నీటికి ఒక గ్రాము డయాఫెంతియురాన్ కలిపి పిచికారీ చేయండి."
        ),
        CropDiagnosisResult(
            cropName = "Chilli (మిరప)",
            diseaseNameEn = "Anthracnose / Fruit Rot (Colletotrichum)",
            diseaseNameTe = "మిరప కాయ కుళ్లు మరియు కొమ్మ ఎండు తెగులు",
            pathogenType = "Fungal Spores (శిలీంధ్రం)",
            confidencePercent = 91,
            severity = "MODERATE (మధ్యస్థం)",
            symptomsTe = "పండిన కాయలపై నల్లటి గుండ్రని మచ్చలు, కొమ్మలు పైనుండి క్రిందికి ఎండుకుపోవడం.",
            symptomsEn = "Circular sunken black spots on ripe fruits, tip dieback of branches from top downwards.",
            organicTreatmentTe = "ట్రైకోడెర్మా విరిడే (Trichoderma viride) 2.5 కిలోలు ఎకరానికి తగినంత పశువుల ఎరువుతో కలిపి మొదళ్ల వద్ద వేయండి.",
            chemicalTreatmentTe = "అజోక్సిస్ట్రోబిన్ + డైఫెనోకోనజోల్ (Amistar Top) 1 మి.లీ లేదా కాపర్ ఆక్సిక్లోరైడ్ 3 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి.",
            dosagePerAcre = "ఎకరానికి 200 లీటర్ల నీటిలో 200 మి.లీ అమృత్ స్టార్ టాప్",
            safetyWithholdingDays = 10,
            voiceAdvisoryTe = "మీ మిరప పంటలో కాయ కుళ్లు తెగులు లక్షణాలు ఉన్నాయి. శిలీంధ్ర వ్యాప్తిని అరికట్టడానికి లీటరు నీటికి ఒక మిల్లీలీటరు అజోక్సిస్ట్రోబిన్ కలిపి కొమ్మలు, కాయలు పూర్తిగా తడిచేలా పిచికారీ చేయండి."
        ),

        // Cotton Diseases
        CropDiagnosisResult(
            cropName = "Cotton (పత్తి)",
            diseaseNameEn = "Pink Bollworm (Pectinophora gossypiella)",
            diseaseNameTe = "పత్తి గులాబీ రంగు కాయ తొలుచు పురుగు",
            pathogenType = "Lepidopteran Insect Pest",
            confidencePercent = 96,
            severity = "CRITICAL (చాలా తీవ్రం)",
            symptomsTe = "పువ్వులు రోజెట్ (ముడుచుకున్న రూపం) ఆకారంలో మారడం, కాయలపై చిన్న రంధ్రాలు మరియు దూది నాణ్యత దెబ్బతినడం.",
            symptomsEn = "Rosette flower symptoms, entry holes on green bolls, premature boll opening with stained lint.",
            organicTreatmentTe = "ఎకరానికి 8 నుండి 10 లింగాకర్షక బుట్టలు (Pheromone Traps) అమర్చి పురుగు ఉధృతిని గమనించండి. వేప గింజల కషాయం 5% పిచికారీ చేయండి.",
            chemicalTreatmentTe = "ప్రొఫెనోఫాస్ 50% EC 2 మి.లీ లేదా ఇమామెక్టిన్ బెంజోయేట్ 5% SG 0.5 గ్రాములు లీటరు నీటికి కలిపి సాయంత్రం వేళల్లో పిచికారీ చేయండి.",
            dosagePerAcre = "ఎకరానికి 100 గ్రాముల ఇమామెక్టిన్ బెంజోయేట్ 200 లీటర్ల నీటిలో",
            safetyWithholdingDays = 14,
            voiceAdvisoryTe = "రైతు గారూ, మీ పత్తి పంటలో గులాబీ రంగు కాయ తొలుచు పురుగు ఉధృతి కనిపిస్తోంది. వెంటనే పొలంలో లింగాకర్షక బుట్టలు అమర్చండి. లీటరు నీటికి అర గ్రాము ఇమామెక్టిన్ బెంజోయేట్ కలిపి సాయంత్రం వేళ పిచికారీ చేయండి."
        ),

        // Paddy Diseases
        CropDiagnosisResult(
            cropName = "Paddy (వరి)",
            diseaseNameEn = "Rice Blast (Pyricularia oryzae)",
            diseaseNameTe = "వరి అగ్గి తెగులు / మెడ విరుపు తెగులు",
            pathogenType = "Fungal Infection",
            confidencePercent = 95,
            severity = "HIGH (తీవ్రం)",
            symptomsTe = "ఆకులపై కంటి ఆకారపు (Spindle-shaped) బూడిద రంగు మచ్చలు, వెన్ను మెడ వద్ద నల్లబడి విరిగిపోవడం.",
            symptomsEn = "Spindle-shaped lesions with grey center and brown margins on leaves, neck breaking at panicle base.",
            organicTreatmentTe = "సూడోమోనాస్ ఫ్లోరోసెన్స్ (Pseudomonas fluorescens) 10 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి.",
            chemicalTreatmentTe = "ట్రైసైక్లాజోల్ 75% WP (Baan / Beam) 0.6 గ్రాములు లేదా ఐసోప్రోథియోలేన్ 1.5 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి.",
            dosagePerAcre = "ఎకరానికి 120 గ్రాముల ట్రైసైక్లాజోల్ 200 లీటర్ల నీటిలో",
            safetyWithholdingDays = 15,
            voiceAdvisoryTe = "మీ వరి పంటలో అగ్గి తెగులు లక్షణాలు నిర్ధారించబడ్డాయి. అధిక నత్రజని వాడకాన్ని తగ్గించండి. వెంటనే లీటరు నీటికి సున్నా పాయింట్ ఆరు గ్రాముల ట్రైసైక్లాజోల్ కలిపి పిచికారీ చేయండి."
        ),
        CropDiagnosisResult(
            cropName = "Paddy (వరి)",
            diseaseNameEn = "Brown Planthopper / BPH (Nilaparvata lugens)",
            diseaseNameTe = "వరి సుడి దోమ",
            pathogenType = "Sap Sucking Insect Pest",
            confidencePercent = 92,
            severity = "HIGH (తీవ్రం)",
            symptomsTe = "దుబ్బుల మొదళ్ల వద్ద దోమ గుంపులుగా చేరి రసం పీల్చడం వల్ల పైరు సుడులు సుడులుగా ఎండిపోవడం (Hopper Burn).",
            symptomsEn = "Circular patches of dry brown plants in the field (hopper burn) caused by sap sucking nymphs at base.",
            organicTreatmentTe = "ఎండ కట్టబెట్టడం (మట్టలు తీసి నీటిని తొలగించి గాలి తగిలేలా చేయడం). వేప నూనె 5 మి.లీ లీటరు నీటికి వాడండి.",
            chemicalTreatmentTe = "పైమెట్రోజైన్ 50% WDG (Chess) 0.6 గ్రాములు లేదా ట్రైఫ్లూమిజోపైరిమ్ 10% SC (Pexalon) 0.5 మి.లీ లీటరు నీటికి కలిపి పిచికారీ చేయండి. మందు మొదళ్లకు తగిలేలా పిచికారీ ముఖ్యం.",
            dosagePerAcre = "ఎకరానికి 94 మి.లీ పెక్సలాన్ 200 లీటర్ల నీటిలో",
            safetyWithholdingDays = 21,
            voiceAdvisoryTe = "వరిలో సుడిదోమ ఆశించింది. పొలంలో నీటిని తీసివేసి పైరుకు గాలి తగిలేలా పాయలు తీయండి. లీటరు నీటికి సున్నా పాయింట్ ఐదు మిల్లీలీటర్ల పెక్సలాన్ కలిపి మొక్కల మొదళ్లు బాగా తడిచేలా పిచికారీ చేయండి."
        ),

        // Maize Diseases
        CropDiagnosisResult(
            cropName = "Maize (మొక్కజొన్న)",
            diseaseNameEn = "Fall Armyworm (Spodoptera frugiperda)",
            diseaseNameTe = "మొక్కజొన్న కత్తెర పురుగు",
            pathogenType = "Invasive Lepidopteran Pest",
            confidencePercent = 97,
            severity = "CRITICAL (చాలా తీవ్రం)",
            symptomsTe = "సుడిలో ఆకులను కత్తిరించినట్లు తినడం, విసర్జిత చెత్త సుడిలో కనిపించడం, ఆకులపై వరుస రంధ్రాలు.",
            symptomsEn = "Shot-hole feeding damage in whorl, copious sawdust-like frass inside the central funnel.",
            organicTreatmentTe = "సుడులలో వేప పిండి లేదా ఇసుక వేయడం. బెవేరియా బాసియానా (Beauveria bassiana) 5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి.",
            chemicalTreatmentTe = "క్లోరాంట్రానిలిప్రోల్ 18.5% SC (Coragen) 0.4 మి.లీ లేదా స్పైనటోరమ్ 11.7% SC (Delegate) 0.5 మి.లీ లీటరు నీటికి కలిపి సుడిలో పడేలా పిచికారీ చేయండి.",
            dosagePerAcre = "ఎకరానికి 80 మి.లీ కోరాజెన్ 200 లీటర్ల నీటిలో",
            safetyWithholdingDays = 14,
            voiceAdvisoryTe = "మొక్కజొన్నలో కత్తెర పురుగు ఉధృతి ఉంది. పిచికారీ ద్రావణం నేరుగా సుడిలో పడేలా జాగ్రత్త వహించండి. లీటరు నీటికి సున్నా పాయింట్ నాలుగు మిల్లీలీటర్ల కోరాజెన్ కలిపి పిచికారీ చేయండి."
        )
    )

    fun diagnose(cropNameFilter: String? = null, queryKeywords: String? = null): CropDiagnosisResult {
        val matches = if (!cropNameFilter.isNullOrBlank()) {
            knowledgeBase.filter { it.cropName.contains(cropNameFilter, ignoreCase = true) }
        } else {
            knowledgeBase
        }

        if (!queryKeywords.isNullOrBlank()) {
            val keywordMatch = matches.firstOrNull {
                it.diseaseNameEn.contains(queryKeywords, ignoreCase = true) ||
                it.diseaseNameTe.contains(queryKeywords, ignoreCase = true) ||
                it.symptomsTe.contains(queryKeywords, ignoreCase = true)
            }
            if (keywordMatch != null) return keywordMatch
        }

        return matches.firstOrNull() ?: knowledgeBase.first()
    }

    fun getAllDiagnosableCrops(): List<String> {
        return knowledgeBase.map { it.cropName }.distinct()
    }

    fun getDiseasesForCrop(cropName: String): List<CropDiagnosisResult> {
        return knowledgeBase.filter { it.cropName.contains(cropName, ignoreCase = true) }
    }
}
