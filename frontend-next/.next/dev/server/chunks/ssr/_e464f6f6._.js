module.exports = [
"[project]/components/CustomSelect.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$react$2d$select$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-select/dist/react-select.esm.js [app-ssr] (ecmascript) <locals>");
'use client';
;
;
;
const customStyles = {
    control: (provided, state)=>({
            ...provided,
            backgroundColor: 'white',
            borderColor: state.isFocused ? '#cbd5e1' : '#e2e8f0',
            borderRadius: '20px',
            padding: state.selectProps.Icon ? '0.15rem 0.5rem 0.15rem 2.8rem' : '0.15rem 0.8rem',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#cbd5e1'
            },
            fontFamily: 'var(--font-bangla)',
            fontSize: '0.95rem',
            minHeight: '44px',
            borderStyle: 'solid',
            borderWidth: '1px'
        }),
    option: (provided, state)=>({
            ...provided,
            backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f8fafc' : 'white',
            color: state.isSelected ? '#1e40af' : '#1f2937',
            cursor: 'pointer',
            fontFamily: 'var(--font-bangla)',
            padding: '10px 16px',
            '&:active': {
                backgroundColor: '#e0f2fe'
            }
        }),
    menu: (provided)=>({
            ...provided,
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
            zIndex: 100,
            marginTop: '4px'
        }),
    menuList: (provided)=>({
            ...provided,
            padding: '4px'
        }),
    placeholder: (provided)=>({
            ...provided,
            color: '#94a3b8'
        }),
    singleValue: (provided)=>({
            ...provided,
            color: '#1f2937'
        }),
    input: (provided)=>({
            ...provided,
            color: '#1f2937',
            fontFamily: 'var(--font-bangla)'
        }),
    indicatorSeparator: ()=>({
            display: 'none'
        })
};
const CustomSelect = ({ options, value, onChange, name, placeholder, required, className, Icon })=>{
    const selectedOption = options.find((option)=>option.value === value) || null;
    const handleChange = (selectedOption)=>{
        const event = {
            target: {
                name,
                value: selectedOption ? selectedOption.value : ''
            }
        };
        if (onChange) {
            onChange(event);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "custom-select-wrapper",
        style: {
            position: 'relative'
        },
        children: [
            Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "select-icon-prefix",
                style: {
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 5,
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    size: 18,
                    strokeWidth: 1.5
                }, void 0, false, {
                    fileName: "[project]/components/CustomSelect.js",
                    lineNumber: 94,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/CustomSelect.js",
                lineNumber: 83,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$react$2d$select$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                instanceId: name,
                name: name,
                options: options,
                value: selectedOption,
                onChange: handleChange,
                placeholder: placeholder || 'নির্বাচন করুন',
                isClearable: !required,
                isSearchable: false,
                styles: customStyles,
                className: className,
                classNamePrefix: "react-select",
                noOptionsMessage: ()=>'পাওয়া যায়নি',
                Icon: Icon
            }, void 0, false, {
                fileName: "[project]/components/CustomSelect.js",
                lineNumber: 97,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/CustomSelect.js",
        lineNumber: 81,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CustomSelect;
}),
"[project]/lib/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "bloodGroupOptions",
    ()=>bloodGroupOptions,
    "departmentOptions",
    ()=>departmentOptions,
    "genderOptions",
    ()=>genderOptions,
    "hallOptions",
    ()=>hallOptions,
    "sessionOptions",
    ()=>sessionOptions,
    "upazilaOptions",
    ()=>upazilaOptions
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "http://127.0.0.1:5010") || 'http://localhost:5001';
const departmentOptions = [
    {
        value: 'Accounting and Information Systems',
        label: 'Accounting and Information Systems'
    },
    {
        value: 'Anthropology',
        label: 'Anthropology'
    },
    {
        value: 'Applied Chemistry and Chemical Engineering',
        label: 'Applied Chemistry and Chemical Engineering'
    },
    {
        value: 'Applied Mathematics',
        label: 'Applied Mathematics'
    },
    {
        value: 'Arabic',
        label: 'Arabic'
    },
    {
        value: 'Bangla',
        label: 'Bangla'
    },
    {
        value: 'Banking and Insurance',
        label: 'Banking and Insurance'
    },
    {
        value: 'Biochemistry and Molecular Biology',
        label: 'Biochemistry and Molecular Biology'
    },
    {
        value: 'Botany',
        label: 'Botany'
    },
    {
        value: 'Chemistry',
        label: 'Chemistry'
    },
    {
        value: 'Communication Disorders',
        label: 'Communication Disorders'
    },
    {
        value: 'Computer Science and Engineering',
        label: 'Computer Science and Engineering'
    },
    {
        value: 'Criminology',
        label: 'Criminology'
    },
    {
        value: 'Dance',
        label: 'Dance'
    },
    {
        value: 'Development Studies',
        label: 'Development Studies'
    },
    {
        value: 'Disaster Science and Climate Resilience',
        label: 'Disaster Science and Climate Resilience'
    },
    {
        value: 'Economics',
        label: 'Economics'
    },
    {
        value: 'Electrical and Electronic Engineering',
        label: 'Electrical and Electronic Engineering'
    },
    {
        value: 'English',
        label: 'English'
    },
    {
        value: 'Finance',
        label: 'Finance'
    },
    {
        value: 'Fisheries',
        label: 'Fisheries'
    },
    {
        value: 'Genetic Engineering and Biotechnology',
        label: 'Genetic Engineering and Biotechnology'
    },
    {
        value: 'Geography and Environment',
        label: 'Geography and Environment'
    },
    {
        value: 'Geology',
        label: 'Geology'
    },
    {
        value: 'Graphic Design',
        label: 'Graphic Design'
    },
    {
        value: 'History',
        label: 'History'
    },
    {
        value: 'History of Art',
        label: 'History of Art'
    },
    {
        value: 'Information Science and Library Management',
        label: 'Information Science and Library Management'
    },
    {
        value: 'Institute of Business Administration',
        label: 'Institute of Business Administration'
    },
    {
        value: 'Institute of Disaster Management and Vulnerability Studies',
        label: 'Institute of Disaster Management and Vulnerability Studies'
    },
    {
        value: 'Institute of Education and Research',
        label: 'Institute of Education and Research'
    },
    {
        value: 'Institute of Health Economics',
        label: 'Institute of Health Economics'
    },
    {
        value: 'Institute of Information Technology',
        label: 'Institute of Information Technology'
    },
    {
        value: 'Institute of Leather Engineering and Technology',
        label: 'Institute of Leather Engineering and Technology'
    },
    {
        value: 'Institute of Modern Languages',
        label: 'Institute of Modern Languages'
    },
    {
        value: 'Institute of Nutrition and Food Science',
        label: 'Institute of Nutrition and Food Science'
    },
    {
        value: 'Institute of Social Welfare and Research',
        label: 'Institute of Social Welfare and Research'
    },
    {
        value: 'Institute of Statistical Research and Training',
        label: 'Institute of Statistical Research and Training'
    },
    {
        value: 'International Business',
        label: 'International Business'
    },
    {
        value: 'International Relations',
        label: 'International Relations'
    },
    {
        value: 'Islamic History & Culture',
        label: 'Islamic History & Culture'
    },
    {
        value: 'Islamic Studies',
        label: 'Islamic Studies'
    },
    {
        value: 'Japanese Studies',
        label: 'Japanese Studies'
    },
    {
        value: 'Law',
        label: 'Law'
    },
    {
        value: 'Linguistics',
        label: 'Linguistics'
    },
    {
        value: 'Management',
        label: 'Management'
    },
    {
        value: 'Management Information Systems',
        label: 'Management Information Systems'
    },
    {
        value: 'Marketing',
        label: 'Marketing'
    },
    {
        value: 'Mass Communication and Journalism',
        label: 'Mass Communication and Journalism'
    },
    {
        value: 'Mathematics',
        label: 'Mathematics'
    },
    {
        value: 'Meteorology',
        label: 'Meteorology'
    },
    {
        value: 'Microbiology',
        label: 'Microbiology'
    },
    {
        value: 'Music',
        label: 'Music'
    },
    {
        value: 'Nuclear Engineering',
        label: 'Nuclear Engineering'
    },
    {
        value: 'Oceanography',
        label: 'Oceanography'
    },
    {
        value: 'Organizational Strategy and Leadership',
        label: 'Organizational Strategy and Leadership'
    },
    {
        value: 'Pali and Buddhist Studies',
        label: 'Pali and Buddhist Studies'
    },
    {
        value: 'Peace and Conflict Studies',
        label: 'Peace and Conflict Studies'
    },
    {
        value: 'Persian Language and Literature',
        label: 'Persian Language and Literature'
    },
    {
        value: 'Pharmacy',
        label: 'Pharmacy'
    },
    {
        value: 'Philosophy',
        label: 'Philosophy'
    },
    {
        value: 'Physics',
        label: 'Physics'
    },
    {
        value: 'Political Science',
        label: 'Political Science'
    },
    {
        value: 'Printing and Publication Studies',
        label: 'Printing and Publication Studies'
    },
    {
        value: 'Psychology',
        label: 'Psychology'
    },
    {
        value: 'Public Administration',
        label: 'Public Administration'
    },
    {
        value: 'Robotics and Mechatronics Engineering',
        label: 'Robotics and Mechatronics Engineering'
    },
    {
        value: 'Sanskrit',
        label: 'Sanskrit'
    },
    {
        value: 'Sociology',
        label: 'Sociology'
    },
    {
        value: 'Soil, Water and Environment',
        label: 'Soil, Water and Environment'
    },
    {
        value: 'Statistics',
        label: 'Statistics'
    },
    {
        value: 'Television, Film and Photography',
        label: 'Television, Film and Photography'
    },
    {
        value: 'Theatre',
        label: 'Theatre'
    },
    {
        value: 'Tourism and Hospitality Management',
        label: 'Tourism and Hospitality Management'
    },
    {
        value: 'Urdu',
        label: 'Urdu'
    },
    {
        value: 'Women and Gender Studies',
        label: 'Women and Gender Studies'
    },
    {
        value: 'World Religions and Culture',
        label: 'World Religions and Culture'
    },
    {
        value: 'Zoology',
        label: 'Zoology'
    }
];
const hallOptions = [
    {
        value: 'Bangamata Sheikh Fazilatunnesa Mujib Hall',
        label: 'Bangamata Sheikh Fazilatunnesa Mujib Hall'
    },
    {
        value: 'Bangladesh–Kuwait Maitree Hall',
        label: 'Bangladesh–Kuwait Maitree Hall'
    },
    {
        value: 'Bijoy Ekattor Hall',
        label: 'Bijoy Ekattor Hall'
    },
    {
        value: 'Dr. Muhammad Shahidullah Hall',
        label: 'Dr. Muhammad Shahidullah Hall'
    },
    {
        value: 'Fazlul Huq Muslim Hall',
        label: 'Fazlul Huq Muslim Hall'
    },
    {
        value: 'Haji Muhammad Muhsin Hall',
        label: 'Haji Muhammad Muhsin Hall'
    },
    {
        value: 'Jagannath Hall',
        label: 'Jagannath Hall'
    },
    {
        value: 'Kabi Jasim Uddin Hall',
        label: 'Kabi Jasim Uddin Hall'
    },
    {
        value: 'Kabi Sufia Kamal Hall',
        label: 'Kabi Sufia Kamal Hall'
    },
    {
        value: 'Muktijoddha Ziaur Rahman Hall',
        label: 'Muktijoddha Ziaur Rahman Hall'
    },
    {
        value: 'Omor Ekushey Hall',
        label: 'Omor Ekushey Hall'
    },
    {
        value: 'Rokeya Hall',
        label: 'Rokeya Hall'
    },
    {
        value: 'Salimullah Muslim Hall',
        label: 'Salimullah Muslim Hall'
    },
    {
        value: 'Shaheed Sergeant Zahurul Haq Hall',
        label: 'Shaheed Sergeant Zahurul Haq Hall'
    },
    {
        value: 'Shamsun Nahar Hall',
        label: 'Shamsun Nahar Hall'
    },
    {
        value: 'Sheikh Mujibur Rahman Hall',
        label: 'Sheikh Mujibur Rahman Hall'
    },
    {
        value: 'Sir A. F. Rahman Hall',
        label: 'Sir A. F. Rahman Hall'
    },
    {
        value: 'Surya Sen Hall',
        label: 'Surya Sen Hall'
    }
];
const sessionOptions = (()=>{
    const sessions = [];
    for(let year = 2024; year >= 1980; year--){
        const label = `${year}-${year + 1}`;
        sessions.push({
            value: label,
            label
        });
    }
    return sessions;
})();
const bloodGroupOptions = [
    {
        value: 'A+',
        label: 'A+'
    },
    {
        value: 'A-',
        label: 'A-'
    },
    {
        value: 'B+',
        label: 'B+'
    },
    {
        value: 'B-',
        label: 'B-'
    },
    {
        value: 'O+',
        label: 'O+'
    },
    {
        value: 'O-',
        label: 'O-'
    },
    {
        value: 'AB+',
        label: 'AB+'
    },
    {
        value: 'AB-',
        label: 'AB-'
    }
];
const upazilaOptions = [
    {
        value: 'Sadar',
        label: 'Brahmanbaria Sadar'
    },
    {
        value: 'Ashuganj',
        label: 'Ashuganj'
    },
    {
        value: 'Nasirnagar',
        label: 'Nasirnagar'
    },
    {
        value: 'Nabinagar',
        label: 'Nabinagar'
    },
    {
        value: 'Bancharampur',
        label: 'Bancharampur'
    },
    {
        value: 'Kasba',
        label: 'Kasba'
    },
    {
        value: 'Akhaura',
        label: 'Akhaura'
    },
    {
        value: 'Sarail',
        label: 'Sarail'
    },
    {
        value: 'Bijoynagar',
        label: 'Bijoynagar'
    }
];
const genderOptions = [
    {
        value: 'male',
        label: 'পুরুষ (Male)'
    },
    {
        value: 'female',
        label: 'নারী (Female)'
    },
    {
        value: 'other',
        label: 'অন্যান্য (Other)'
    }
];
}),
"[project]/components/RegisterClient.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RegisterClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-ssr] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CustomSelect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://127.0.0.1:5010") || 'http://localhost:5001';
const MOBILE_REGEX = /^01\d{9}$/;
function RegisterClient() {
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        session: '',
        regNo: '',
        nameEn: '',
        nameBn: '',
        mobile: '',
        email: '',
        addressEn: '',
        addressBn: '',
        upazila: '',
        department: '',
        bloodGroup: '',
        hall: '',
        gender: '',
        isEmployed: false,
        organization: '',
        jobTitle: '',
        password: ''
    });
    const [photo, setPhoto] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [preview, setPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [fieldErrors, setFieldErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        regNo: '',
        mobile: '',
        email: ''
    });
    const [checkingField, setCheckingField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        regNo: false,
        mobile: false,
        email: false
    });
    const [duplicateRecord, setDuplicateRecord] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const setFieldChecking = (name, value)=>{
        setCheckingField((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const checkDuplicateFields = async (payload)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`${API_BASE_URL}/api/students/check-duplicate`, {
            params: payload
        });
        return res.data || {
            duplicates: {
                regNo: false,
                mobile: false,
                email: false
            },
            messages: {
                regNo: '',
                mobile: '',
                email: ''
            },
            records: {
                regNo: null,
                mobile: null,
                email: null
            }
        };
    };
    const pickDuplicateRecord = (payload)=>payload?.records?.regNo || payload?.records?.mobile || payload?.records?.email || null;
    const getMobileValidationError = (mobileValue)=>{
        const trimmedMobile = String(mobileValue || '').trim();
        if (!trimmedMobile) return 'মোবাইল নম্বর প্রদান করুন।';
        if (trimmedMobile.startsWith('+88')) {
            return 'মোবাইল নম্বর +88 ছাড়া ১১ ডিজিটে দিন (যেমন: 01XXXXXXXXX)।';
        }
        if (!MOBILE_REGEX.test(trimmedMobile)) {
            return 'মোবাইল নম্বর অবশ্যই ১১ ডিজিট হতে হবে এবং 01 দিয়ে শুরু হতে হবে।';
        }
        return '';
    };
    const handleFieldBlur = async (name)=>{
        if (![
            'regNo',
            'mobile',
            'email'
        ].includes(name)) return;
        const value = (formData[name] || '').trim();
        if (!value) {
            setFieldErrors((prev)=>({
                    ...prev,
                    [name]: ''
                }));
            if (!fieldErrors.regNo && !fieldErrors.mobile && !fieldErrors.email) {
                setDuplicateRecord(null);
            }
            return;
        }
        if (name === 'mobile') {
            const mobileError = getMobileValidationError(value);
            if (mobileError) {
                setFieldErrors((prev)=>({
                        ...prev,
                        mobile: mobileError
                    }));
                setDuplicateRecord(null);
                return;
            }
        }
        setFieldChecking(name, true);
        try {
            const payload = await checkDuplicateFields({
                [name]: value
            });
            setFieldErrors((prev)=>({
                    ...prev,
                    [name]: payload.duplicates?.[name] ? payload.messages?.[name] || 'এই তথ্যটি ইতিমধ্যে ব্যবহার করা হয়েছে।' : ''
                }));
            if (payload.duplicates?.[name]) {
                setDuplicateRecord(payload.records?.[name] || null);
            } else {
                const hasAnyDuplicate = [
                    'regNo',
                    'mobile',
                    'email'
                ].some((field)=>field !== name && Boolean(fieldErrors[field]));
                if (!hasAnyDuplicate) {
                    setDuplicateRecord(null);
                }
            }
        } catch (err) {
            setFieldErrors((prev)=>({
                    ...prev,
                    [name]: ''
                }));
        } finally{
            setFieldChecking(name, false);
        }
    };
    const handleChange = (e)=>{
        const { name, value, type, checked } = e.target;
        let nextValue = value;
        if (name === 'mobile') {
            nextValue = String(value || '').replace(/\D/g, '').slice(0, 11);
        }
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : nextValue
        });
        if ([
            'regNo',
            'mobile',
            'email'
        ].includes(name)) {
            setFieldErrors((prev)=>({
                    ...prev,
                    [name]: ''
                }));
        }
        if (duplicateRecord) {
            setDuplicateRecord(null);
        }
    };
    const handlePhotoChange = (e)=>{
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const mobileError = getMobileValidationError(formData.mobile);
        if (mobileError) {
            setFieldErrors((prev)=>({
                    ...prev,
                    mobile: mobileError
                }));
            setLoading(false);
            setMessage('দয়া করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (দেশকোড ছাড়া)।');
            return;
        }
        if (!photo) {
            setLoading(false);
            setMessage('নিবন্ধনের জন্য একটি প্রোফাইল ছবি আপলোড করা বাধ্যতামূলক।');
            return;
        }
        try {
            const duplicatePayload = await checkDuplicateFields({
                regNo: formData.regNo?.trim(),
                mobile: formData.mobile?.trim(),
                email: formData.email?.trim()
            });
            const nextErrors = {
                regNo: duplicatePayload.duplicates?.regNo ? duplicatePayload.messages?.regNo : '',
                mobile: duplicatePayload.duplicates?.mobile ? duplicatePayload.messages?.mobile : '',
                email: duplicatePayload.duplicates?.email ? duplicatePayload.messages?.email : ''
            };
            setFieldErrors(nextErrors);
            setDuplicateRecord(pickDuplicateRecord(duplicatePayload));
            if (nextErrors.regNo || nextErrors.mobile || nextErrors.email) {
                setMessage('দয়া করে ডুপ্লিকেট তথ্যগুলো ঠিক করে আবার চেষ্টা করুন।');
                setLoading(false);
                return;
            }
        } catch (err) {
            setLoading(false);
            setMessage('ভ্যালিডেশন চেক করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
            return;
        }
        const data = new FormData();
        for(const key in formData){
            data.append(key, formData[key]);
        }
        if (photo) {
            data.append('photo', photo);
        }
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/api/students`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Registration Successful!');
            // Reset form
            setFormData({
                session: '',
                regNo: '',
                nameEn: '',
                nameBn: '',
                mobile: '',
                email: '',
                addressEn: '',
                addressBn: '',
                upazila: '',
                department: '',
                bloodGroup: '',
                hall: '',
                gender: '',
                isEmployed: false,
                organization: '',
                jobTitle: '',
                password: ''
            });
            setFieldErrors({
                regNo: '',
                mobile: '',
                email: ''
            });
            setDuplicateRecord(null);
            setPhoto(null);
            setPreview(null);
            setTimeout(()=>router.push('/login'), 2000);
        } catch (err) {
            setMessage(err.response?.data?.msg || 'An error occurred during registration.');
        } finally{
            setLoading(false);
        }
    };
    const hasDuplicateError = Boolean(fieldErrors.regNo || fieldErrors.mobile || fieldErrors.email);
    const isCheckingAny = Object.values(checkingField).some(Boolean);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "register-page",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            style: {
                maxWidth: '1000px',
                paddingTop: '4rem',
                paddingBottom: '4rem'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    style: {
                        marginBottom: '2.5rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "bn-text",
                            style: {
                                fontSize: '2rem',
                                marginBottom: '0.5rem',
                                color: '#0f172a'
                            },
                            children: "শিক্ষার্থী নিবন্ধন ফর্ম"
                        }, void 0, false, {
                            fileName: "[project]/components/RegisterClient.js",
                            lineNumber: 241,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "bn-text text-muted",
                            children: "অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য সতর্কতার সাথে পূরণ করুন"
                        }, void 0, false, {
                            fileName: "[project]/components/RegisterClient.js",
                            lineNumber: 242,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/RegisterClient.js",
                    lineNumber: 240,
                    columnNumber: 17
                }, this),
                message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "alert",
                    style: {
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        backgroundColor: message.toLocaleLowerCase().includes('success') ? '#dcfce7' : '#fee2e2',
                        borderRadius: '8px',
                        color: message.toLocaleLowerCase().includes('success') ? '#166534' : '#991b1b',
                        textAlign: 'center'
                    },
                    children: message
                }, void 0, false, {
                    fileName: "[project]/components/RegisterClient.js",
                    lineNumber: 246,
                    columnNumber: 21
                }, this),
                duplicateRecord && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "duplicate-record-card",
                    role: "status",
                    "aria-live": "polite",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "duplicate-record-icon",
                            "aria-hidden": "true",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                size: 30
                            }, void 0, false, {
                                fileName: "[project]/components/RegisterClient.js",
                                lineNumber: 254,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/RegisterClient.js",
                            lineNumber: 253,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "duplicate-record-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "bn-text",
                                    children: "আপনার ডাটা ইতিমধ্যেই বিদ্যমান!"
                                }, void 0, false, {
                                    fileName: "[project]/components/RegisterClient.js",
                                    lineNumber: 257,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "bn-text",
                                    children: [
                                        "শিক্ষার্থীর নাম: ",
                                        duplicateRecord.nameBn || duplicateRecord.nameEn || 'N/A'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RegisterClient.js",
                                    lineNumber: 258,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "bn-text",
                                    children: [
                                        "তিতাস আইডি: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "duplicate-badge",
                                            children: duplicateRecord.titasId || 'N/A'
                                        }, void 0, false, {
                                            fileName: "[project]/components/RegisterClient.js",
                                            lineNumber: 259,
                                            columnNumber: 64
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RegisterClient.js",
                                    lineNumber: 259,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "bn-text duplicate-record-note",
                                    children: "আপনি আমাদের স্টুডেন্ট ডিরেক্টরি থেকে আপনার তথ্য যাচাই করতে পারবেন"
                                }, void 0, false, {
                                    fileName: "[project]/components/RegisterClient.js",
                                    lineNumber: 260,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RegisterClient.js",
                            lineNumber: 256,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/RegisterClient.js",
                    lineNumber: 252,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "register-form",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-grid",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fields-column",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "সেশন"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 271,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        name: "session",
                                                        value: formData.session,
                                                        onChange: handleChange,
                                                        options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sessionOptions"],
                                                        placeholder: "সেশন নির্বাচন করুন",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 272,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 270,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "ঢাকা বিশ্ববিদ্যালয় রেজিস্ট্রেশন নম্বর"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 282,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "regNo",
                                                        value: formData.regNo,
                                                        onChange: handleChange,
                                                        onBlur: ()=>handleFieldBlur('regNo'),
                                                        placeholder: "আপনার ঢাবি রেজিস্ট্রেশন নম্বর দিন",
                                                        className: "form-input bn-text",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 283,
                                                        columnNumber: 37
                                                    }, this),
                                                    checkingField.regNo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "field-feedback checking bn-text",
                                                        children: "চেক করা হচ্ছে..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 284,
                                                        columnNumber: 61
                                                    }, this),
                                                    fieldErrors.regNo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "field-feedback error bn-text",
                                                        children: fieldErrors.regNo
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 285,
                                                        columnNumber: 59
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 281,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/RegisterClient.js",
                                        lineNumber: 269,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "নাম (ইংরেজি)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 291,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "nameEn",
                                                        value: formData.nameEn,
                                                        onChange: handleChange,
                                                        placeholder: "আপনার পূর্ণ নাম ইংরেজিতে লিখুন",
                                                        className: "form-input bn-text",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 292,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 290,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "নাম (বাংলা)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 296,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "nameBn",
                                                        value: formData.nameBn,
                                                        onChange: handleChange,
                                                        placeholder: "আপনার পূর্ণ নাম বাংলায় লিখুন",
                                                        className: "form-input bn-text",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 297,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 295,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/RegisterClient.js",
                                        lineNumber: 289,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "মোবাইল নম্বর"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 303,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "tel",
                                                        name: "mobile",
                                                        value: formData.mobile,
                                                        onChange: handleChange,
                                                        onBlur: ()=>handleFieldBlur('mobile'),
                                                        placeholder: "01XXXXXXXXX",
                                                        className: "form-input bn-text",
                                                        required: true,
                                                        maxLength: "11",
                                                        inputMode: "numeric",
                                                        pattern: "01[0-9]{9}"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 304,
                                                        columnNumber: 37
                                                    }, this),
                                                    checkingField.mobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "field-feedback checking bn-text",
                                                        children: "চেক করা হচ্ছে..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 305,
                                                        columnNumber: 62
                                                    }, this),
                                                    fieldErrors.mobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "field-feedback error bn-text",
                                                        children: fieldErrors.mobile
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 306,
                                                        columnNumber: 60
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 302,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "ইমেইল"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 309,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "email",
                                                        name: "email",
                                                        value: formData.email,
                                                        onChange: handleChange,
                                                        onBlur: ()=>handleFieldBlur('email'),
                                                        placeholder: "example@email.com",
                                                        className: "form-input",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 310,
                                                        columnNumber: 37
                                                    }, this),
                                                    checkingField.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "field-feedback checking bn-text",
                                                        children: "চেক করা হচ্ছে..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 311,
                                                        columnNumber: 61
                                                    }, this),
                                                    fieldErrors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "field-feedback error bn-text",
                                                        children: fieldErrors.email
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 312,
                                                        columnNumber: 59
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 308,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/RegisterClient.js",
                                        lineNumber: 301,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: [
                                                            "ঠিকানা (ইংরেজি) ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 'normal'
                                                                },
                                                                children: "(উপজেলা ব্যতীত)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/RegisterClient.js",
                                                                lineNumber: 318,
                                                                columnNumber: 91
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 318,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "addressEn",
                                                        value: formData.addressEn,
                                                        onChange: handleChange,
                                                        placeholder: "গ্রাম/মহল্লা ইংরেজিতে",
                                                        className: "form-input bn-text",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 319,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 317,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: [
                                                            "ঠিকানা (বাংলা) ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 'normal'
                                                                },
                                                                children: "(উপজেলা ব্যতীত)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/RegisterClient.js",
                                                                lineNumber: 322,
                                                                columnNumber: 90
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 322,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "addressBn",
                                                        value: formData.addressBn,
                                                        onChange: handleChange,
                                                        placeholder: "গ্রাম/মহল্লা বাংলায়",
                                                        className: "form-input bn-text",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 323,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 321,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/RegisterClient.js",
                                        lineNumber: 316,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "উপজেলা"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 329,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        name: "upazila",
                                                        value: formData.upazila,
                                                        onChange: handleChange,
                                                        options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["upazilaOptions"],
                                                        placeholder: "উপজেলা নির্বাচন করুন",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 330,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 328,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "ডিপার্টমেন্ট"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 340,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        name: "department",
                                                        value: formData.department,
                                                        onChange: handleChange,
                                                        options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["departmentOptions"],
                                                        placeholder: "ডিপার্টমেন্ট নির্বাচন করুন",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 341,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 339,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/RegisterClient.js",
                                        lineNumber: 327,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "রক্তের গ্রুপ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 354,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        name: "bloodGroup",
                                                        value: formData.bloodGroup,
                                                        onChange: handleChange,
                                                        options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bloodGroupOptions"],
                                                        placeholder: "রক্তের গ্রুপ নির্বাচন করুন",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 355,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 353,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "হল"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 365,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        name: "hall",
                                                        value: formData.hall,
                                                        onChange: handleChange,
                                                        options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hallOptions"],
                                                        placeholder: "হল নির্বাচন করুন",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 366,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 364,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/RegisterClient.js",
                                        lineNumber: 352,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "row",
                                        style: {
                                            alignItems: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                style: {
                                                    flex: 1,
                                                    marginBottom: 0
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "লিঙ্গ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 379,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        name: "gender",
                                                        value: formData.gender,
                                                        onChange: handleChange,
                                                        options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["genderOptions"],
                                                        placeholder: "Select Gender",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 380,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 378,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                style: {
                                                    flex: 1,
                                                    paddingLeft: '1rem',
                                                    marginBottom: 0
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "পাসওয়ার্ড"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 390,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "password",
                                                        name: "password",
                                                        value: formData.password,
                                                        onChange: handleChange,
                                                        placeholder: "••••••••",
                                                        className: "form-input",
                                                        required: true,
                                                        minLength: "6"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 391,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 389,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/RegisterClient.js",
                                        lineNumber: 377,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "row",
                                        style: {
                                            marginTop: '1.5rem'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "form-group checkbox-group",
                                            style: {
                                                flex: 1,
                                                marginBottom: 0
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex-center",
                                                style: {
                                                    justifyContent: 'flex-start',
                                                    gap: '0.5rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        name: "isEmployed",
                                                        checked: formData.isEmployed,
                                                        onChange: handleChange,
                                                        style: {
                                                            width: '18px',
                                                            height: '18px'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 398,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bn-text",
                                                        style: {
                                                            fontWeight: 500
                                                        },
                                                        children: "আপনি কি বর্তমানে চাকুরিজীবী?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 399,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 397,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/RegisterClient.js",
                                            lineNumber: 396,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/RegisterClient.js",
                                        lineNumber: 395,
                                        columnNumber: 29
                                    }, this),
                                    formData.isEmployed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "row employed-fields-row",
                                        style: {
                                            display: 'flex',
                                            gap: '1rem',
                                            marginTop: '1rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                style: {
                                                    flex: 1
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "প্রতিষ্ঠান / দপ্তর এর নাম"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 407,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "organization",
                                                        value: formData.organization,
                                                        onChange: handleChange,
                                                        placeholder: "প্রতিষ্ঠান / দপ্তর এর নাম লিখুন",
                                                        className: "form-input bn-text",
                                                        required: formData.isEmployed
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 408,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 406,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "form-group",
                                                style: {
                                                    flex: 1
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "form-label bn-text",
                                                        children: "পদবী"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 419,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        name: "jobTitle",
                                                        value: formData.jobTitle,
                                                        onChange: handleChange,
                                                        placeholder: "আপনার পদবী লিখুন",
                                                        className: "form-input bn-text",
                                                        required: formData.isEmployed
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RegisterClient.js",
                                                        lineNumber: 420,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/RegisterClient.js",
                                                lineNumber: 418,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/RegisterClient.js",
                                        lineNumber: 405,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '2.5rem'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "btn-modern-submit w-full bn-text",
                                            style: {
                                                width: '100%',
                                                padding: '1rem',
                                                background: '#0f172a',
                                                color: '#fff',
                                                borderRadius: '12px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                                fontSize: '1.1rem'
                                            },
                                            disabled: loading || isCheckingAny || hasDuplicateError,
                                            children: loading ? 'সাবমিট হচ্ছে...' : 'নিবন্ধন করুন'
                                        }, void 0, false, {
                                            fileName: "[project]/components/RegisterClient.js",
                                            lineNumber: 434,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/RegisterClient.js",
                                        lineNumber: 433,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/RegisterClient.js",
                                lineNumber: 268,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "photo-column",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "form-label bn-text",
                                            style: {
                                                marginBottom: '1rem'
                                            },
                                            children: "ছবি আপলোড করুন"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RegisterClient.js",
                                            lineNumber: 454,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "upload-box",
                                            onClick: ()=>document.getElementById('photo-upload').click(),
                                            style: {
                                                border: '2px dashed #cbd5e1',
                                                borderRadius: '16px',
                                                padding: '2rem',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                background: '#f8fafc',
                                                minHeight: '200px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            },
                                            children: [
                                                preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "preview-container",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: preview,
                                                            alt: "Preview",
                                                            className: "photo-preview",
                                                            style: {
                                                                maxWidth: '100%',
                                                                borderRadius: '12px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RegisterClient.js",
                                                            lineNumber: 471,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "change-photo bn-text",
                                                            style: {
                                                                marginTop: '0.75rem',
                                                                color: '#3b82f6',
                                                                fontSize: '0.875rem'
                                                            },
                                                            children: "ছবি পরিবর্তন করুন"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RegisterClient.js",
                                                            lineNumber: 472,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/RegisterClient.js",
                                                    lineNumber: 470,
                                                    columnNumber: 41
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "upload-placeholder",
                                                    style: {
                                                        color: '#64748b'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                            size: 40,
                                                            style: {
                                                                marginBottom: '1rem',
                                                                margin: '0 auto'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RegisterClient.js",
                                                            lineNumber: 476,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "bn-text",
                                                            style: {
                                                                fontWeight: 600,
                                                                marginBottom: '0.25rem'
                                                            },
                                                            children: "ক্লিক করুন বা টেনে আনুন"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RegisterClient.js",
                                                            lineNumber: 477,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "bn-text",
                                                            style: {
                                                                fontSize: '0.8rem'
                                                            },
                                                            children: "PNG, JPG (সর্বোচ্চ 5MB)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/RegisterClient.js",
                                                            lineNumber: 478,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/RegisterClient.js",
                                                    lineNumber: 475,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "photo-upload",
                                                    type: "file",
                                                    accept: "image/png, image/jpeg, image/jpg",
                                                    onChange: handlePhotoChange,
                                                    required: true,
                                                    style: {
                                                        display: 'none'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/RegisterClient.js",
                                                    lineNumber: 481,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/RegisterClient.js",
                                            lineNumber: 456,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RegisterClient.js",
                                    lineNumber: 453,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/RegisterClient.js",
                                lineNumber: 452,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RegisterClient.js",
                        lineNumber: 266,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/RegisterClient.js",
                    lineNumber: 265,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/RegisterClient.js",
            lineNumber: 239,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/RegisterClient.js",
        lineNumber: 238,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=_e464f6f6._.js.map