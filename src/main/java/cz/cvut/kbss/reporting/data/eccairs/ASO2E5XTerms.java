/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.cvut.kbss.reporting.data.eccairs;

import cz.cvut.kbss.reporting.model.Vocabulary;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author Bogdan Kostov <bogdan.kostov@fel.cvut.cz>
 */
public class ASO2E5XTerms {
    protected Map<String,String> map = new HashMap<>();

    public ASO2E5XTerms() {
    }
    
    private void initMapping(){
        // entities
        map.put(Vocabulary.s_c_occurrence_report, "Occurrence");
        map.put(Vocabulary.s_c_Aerodrome, "Aerodrome_General");
        map.put(Vocabulary.s_c_Airspace, "Air_Space");
// TODO        map.put(Vocabulary.s_c_Air_, "Air_Navigation_Service");
        map.put(Vocabulary.s_c_Event, "Events");
        map.put(Vocabulary.s_c_Aircraft, "Aircraft");
// TODO        map.put(Vocabulary.s_c_Doc, "Reporting_History");

        // attributes
        // for occurrence
        map.put(Vocabulary.s_c_Aircraft, "ATM_Contribution");
        map.put(Vocabulary.s_c_Aircraft, "Occurrence_Category");
        map.put(Vocabulary.s_c_Aircraft, "Occurrence_Class");
//        map.put(Vocabulary.s_c_, "Highest_Damage");
    }
}
