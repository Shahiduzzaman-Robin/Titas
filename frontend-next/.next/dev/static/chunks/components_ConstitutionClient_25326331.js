(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ConstitutionClient.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConstitutionClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const SECTIONS = [
    {
        id: 'preamble',
        title: 'প্রস্তাবনা'
    },
    {
        id: 'article-1',
        title: 'অনুচ্ছেদ ১: নামকরণ'
    },
    {
        id: 'article-2',
        title: 'অনুচ্ছেদ ২: কার্য্যালয়'
    },
    {
        id: 'article-3',
        title: 'অনুচ্ছেদ ৩: মনোগ্রাম'
    },
    {
        id: 'article-4',
        title: 'অনুচ্ছেদ ৪: সংগঠনের ধরণ'
    },
    {
        id: 'article-5',
        title: 'অনুচ্ছেদ ৫: সংগঠনের লক্ষ্য'
    },
    {
        id: 'article-6',
        title: 'অনুচ্ছেদ ৬: সদস্য'
    },
    {
        id: 'article-7',
        title: 'অনুচ্ছেদ ৭: কার্যনির্বাহী কমিটি'
    },
    {
        id: 'article-8',
        title: 'অনুচ্ছেদ ৮: কমিটির কাঠামো'
    },
    {
        id: 'article-9',
        title: 'অনুচ্ছেদ ৯: কমিটির কার্যাবলী'
    },
    {
        id: 'article-10',
        title: 'অনুচ্ছেদ ১০: পদ রহিতকরণ'
    },
    {
        id: 'article-11',
        title: 'অনুচ্ছেদ ১১: আর্থিক স্বচ্ছতা'
    },
    {
        id: 'article-12',
        title: 'অনুচ্ছেদ ১২: গঠনতন্ত্র সংশোধন'
    },
    {
        id: 'article-13',
        title: 'অনুচ্ছেদ ১৩: নির্বাচন'
    }
];
function ConstitutionClient() {
    _s();
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('preamble');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConstitutionClient.useEffect": ()=>{
            const handleScroll = {
                "ConstitutionClient.useEffect.handleScroll": ()=>{
                    const offsets = SECTIONS.map({
                        "ConstitutionClient.useEffect.handleScroll.offsets": (s)=>{
                            const el = document.getElementById(s.id);
                            if (!el) return {
                                id: s.id,
                                top: Infinity
                            };
                            return {
                                id: s.id,
                                top: Math.abs(el.getBoundingClientRect().top - 120)
                            };
                        }
                    }["ConstitutionClient.useEffect.handleScroll.offsets"]);
                    const closest = offsets.reduce({
                        "ConstitutionClient.useEffect.handleScroll.closest": (a, b)=>a.top < b.top ? a : b
                    }["ConstitutionClient.useEffect.handleScroll.closest"]);
                    setActiveSection(closest.id);
                }
            }["ConstitutionClient.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll, {
                passive: true
            });
            return ({
                "ConstitutionClient.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["ConstitutionClient.useEffect"];
        }
    }["ConstitutionClient.useEffect"], []);
    const scrollToSection = (e, id)=>{
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "constitution-toc",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "সূচিপত্র"
            }, void 0, false, {
                fileName: "[project]/components/ConstitutionClient.js",
                lineNumber: 59,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "toc-list",
                children: SECTIONS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: `#${s.id}`,
                            className: activeSection === s.id ? 'active bn-text' : 'bn-text',
                            onClick: (e)=>scrollToSection(e, s.id),
                            children: s.title
                        }, void 0, false, {
                            fileName: "[project]/components/ConstitutionClient.js",
                            lineNumber: 63,
                            columnNumber: 25
                        }, this)
                    }, s.id, false, {
                        fileName: "[project]/components/ConstitutionClient.js",
                        lineNumber: 62,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ConstitutionClient.js",
                lineNumber: 60,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ConstitutionClient.js",
        lineNumber: 58,
        columnNumber: 9
    }, this);
}
_s(ConstitutionClient, "OO4iey74YF19XGrXFrsBu69nats=");
_c = ConstitutionClient;
var _c;
__turbopack_context__.k.register(_c, "ConstitutionClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_ConstitutionClient_25326331.js.map