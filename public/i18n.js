/**
 * Smart Kisan (స్మార్ట్ కిసాన్) - Internationalization (i18n)
 * Native Telugu (default) and English translations for all UI texts,
 * buttons, labels, error messages, advisories, and statements.
 */

const I18N_DICTIONARY = {
    // App Branding & Navigation
    app_title: { te: 'స్మార్ట్ కిసాన్', en: 'Smart Kisan' },
    app_tagline: { te: 'రైతు నేస్తం — పంట ఖర్చులు, లాభం & మార్కెట్ సమాచారం', en: 'Farmer Companion — Costs, Profit & Market Intelligence' },
    nav_dashboard: { te: 'హోమ్', en: 'Home' },
    nav_cycles: { te: 'పంటలు', en: 'Crops' },
    nav_expenses: { te: 'ఖర్చులు', en: 'Expenses' },
    nav_sales: { te: 'అమ్మకాలు', en: 'Sales' },
    nav_profit: { te: 'లాభ నివేదిక', en: 'Profit Report' },
    nav_weather: { te: 'వాతావరణం', en: 'Weather' },
    nav_mandi: { te: 'మండీ ధరలు', en: 'Mandi Rates' },
    nav_offers: { te: 'కొనుగోలు ఆఫర్లు', en: 'Buyer Offers' },
    nav_reminders: { te: 'సాగు సలహాలు', en: 'Crop Reminders' },
    nav_services: { te: 'సేవలు', en: 'Agri Services' },
    nav_batches: { te: 'బ్యాచ్ ట్రాకింగ్', en: 'Batch Trace' },
    nav_profile: { te: 'నా ఖాతా', en: 'My Account' },
    nav_logout: { te: 'లాగౌట్', en: 'Log Out' },
    nav_login: { te: 'లాగిన్', en: 'Log In' },
    nav_signup: { te: 'కొత్త ఖాతా', en: 'Sign Up' },

    // Theme & Language
    lang_toggle_btn: { te: 'English', en: 'తెలుగు' },
    theme_light: { te: 'లైట్ మోడ్', en: 'Light Mode' },
    theme_dark: { te: 'డార్క్ మోడ్', en: 'Dark Mode' },

    // General Actions & Common Buttons
    btn_save: { te: 'భద్రపరచు', en: 'Save' },
    btn_cancel: { te: 'రద్దు చేయి', en: 'Cancel' },
    btn_edit: { te: 'సవరించు', en: 'Edit' },
    btn_delete: { te: 'తొలగించు', en: 'Delete' },
    btn_add: { te: '+ కొత్తది జోడించు', en: '+ Add New' },
    btn_view_details: { te: 'పూర్తి వివరాలు', en: 'View Details' },
    btn_print: { te: 'ప్రింట్ / డౌన్‌లోడ్', en: 'Print / Download' },
    btn_filter: { te: 'వడపోత', en: 'Filter' },
    btn_call: { te: 'కాల్ చేయండి', en: 'Call Now' },
    btn_close: { te: 'మూసివేయి', en: 'Close' },
    btn_retry: { te: 'మళ్లీ ప్రయత్నించండి', en: 'Retry' },
    loading_text: { te: 'లోడ్ అవుతోంది...', en: 'Loading...' },
    empty_records: { te: 'ఎలాంటి రికార్డులు లేవు.', en: 'No records found.' },

    // Currency & Units
    currency_symbol: { te: '₹', en: '₹' },
    unit_quintal: { te: 'క్వింటాల్', en: 'Quintal' },
    unit_kg: { te: 'కిలోలు (Kg)', en: 'Kilograms (Kg)' },
    unit_bag: { te: 'బస్తాలు (Bags)', en: 'Bags' },
    unit_ton: { te: 'టన్నులు (Tons)', en: 'Tons' },
    acre_label: { te: 'ఎకరాలు', en: 'Acres' },

    // Auth & Signup Screens
    login_title: { te: 'రైతు లాగిన్', en: 'Farmer Login' },
    login_subtitle: { te: 'మీ మొబైల్ నంబర్ మరియు పాస్‌వర్డ్ ద్వారా లాగిన్ అవ్వండి', en: 'Log in using your phone number and password' },
    signup_title: { te: 'కొత్త రైతు నమోదు', en: 'Farmer Registration' },
    signup_subtitle: { te: 'ఉచితంగా నమోదు చేసుకోండి. మీ డేటా సురక్షితం.', en: 'Free registration. Your data is completely secure.' },
    field_name: { te: 'రైతు పేరు', en: 'Farmer Name' },
    field_phone: { te: '10 అంకెల మొబైల్ నంబర్', en: '10-Digit Mobile Number' },
    field_phone_placeholder: { te: 'ఉదా: 9848012345', en: 'e.g. 9848012345' },
    field_password: { te: 'పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)', en: 'Password (min. 6 characters)' },
    field_state: { te: 'రాష్ట్రం', en: 'State' },
    field_district: { te: 'జిల్లా', en: 'District' },
    field_village: { te: 'గ్రామం / మండలం', en: 'Village / Mandal' },
    consent_checkbox_text: {
        te: 'నేను నా పంట, ఖర్చులు మరియు అమ్మకాల వివరాలను స్మార్ట్ కిసాన్ యాప్‌లో భద్రపరచడానికి అంగీకరిస్తున్నాను. నా ఆధార్ లేదా బ్యాంక్ ఖాతా వివరాలు ఎన్నడూ సేకరించబడవని తెలుసుకున్నాను.',
        en: 'I consent to storing my crop cycles, expenses, and sales data in Smart Kisan. I acknowledge that Aadhaar or bank details are never collected.'
    },
    btn_submit_login: { te: 'లాగిన్ అవ్వండి', en: 'Log In' },
    btn_submit_signup: { te: 'ఖాతా సృష్టించండి', en: 'Create Account' },
    no_account_prompt: { te: 'ఖాతా లేదా? ఇక్కడ నమోదు చేసుకోండి', en: 'Don’t have an account? Sign up here' },
    have_account_prompt: { te: 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి', en: 'Already registered? Log in here' },

    // Account Deletion & Privacy
    profile_title: { te: 'రైతు ప్రొఫైల్ & గోప్యత', en: 'Farmer Profile & Privacy' },
    profile_registered_on: { te: 'నమోదైన తేదీ', en: 'Registered On' },
    profile_consent_given_at: { te: 'సమ్మతి సమయం', en: 'Consent Timestamp' },
    delete_account_title: { te: 'నా ఖాతా మరియు డేటాను శాశ్వతంగా తొలగించు', en: 'Delete My Account and All Data' },
    delete_account_warning: {
        te: 'జాగ్రత్త: మీ ఖాతా తొలగిస్తే మీ పంటలు, ఖర్చులు, అమ్మకాలు మరియు బ్యాచ్ రికార్డులు మొత్తం శాశ్వతంగా తొలగిపోతాయి. ఈ చర్యను వెనక్కి తీసుకోలేరు.',
        en: 'Warning: Deleting your account will permanently wipe all your crop cycles, expenses, sales, and traceability records. This cannot be undone.'
    },
    btn_delete_account: { te: 'ఖాతాను శాశ్వతంగా తొలగించు', en: 'Permanently Delete Account' },
    confirm_delete_account_prompt: {
        te: 'మీరు నిజంగా మీ ఖాతా మరియు మొత్తం డేటాను తొలగించాలనుకుంటున్నారా? ఇది తిరిగి పొందలేరు.',
        en: 'Are you sure you want to permanently delete your account and all your agricultural records?'
    },

    // Crop Cycles Feature
    cycles_heading: { te: 'నా పంటల వివరాలు (Crop Cycles)', en: 'My Crop Cycles' },
    btn_new_cycle: { te: '+ కొత్త పంట నమోదు చేయండి', en: '+ Add New Crop Cycle' },
    crop_select_label: { te: 'పంటను ఎంచుకోండి లేదా టైప్ చేయండి', en: 'Select Crop or Type' },
    crop_custom_placeholder: { te: 'ఇతర పంట పేరు నమోదు చేయండి...', en: 'Type other crop name...' },
    field_start_date: { te: 'విత్తిన / నాటిన తేదీ', en: 'Planting / Start Date' },
    field_end_date: { te: 'ముగింపు తేదీ (ఐచ్ఛికం)', en: 'Harvest / End Date (Optional)' },
    field_area_acres: { te: 'పంట విస్తీర్ణం (ఎకరాల్లో)', en: 'Planted Area (Acres)' },
    field_cycle_status: { te: 'పంట స్థితి', en: 'Cycle Status' },
    status_active: { te: 'సాగులో ఉంది (Active)', en: 'Active' },
    status_completed: { te: 'పూర్తయింది (Completed)', en: 'Completed' },
    status_abandoned: { te: 'రద్దు చేయబడింది', en: 'Abandoned' },
    field_notes: { te: 'గమనికలు / విశేషాలు', en: 'Notes / Remarks' },

    // Expense Diary Feature
    expenses_heading: { te: 'ఖర్చుల డైరీ (Expense Diary)', en: 'Expense Diary' },
    btn_add_expense: { te: '+ ఖర్చు నమోదు చేయండి', en: '+ Record Expense' },
    expense_tile_prompt: { te: 'ఖర్చు రకాన్ని ఎంచుకోవడానికి క్రింది గుర్తుపై నొక్కండి:', en: 'Tap an item tile to record expenditure:' },
    field_expense_amount: { te: 'ఖర్చు మొత్తం (రూపాయలు ₹)', en: 'Amount Spent (₹)' },
    field_expense_date: { te: 'ఖర్చు చేసిన తేదీ', en: 'Expense Date' },

    // 15 Standard Expense Categories (Bilingual with icons)
    cat_seed: { te: 'విత్తనాలు / నారు', en: 'Seeds / Seedlings', icon: '🌱' },
    cat_fertilizer: { te: 'ఎరువులు / పోషకాలు', en: 'Fertilizers', icon: '🧪' },
    cat_pesticide: { te: 'పురుగుమందులు', en: 'Pesticides', icon: '🧴' },
    cat_labour: { te: 'కూలీల ఖర్చులు', en: 'Labour Wages', icon: '👷' },
    cat_water: { te: 'నీటిపారుదల / మోటారు', en: 'Water / Irrigation', icon: '💧' },
    cat_electricity: { te: 'కరెంటు బిల్లు / డీజిల్', en: 'Electricity / Diesel', icon: '⚡' },
    cat_tractor: { te: 'ట్రాక్టర్ దుక్కి / కిరాయి', en: 'Tractor Ploughing', icon: '🚜' },
    cat_machinery: { te: 'యంత్రాల అద్దె', en: 'Machinery Hire', icon: '⚙️' },
    cat_harvest: { te: 'కోత & నూర్పిడి', en: 'Harvesting & Threshing', icon: '🌾' },
    cat_transport: { te: 'రవాణా ఖర్చులు', en: 'Transport to Mandi', icon: '🚚' },
    cat_drying: { te: 'ఆరబెట్టడం / క్లీనింగ్', en: 'Drying & Curing', icon: '☀️' },
    cat_packing: { te: 'సంచులు & ప్యాకింగ్', en: 'Bags & Packing', icon: '📦' },
    cat_land_rent: { te: 'కౌలు / భూమి అద్దె', en: 'Land Lease / Rent', icon: '🏞️' },
    cat_interest: { te: 'రుణం వడ్డీ', en: 'Crop Loan Interest', icon: '💳' },
    cat_other: { te: 'ఇతర ఖర్చులు', en: 'Other Expenses', icon: '📝' },

    // Sales Feature
    sales_heading: { te: 'అమ్మకాల రికార్డు (Produce Sales)', en: 'Sales Records' },
    btn_add_sale: { te: '+ అమ్మకం నమోదు చేయండి', en: '+ Record Harvest Sale' },
    field_gross_sale_amount: { te: 'మొత్తం అమ్మకం విలువ (రూపాయలు ₹)', en: 'Gross Sale Amount (₹)' },
    field_deductions: { te: 'మార్కెట్ కోతలు / కమిషన్ / హమాలీ (రూపాయలు ₹)', en: 'Deductions (Commission, Hamali) (₹)' },
    field_quantity: { te: 'అమ్మిన పరిమాణం', en: 'Quantity Sold' },
    field_unit: { te: 'కొలత ప్రమాణం', en: 'Unit of Measure' },
    field_buyer: { te: 'కొనుగోలు చేసిన వ్యాపారి / మిల్లు / మండీ', en: 'Buyer / Mill / Mandi Trader' },
    field_sale_date: { te: 'అమ్మిన తేదీ', en: 'Date of Sale' },
    label_net_sale_realized: { te: 'చేతికి వచ్చిన నికర మొత్తం (Net Realized)', en: 'Net Cash Received' },

    // Profit & Financial Intelligence
    profit_title: { te: 'పంట లాభ-నష్టాల నివేదిక', en: 'Crop Profit & Loss Report' },
    stat_total_cost: { te: 'మొత్తం పెట్టుబడి ఖర్చు', en: 'Total Investment Cost' },
    stat_gross_sales: { te: 'మొత్తం అమ్మకాల విలువ', en: 'Gross Produce Sales' },
    stat_total_deductions: { te: 'మార్కెట్ తగ్గింపులు (కోతలు)', en: 'Total Mandi Deductions' },
    stat_net_sales: { te: 'రైతుకు చేకూరిన నికర అమ్మకం', en: 'Net Sales Realized' },
    stat_net_profit: { te: 'నికర లాభం (Net Profit)', en: 'Net Profit / Loss' },
    stat_net_loss: { te: 'నికర నష్టం (Net Loss)', en: 'Net Loss' },
    stat_per_acre_net: { te: 'ఎకరాకు నికర లాభం / నష్టం', en: 'Net Realization Per Acre' },
    stat_per_acre_cost: { te: 'ఎకరాకు పెట్టుబడి ఖర్చు', en: 'Cost Per Acre' },
    breakdown_heading: { te: 'ఖర్చుల వర్గీకరణ (Cost Breakdown)', en: 'Expenditure Breakdown' },
    comparison_heading: { te: 'మునుపటి పంటతో పోలిక (Previous Cycle Comparison)', en: 'Comparison with Previous Cycle' },
    no_previous_comparison: { te: 'ఈ పంటకు గత చక్రం రికార్డులు లేవు.', en: 'No previous cycle record for this crop.' },
    comp_prev_area: { te: 'గత పంట విస్తీర్ణం', en: 'Previous Planted Area' },
    comp_cost_diff: { te: 'ఖర్చులలో మార్పు', en: 'Cost Difference' },
    comp_profit_diff: { te: 'లాభంలో మార్పు', en: 'Profit Difference' },
    comp_per_acre_diff: { te: 'ఎకరా నికర వ్యత్యాసం', en: 'Per-Acre Diff' },
    statement_print_header: { te: 'స్మార్ట్ కిసాన్ అధికారిక పంట లావాదేవీల పత్రం', en: 'Smart Kisan Official Crop Statement' },
    statement_date: { te: 'నివేదిక తేదీ', en: 'Statement Date' },

    // Live Weather Feature
    weather_heading: { te: 'ప్రత్యక్ష వాతావరణ సమాచారం', en: 'Live Weather Intelligence' },
    weather_village_fallback: { te: 'గ్రామం కోఆర్డినేట్లు లేనందున జిల్లా వాతావరణం చూపబడుతోంది.', en: 'Village coordinates not found; displaying district weather.' },
    weather_temp_now: { te: 'ప్రస్తుత ఉష్ణోగ్రత', en: 'Current Temperature' },
    weather_feels_like: { te: 'అనిపించే ఉష్ణోగ్రత', en: 'Feels Like' },
    weather_humidity: { te: 'గాలిలో తేమ (Humidity)', en: 'Humidity' },
    weather_wind: { te: 'గాలి వేగం', en: 'Wind Speed' },
    weather_forecast_5day: { te: 'రాబోయే 5 రోజుల సూచన (5-Day Forecast)', en: '5-Day Daily Forecast' },
    weather_rain_chance: { te: 'వర్ష సూచన', en: 'Rain Probability' },
    weather_source_credit: { te: 'ఓపెన్-మెటియో (Open-Meteo) ద్వారా ప్రత్యక్ష సమాచారం', en: 'Powered by Open-Meteo Satellite Feed' },

    // Live Mandi Prices Feature
    mandi_heading: { te: 'లైవ్ మార్కెట్ (మండీ) ధరలు', en: 'Live APMC Mandi Rates' },
    mandi_commodity_select: { te: 'పంట / కమోడిటీ ఎంచుకోండి', en: 'Select Commodity' },
    mandi_filter_state: { te: 'రాష్ట్రం', en: 'State' },
    mandi_filter_district: { te: 'జిల్లా', en: 'District' },
    mandi_district_first_badge: { te: 'మీ జిల్లా మార్కెట్', en: 'Your District' },
    mandi_modal_price: { te: 'సగటు ధర (Modal)', en: 'Modal Price' },
    mandi_min_max_price: { te: 'కనిష్ట - గరిష్ట ధరలు', en: 'Min - Max Price' },
    mandi_arrival_date: { te: 'తేదీ', en: 'Arrival Date' },
    mandi_market_name: { te: 'మార్కెట్ యార్డ్', en: 'Market Yard' },
    mandi_disclaimer_title: { te: 'హోల్‌సేల్ సూచన ధరలు మాత్రమే', en: 'Wholesale Reference Rates Only' },
    mandi_disclaimer_desc: {
        te: 'ఇవి వ్యవసాయ మార్కెట్ యార్డులలో నమోదైన సూచన ధరలు మాత్రమే. హామీ ఇచ్చిన కొనుగోలు ధర కాదు. మీ ఉత్పత్తుల నాణ్యత, రకం మరియు తేమ శాతాన్ని బట్టి వాస్తవ ధర ఉంటుంది.',
        en: 'These are indicative wholesale APMC mandi rates and NOT guaranteed procurement prices. Actual farm-gate value depends on grade and moisture content.'
    },
    mandi_key_missing_msg: {
        te: 'data.gov.in API కీ సర్వర్‌లో అమర్చలేదు. దయచేసి .env ఫైల్‌లో DATA_GOV_KEY ని సెట్ చేయండి.',
        en: 'data.gov.in API key is not configured in .env. Please set DATA_GOV_KEY to view live AGMARKNET rates.'
    },

    // Buyer Offers Feature
    offers_heading: { te: 'వ్యాపారుల కొనుగోలు ఆఫర్లు (Buyer Offers)', en: 'Buyer Procurement Offers' },
    offers_disclaimer: {
        te: 'రైతు గమనిక: ఈ కొనుగోలు ఆఫర్లు వ్యాపారులు పోస్ట్ చేసినవి. ఎవరికి అమ్మాలనేది పూర్తిగా మీ ఇష్టం. స్మార్ట్ కిసాన్ ఏ వ్యాపారినీ బలవంతం చేయదు.',
        en: 'Notice: These offers are submitted by buyers for comparison. You maintain complete freedom to sell to anyone. Smart Kisan never pushes a choice.'
    },
    offer_net_price: { te: 'నికర ధర (తగ్గింపులు పోను)', en: 'Net Price (Post Deductions)' },
    offer_gross_price: { te: 'ప్రకటించిన ధర', en: 'Offered Price' },
    offer_deduction: { te: 'కోత (క్వింటాలుకు)', en: 'Deduction / Quintal' },
    offer_quantity: { te: 'అవసరమైన పరిమాణం', en: 'Required Quantity' },
    offer_expiry: { te: 'గడువు తేదీ', en: 'Expiry Date' },
    offer_expired_badge: { te: 'గడువు ముగిసింది', en: 'Offer Expired' },
    offer_active_badge: { te: 'ప్రస్తుతం చురుగ్గా ఉంది', en: 'Active Offer' },
    offer_terms: { te: 'నిబంధనలు', en: 'Terms & Conditions' },

    // Crop Reminders Feature
    reminders_heading: { te: 'పంట దశలు & సాగు సలహాలు (Crop Calendar)', en: 'Crop-Stage Advisory' },
    reminders_disclaimer: {
        te: 'సాధారణ సాంస్కృతిక సమాచారం మాత్రమే: వాతావరణం మరియు నేల రకాన్ని బట్టి పద్ధతులు మారవచ్చు. ఎరువులు లేదా రసాయనాల కొరకు మీ స్థానిక మండల వ్యవసాయ అధికారి (AO/AEO)ని సంప్రదించండి.',
        en: 'General cultural guidance only: Practices vary with soil and local microclimates. Consult your local agricultural officer for chemical/nutrient inputs.'
    },
    reminder_days_elapsed: { te: 'నాటినప్పటి నుండి రోజుల సంఖ్య', en: 'Days Since Planting' },
    reminder_current_stage: { te: 'ప్రస్తుత పంట దశ', en: 'Current Crop Stage' },
    reminder_upcoming_stages: { te: 'రాబోయే దశలు', en: 'Upcoming Stages' },
    turmeric_special_badge: { te: 'పసుపు సాగు సమగ్ర క్యాలెండర్', en: 'Turmeric Agronomy Calendar' },

    // Agri Services Feature
    services_heading: { te: 'స్థానిక వ్యవసాయ సేవలు (Agri Directory)', en: 'Local Agri Service Directory' },
    filter_all_services: { te: 'అన్ని సేవలు', en: 'All Services' },
    filter_drone: { te: 'డ్రోన్ స్ప్రేయింగ్ (Drone)', en: 'Drone Spraying' },
    filter_machinery: { te: 'ట్రాక్టర్ / యంత్రాలు', en: 'Machinery & Tractor' },
    filter_labour: { te: 'కూలీల బృందం (Labour)', en: 'Labour Crews' },
    filter_transport: { te: 'రవాణా లారీ / ఆటో', en: 'Agri Transport' },
    service_verified_badge: { te: 'ధృవీకరించబడింది ✓', en: 'Verified ✓' },
    service_quote_label: { te: 'అంచనా రేటు', en: 'Typical Rate' },
    service_area_label: { te: 'సేవ అందించే ప్రాంతం', en: 'Service Area' },

    // Batch Traceability Feature
    batches_heading: { te: 'ఉత్పత్తి బ్యాచ్ ట్రాకింగ్ (Traceability)', en: 'Produce Batch Traceability' },
    btn_add_batch: { te: '+ కొత్త బ్యాచ్ రూపొందించండి', en: '+ Create Batch Code' },
    batch_code_label: { te: 'బ్యాచ్ కోడ్ (Batch ID)', en: 'Batch Code' },
    batch_status_label: { te: 'ప్రాసెసింగ్ స్థితి', en: 'Processing Status' },
    batch_moisture_label: { te: 'తేమ శాతం (%)', en: 'Moisture (%)' },
    batch_grade_label: { te: 'నాణ్యత గ్రేడ్', en: 'Quality Grade' },
    batch_status_received: { te: '1. కోత పూర్తయింది (Harvested)', en: '1. Received / Harvested' },
    batch_status_dried: { te: '2. ఆరబెట్టబడింది (Dried)', en: '2. Dried' },
    batch_status_milled: { te: '3. ప్రాసెస్ / మిల్లింగ్ (Milled)', en: '3. Milled / Polished' },
    batch_status_packed: { te: '4. ప్యాకింగ్ పూర్తయింది (Packed)', en: '4. Packed' },
    batch_status_sold: { te: '5. విక్రయించబడింది (Sold)', en: '5. Sold' },
    batch_organic_note: {
        te: 'గమనిక: బ్యాచ్ రికార్డు మీ వ్యవసాయ ఉత్పత్తుల వివరాలను సూచిస్తుంది. \'సేంద్రీయ (Organic)\' అని ప్రచారం చేయడానికి గుర్తింపు పొందిన సంస్థల (NPOP/APEDA/Jaivik Bharat) నుండి అధికారిక సర్టిఫికేషన్ తప్పనిసరి.',
        en: 'Notice: This traceability record tracks post-harvest processing. Official claims of \'Organic\' legally require accredited certification from NPOP/APEDA/Jaivik Bharat.'
    },

    // Network / Offline Messages
    network_offline_alert: {
        te: 'ఇంటర్నెట్ కనెక్షన్ లేదు. మీ ఫారమ్ వివరాలు తాత్కాలికంగా సేవ్ చేయబడ్డాయి.',
        en: 'No internet connection. Your form data has been saved locally.'
    },
    network_restored_msg: {
        te: 'ఇంటర్నెట్ కనెక్షన్ పునరుద్ధరించబడింది.',
        en: 'Internet connection restored.'
    }
};

let currentLang = 'te'; // Telugu-first default

function setLanguage(lang) {
    if (lang === 'en' || lang === 'te') {
        currentLang = lang;
        try {
            localStorage.setItem('sk_lang', lang);
        } catch (e) {}
    }
}

function initLanguage() {
    try {
        const saved = localStorage.getItem('sk_lang');
        if (saved === 'en' || saved === 'te') {
            currentLang = saved;
        } else {
            currentLang = 'te'; // Telugu default
        }
    } catch (e) {
        currentLang = 'te';
    }
}

function t(key, fallback = '') {
    const entry = I18N_DICTIONARY[key];
    if (!entry) return fallback || key;
    return entry[currentLang] || entry['te'] || entry['en'] || fallback || key;
}

function getCurrentLang() {
    return currentLang;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18N_DICTIONARY, setLanguage, initLanguage, t, getCurrentLang };
}
