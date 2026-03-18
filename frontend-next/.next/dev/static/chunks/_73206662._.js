(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/CustomSelect.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$react$2d$select$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-select/dist/react-select.esm.js [app-client] (ecmascript) <locals>");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "custom-select-wrapper",
        style: {
            position: 'relative'
        },
        children: [
            Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$react$2d$select$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
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
_c = CustomSelect;
const __TURBOPACK__default__export__ = CustomSelect;
var _c;
__turbopack_context__.k.register(_c, "CustomSelect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/TrainAnimation.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
;
const TrainAnimation = ({ className = '' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `train-graphic-container ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "train-track-area",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: "/train.svg",
                    alt: "Titas Train",
                    className: "moving-train"
                }, void 0, false, {
                    fileName: "[project]/components/TrainAnimation.js",
                    lineNumber: 8,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "track-rail"
                }, void 0, false, {
                    fileName: "[project]/components/TrainAnimation.js",
                    lineNumber: 9,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "track-sleepers",
                    children: [
                        ...Array(20)
                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sleeper"
                        }, i, false, {
                            fileName: "[project]/components/TrainAnimation.js",
                            lineNumber: 12,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/components/TrainAnimation.js",
                    lineNumber: 10,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/TrainAnimation.js",
            lineNumber: 7,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/TrainAnimation.js",
        lineNumber: 6,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c = TrainAnimation;
const __TURBOPACK__default__export__ = TrainAnimation;
var _c;
__turbopack_context__.k.register(_c, "TrainAnimation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/StudentsClient.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StudentsClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-user.js [app-client] (ecmascript) <export default as UserCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building.js [app-client] (ecmascript) <export default as Building>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-client] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CustomSelect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TrainAnimation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TrainAnimation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function StudentsClient({ initialStudents, initialFilters, apiBaseUrl }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    const [students, setStudents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialStudents);
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFilters);
    // Update students when initialStudents (from server) change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StudentsClient.useEffect": ()=>{
            setStudents(initialStudents);
        }
    }["StudentsClient.useEffect"], [
        initialStudents
    ]);
    const handleFilterChange = (e)=>{
        const { name, value } = e.target;
        const newFilters = {
            ...filters,
            [name]: value
        };
        setFilters(newFilters);
        const params = new URLSearchParams(searchParams);
        if (value) params.set(name, value);
        else params.delete(name);
        startTransition(()=>{
            router.push(`${pathname}?${params.toString()}`);
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "students-page",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            style: {
                paddingTop: '2rem',
                paddingBottom: '4rem'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "page-header flex-between",
                    style: {
                        marginBottom: '2rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "title-group flex-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "bn-text",
                                    style: {
                                        fontSize: '1.5rem',
                                        margin: 0
                                    },
                                    children: "শিক্ষার্থী তালিকা"
                                }, void 0, false, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 46,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "student-count badge bn-text",
                                    children: [
                                        students.length,
                                        " জন"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 47,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StudentsClient.js",
                            lineNumber: 45,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "search-box",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    size: 18,
                                    className: "search-icon"
                                }, void 0, false, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 50,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    name: "search",
                                    value: filters.search,
                                    onChange: (e)=>{
                                        const val = e.target.value;
                                        setFilters((prev)=>({
                                                ...prev,
                                                search: val
                                            }));
                                        // We might want to debounce this in a real app, but for now simple update
                                        const params = new URLSearchParams(searchParams);
                                        if (val) params.set('search', val);
                                        else params.delete('search');
                                        startTransition(()=>{
                                            router.push(`${pathname}?${params.toString()}`);
                                        });
                                    },
                                    placeholder: "নাম, ফোন ইত্যাদি দিয়ে খুঁজুন...",
                                    className: "bn-text search-input"
                                }, void 0, false, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 51,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/StudentsClient.js",
                            lineNumber: 49,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/StudentsClient.js",
                    lineNumber: 44,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "filters-capsule",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filters-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-item dept-f",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: "department",
                                    value: filters.department,
                                    onChange: handleFilterChange,
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["departmentOptions"],
                                    placeholder: "সকল ডিপার্টমেন্ট",
                                    Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"]
                                }, void 0, false, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 76,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/StudentsClient.js",
                                lineNumber: 75,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-item session-f",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: "session",
                                    value: filters.session,
                                    onChange: handleFilterChange,
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionOptions"],
                                    placeholder: "সকল সেশন",
                                    Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"]
                                }, void 0, false, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 82,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/StudentsClient.js",
                                lineNumber: 81,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-item hall-f",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: "hall",
                                    value: filters.hall,
                                    onChange: handleFilterChange,
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hallOptions"],
                                    placeholder: "সকল হল",
                                    Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"]
                                }, void 0, false, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 88,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/StudentsClient.js",
                                lineNumber: 87,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-item blood-f",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: "bloodGroup",
                                    value: filters.bloodGroup,
                                    onChange: handleFilterChange,
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bloodGroupOptions"],
                                    placeholder: "রক্তের গ্রুপ",
                                    Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"]
                                }, void 0, false, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 94,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/StudentsClient.js",
                                lineNumber: 93,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-item upazila-f",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: "upazila",
                                    value: filters.upazila,
                                    onChange: handleFilterChange,
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upazilaOptions"],
                                    placeholder: "সকল উপজেলা",
                                    Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"]
                                }, void 0, false, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 100,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/StudentsClient.js",
                                lineNumber: 99,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filter-train-container",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TrainAnimation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: "filter-train"
                                }, void 0, false, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 106,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/StudentsClient.js",
                                lineNumber: 105,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/StudentsClient.js",
                        lineNumber: 74,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/StudentsClient.js",
                    lineNumber: 73,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `student-grid ${isPending ? 'opacity-50' : ''}`,
                    children: students.map((student)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "student-card card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "card-profile",
                                    children: [
                                        student.photo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'relative',
                                                width: '64px',
                                                height: '64px',
                                                borderRadius: '50%',
                                                overflow: 'hidden'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: `${apiBaseUrl}${student.photo}`,
                                                alt: student.nameBn,
                                                fill: true,
                                                style: {
                                                    objectFit: 'cover'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/StudentsClient.js",
                                                lineNumber: 120,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StudentsClient.js",
                                            lineNumber: 119,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "profile-placeholder bg-gray",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle$3e$__["UserCircle"], {
                                                size: 48,
                                                className: "text-gray"
                                            }, void 0, false, {
                                                fileName: "[project]/components/StudentsClient.js",
                                                lineNumber: 129,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/StudentsClient.js",
                                            lineNumber: 128,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "profile-info",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "bn-text",
                                                    children: student.nameBn
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 134,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "profile-meta flex-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "id-badge bn-text",
                                                            children: [
                                                                "ID: ",
                                                                student.originalId || (student.regNo || '').slice(-4)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/StudentsClient.js",
                                                            lineNumber: 136,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "session-text bn-text",
                                                            children: [
                                                                "| ",
                                                                student.session
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/StudentsClient.js",
                                                            lineNumber: 137,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 135,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StudentsClient.js",
                                            lineNumber: 133,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "blood-badge",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "drop-icon",
                                                    children: "🩸"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 142,
                                                    columnNumber: 37
                                                }, this),
                                                student.bloodGroup
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StudentsClient.js",
                                            lineNumber: 141,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 117,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "card-details",
                                    children: [
                                        student.isEmployed && student.jobTitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "detail-item role-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"], {
                                                    size: 16,
                                                    className: "text-blue"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 151,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "primary-text bn-text",
                                                            children: student.jobTitle
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StudentsClient.js",
                                                            lineNumber: 153,
                                                            columnNumber: 45
                                                        }, this),
                                                        student.organization && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "secondary-text bn-text",
                                                            children: student.organization
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/StudentsClient.js",
                                                            lineNumber: 155,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 152,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StudentsClient.js",
                                            lineNumber: 150,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "detail-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                                    size: 16,
                                                    className: "text-muted"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 161,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "bn-text",
                                                    children: student.department
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 162,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StudentsClient.js",
                                            lineNumber: 160,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "detail-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building$3e$__["Building"], {
                                                    size: 16,
                                                    className: "text-muted"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 165,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "bn-text",
                                                    children: student.hall
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 166,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StudentsClient.js",
                                            lineNumber: 164,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "detail-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                    size: 16,
                                                    className: "text-muted"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 169,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "bn-text",
                                                    children: [
                                                        student.upazila,
                                                        ", ব্রাহ্মণবাড়িয়া"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 170,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StudentsClient.js",
                                            lineNumber: 168,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 148,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "card-contact",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "contact-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    size: 14,
                                                    className: "text-muted"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 177,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "en-text",
                                                    children: student.mobileMasked
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 178,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StudentsClient.js",
                                            lineNumber: 176,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "contact-item",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    size: 14,
                                                    className: "text-muted"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 181,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "en-text",
                                                    children: student.email
                                                }, void 0, false, {
                                                    fileName: "[project]/components/StudentsClient.js",
                                                    lineNumber: 182,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/StudentsClient.js",
                                            lineNumber: 180,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/StudentsClient.js",
                                    lineNumber: 175,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, student._id, true, {
                            fileName: "[project]/components/StudentsClient.js",
                            lineNumber: 114,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/StudentsClient.js",
                    lineNumber: 112,
                    columnNumber: 17
                }, this),
                students.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    style: {
                        padding: '4rem 0',
                        color: 'var(--text-muted)'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "bn-text",
                        children: "কোনো শিক্ষার্থী পাওয়া যায়নি।"
                    }, void 0, false, {
                        fileName: "[project]/components/StudentsClient.js",
                        lineNumber: 192,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/StudentsClient.js",
                    lineNumber: 191,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/StudentsClient.js",
            lineNumber: 41,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/StudentsClient.js",
        lineNumber: 40,
        columnNumber: 9
    }, this);
}
_s(StudentsClient, "fiak8ATcfM2d0m0P8n3Z6QQpaHs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"]
    ];
});
_c = StudentsClient;
var _c;
__turbopack_context__.k.register(_c, "StudentsClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_73206662._.js.map