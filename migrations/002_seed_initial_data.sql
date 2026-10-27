-- Migration 002: Seed Initial Agricultural Data
-- Initial service providers (Drone, Labour, Machinery, Transport) and verified buyer offers

INSERT INTO providers (name, service_type, area, state, district, phone, quote_rate, rating, is_verified)
VALUES
    ('రైతు డ్రోన్ సర్వీసెస్ (Raithu Drone Spraying)', 'drone', 'నిజామాబాద్ & పరిసర ప్రాంతాలు (Nizamabad)', 'Telangana', 'Nizamabad', '9848012345', '₹450 / ఎకరా (Acre)', 4.9, true),
    ('శ్రీ లక్ష్మి హార్వెస్టర్ & ట్రాక్టర్ (Sri Lakshmi Harvesters)', 'machinery', 'వరంగల్ రూరల్ & అర్బన్ (Warangal)', 'Telangana', 'Warangal', '9848023456', '₹1,400 / గంట (Hour)', 4.8, true),
    ('కృషి రవాణా సర్వీస్ (Krishi Agri Transport)', 'transport', 'గుంటూరు మిర్చి యార్డ్ మార్గం (Guntur)', 'Andhra Pradesh', 'Guntur', '9848034567', '₹22 / కి.మీ లేదా ₹45 / బస్తా', 4.7, true),
    ('గోదావరి అగ్రి కూలీల గ్రూప్ (Godavari Agri Labour Group)', 'labour', 'తూర్పు గోదావరి (East Godavari)', 'Andhra Pradesh', 'East Godavari', '9848045678', '₹400 - ₹500 / రోజుకు (Day)', 4.6, true),
    ('కిసాన్ డ్రోన్ అగ్రికల్చర్ (Kisan Drone Tech)', 'drone', 'కర్నూలు & అనంతపురం (Kurnool)', 'Andhra Pradesh', 'Kurnool', '9848056789', '₹420 / ఎకరా (Acre)', 4.8, true),
    ('బాలాజీ వ్యవసాయ యంత్రాలు (Balaji Agri Implements)', 'machinery', 'కరీంనగర్ (Karimnagar)', 'Telangana', 'Karimnagar', '9848067890', '₹1,200 / గంట (Hour)', 4.7, true),
    ('దక్కన్ లారీ ట్రాన్స్‌పోర్ట్ (Deccan Agri Logistics)', 'transport', 'ఖమ్మం & సూర్యాపేట (Khammam)', 'Telangana', 'Khammam', '9848078901', '₹35 / క్వింటాల్ (రవాణా)', 4.9, true)
ON CONFLICT DO NOTHING;

INSERT INTO offers (buyer_name, buyer_phone, crop_name, quantity_quintals, price_per_quintal, deduction_per_quintal, expiry_date, terms, state, district)
VALUES
    ('స్పెక్ట్రమ్ స్పైసెస్ లిమిటెడ్ (Spectrum Spices)', '9876501234', 'Turmeric / పసుపు', 500.00, 14200.00, 200.00, CURRENT_DATE + INTERVAL '30 days', 'తేమ 10% కంటే తక్కువ ఉండాలి. తక్షణ చెల్లింపు NEFT ద్వారా.', 'Telangana', 'Nizamabad'),
    ('సాయి బాలాజీ ట్రేడర్స్ (Sai Balaji Traders)', '9876502345', 'Turmeric / పసుపు', 300.00, 13800.00, 150.00, CURRENT_DATE + INTERVAL '15 days', 'నాణ్యత పరిశీలన తర్వాత స్పాట్ పేమెంట్.', 'Telangana', 'Jagtial'),
    ('రైస్ మిల్లర్స్ అసోసియేషన్ (Rice Millers AP)', '9876503456', 'Rice / Paddy (వరి)', 1000.00, 2350.00, 50.00, CURRENT_DATE + INTERVAL '45 days', 'గ్రేడ్-ఎ వరి ధాన్యం, గోనె సంచులు సరఫరా చేయబడును.', 'Andhra Pradesh', 'Krishna'),
    ('దక్కన్ కాటన్ జిన్నింగ్ మిల్స్ (Deccan Cotton)', '9876504567', 'Cotton / పత్తి', 400.00, 7400.00, 100.00, CURRENT_DATE + INTERVAL '20 days', 'తేమ 8-10%, చెత్త తక్కువగా ఉండాలి.', 'Telangana', 'Adilabad'),
    ('గుంటూరు స్పైస్ ఎక్స్‌పోర్టర్స్ (Guntur Spice Exporters)', '9876505678', 'Red Chilli (ఎర్ర మిరప)', 250.00, 18500.00, 300.00, CURRENT_DATE + INTERVAL '25 days', 'తేజ లేదా 334 రకం మిర్చి, ఎండిన కాయలు.', 'Andhra Pradesh', 'Guntur')
ON CONFLICT DO NOTHING;
