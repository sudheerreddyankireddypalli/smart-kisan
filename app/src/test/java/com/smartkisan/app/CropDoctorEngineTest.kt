package com.smartkisan.app

import com.smartkisan.app.domain.ai.CropDoctorEngine
import org.junit.Assert.*
import org.junit.Test

class CropDoctorEngineTest {

    @Test
    fun `test all diagnosable crops are available in knowledge base`() {
        val crops = CropDoctorEngine.getAllDiagnosableCrops()
        assertTrue(crops.isNotEmpty())
        assertTrue(crops.any { it.contains("Chilli") })
        assertTrue(crops.any { it.contains("Cotton") })
        assertTrue(crops.any { it.contains("Paddy") })
        assertTrue(crops.any { it.contains("Maize") })
    }

    @Test
    fun `test chilli leaf curl diagnosis provides accurate confidence and voice advisory`() {
        val diagnosis = CropDoctorEngine.diagnose(cropNameFilter = "Chilli", queryKeywords = "Leaf Curl")

        assertNotNull(diagnosis)
        assertEquals("Chilli (మిరప)", diagnosis.cropName)
        assertTrue(diagnosis.diseaseNameEn.contains("Leaf Curl"))
        assertTrue(diagnosis.diseaseNameTe.contains("ముడత"))
        assertTrue("Confidence must be at least 90%", diagnosis.confidencePercent >= 90)
        assertTrue(diagnosis.dosagePerAcre.isNotBlank())
        assertTrue(diagnosis.safetyWithholdingDays > 0)

        // Telugu voice advisory must be non-empty and farmer actionable
        assertTrue(diagnosis.voiceAdvisoryTe.isNotBlank())
        assertTrue(diagnosis.voiceAdvisoryTe.contains("రైతు"))
    }

    @Test
    fun `test cotton pink bollworm has critical severity and organic pheromone traps recommendation`() {
        val diagnosis = CropDoctorEngine.diagnose(cropNameFilter = "Cotton")

        assertEquals("Cotton (పత్తి)", diagnosis.cropName)
        assertTrue(diagnosis.diseaseNameEn.contains("Pink Bollworm"))
        assertTrue(diagnosis.severity.contains("CRITICAL"))
        assertTrue(diagnosis.organicTreatmentTe.contains("లింగాకర్షక బుట్టలు"))
        assertTrue(diagnosis.chemicalTreatmentTe.isNotBlank())
    }

    @Test
    fun `test paddy blast and BPH diagnoses can be retrieved`() {
        val paddyDiseases = CropDoctorEngine.getDiseasesForCrop("Paddy")
        assertTrue("Paddy must have multiple diagnosed conditions", paddyDiseases.size >= 2)

        val blast = paddyDiseases.firstOrNull { it.diseaseNameEn.contains("Blast") }
        assertNotNull(blast)
        assertTrue(blast!!.symptomsTe.contains("కంటి ఆకారపు"))

        val bph = paddyDiseases.firstOrNull { it.diseaseNameEn.contains("BPH") || it.diseaseNameEn.contains("Planthopper") }
        assertNotNull(bph)
        assertTrue(bph!!.diseaseNameTe.contains("సుడి దోమ"))
    }

    @Test
    fun `test maize fall armyworm diagnosis includes proper whorl application instructions`() {
        val diagnosis = CropDoctorEngine.diagnose(cropNameFilter = "Maize")

        assertEquals("Maize (మొక్కజొన్న)", diagnosis.cropName)
        assertTrue(diagnosis.diseaseNameEn.contains("Fall Armyworm"))
        assertTrue(diagnosis.symptomsTe.contains("సుడి"))
        assertTrue(diagnosis.voiceAdvisoryTe.contains("మొక్కజొన్న"))
    }

    @Test
    fun `test every diagnosis item has complete treatment protocol and valid voice advisory`() {
        val crops = CropDoctorEngine.getAllDiagnosableCrops()
        for (crop in crops) {
            val diseases = CropDoctorEngine.getDiseasesForCrop(crop)
            for (disease in diseases) {
                assertTrue(disease.diseaseNameEn.isNotBlank())
                assertTrue(disease.diseaseNameTe.isNotBlank())
                assertTrue(disease.organicTreatmentTe.isNotBlank())
                assertTrue(disease.chemicalTreatmentTe.isNotBlank())
                assertTrue(disease.dosagePerAcre.isNotBlank())
                assertTrue("Safety withholding days must be > 0", disease.safetyWithholdingDays > 0)
                assertTrue("Voice advisory must be rich Telugu text", disease.voiceAdvisoryTe.length >= 30)
            }
        }
    }
}
