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
"[project]/components/CommentSection.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommentSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CustomSelect.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const timeAgo = (value)=>{
    if (!value) return '';
    try {
        const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    } catch (e) {
        return '';
    }
};
function CommentSection({ slug, initialComments, apiBaseUrl }) {
    _s();
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialComments || []);
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('relevant');
    const [commentText, setCommentText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [submittingComment, setSubmittingComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const mainInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [clientId, setClientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommentSection.useEffect": ()=>{
            const getClientId = {
                "CommentSection.useEffect.getClientId": ()=>{
                    try {
                        let id = localStorage.getItem('titas_client_id');
                        if (!id) {
                            id = `c_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
                            localStorage.setItem('titas_client_id', id);
                        }
                        setClientId(id);
                    } catch (e) {
                        console.error('LocalStorage not available');
                    }
                }
            }["CommentSection.useEffect.getClientId"];
            getClientId();
        }
    }["CommentSection.useEffect"], []);
    const sortedComments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CommentSection.useMemo[sortedComments]": ()=>{
            const items = [
                ...comments
            ];
            if (sortBy === 'relevant') {
                return items.sort({
                    "CommentSection.useMemo[sortedComments]": (a, b)=>(b.likes || 0) - (a.likes || 0)
                }["CommentSection.useMemo[sortedComments]"]);
            } else if (sortBy === 'newest') {
                return items.sort({
                    "CommentSection.useMemo[sortedComments]": (a, b)=>new Date(b.createdAt) - new Date(a.createdAt)
                }["CommentSection.useMemo[sortedComments]"]);
            } else if (sortBy === 'oldest') {
                return items.sort({
                    "CommentSection.useMemo[sortedComments]": (a, b)=>new Date(a.createdAt) - new Date(b.createdAt)
                }["CommentSection.useMemo[sortedComments]"]);
            }
            return items;
        }
    }["CommentSection.useMemo[sortedComments]"], [
        comments,
        sortBy
    ]);
    const handlePost = async ()=>{
        const text = mainInputRef.current?.innerText?.trim() || '';
        if (!text) return;
        setSubmittingComment(true);
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${apiBaseUrl}/api/blog/posts/${slug}/comments`, {
                name: 'You',
                text
            });
            const newComment = res.data?.comment || {
                id: `comment-${Date.now()}`,
                name: 'You',
                text,
                createdAt: new Date().toISOString(),
                likes: 0,
                likedBy: []
            };
            setComments((prev)=>[
                    newComment,
                    ...prev
                ]);
            if (mainInputRef.current) mainInputRef.current.innerText = '';
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally{
            setSubmittingComment(false);
        }
    };
    const handleLike = async (comment)=>{
        if (!clientId) return;
        const commentId = comment.id || comment._id;
        try {
            // Optimistic update
            setComments((prev)=>prev.map((c)=>{
                    const cid = c.id || c._id;
                    if (String(cid) !== String(commentId)) return c;
                    const likedBy = Array.isArray(c.likedBy) ? [
                        ...c.likedBy
                    ] : [];
                    const already = likedBy.includes(clientId);
                    if (already) {
                        const idx = likedBy.indexOf(clientId);
                        if (idx >= 0) likedBy.splice(idx, 1);
                        return {
                            ...c,
                            likes: Math.max(0, (c.likes || 0) - 1),
                            likedBy
                        };
                    }
                    likedBy.push(clientId);
                    return {
                        ...c,
                        likes: (c.likes || 0) + 1,
                        likedBy
                    };
                }));
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${apiBaseUrl}/api/blog/posts/${slug}/comments`, {
                action: 'like',
                commentId,
                clientId
            });
            if (res.data?.comment) {
                const updated = res.data.comment;
                setComments((prev)=>prev.map((c)=>String(c.id || c._id) === String(commentId) ? {
                            ...c,
                            likes: updated.likes,
                            likedBy: updated.likedBy || []
                        } : c));
            }
        } catch (err) {
            console.error('Like failed', err);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "comments-wrap modern-surface",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "comments-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "comments-header-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: "Comments"
                            }, void 0, false, {
                                fileName: "[project]/components/CommentSection.js",
                                lineNumber: 131,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    comments.length,
                                    " discussion",
                                    comments.length !== 1 ? 's' : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CommentSection.js",
                                lineNumber: 132,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CommentSection.js",
                        lineNumber: 130,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "comments-sorting",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CustomSelect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            value: sortBy,
                            onChange: (e)=>setSortBy(e.target.value),
                            options: [
                                {
                                    value: 'relevant',
                                    label: 'Most Relevant'
                                },
                                {
                                    value: 'newest',
                                    label: 'Newest'
                                },
                                {
                                    value: 'oldest',
                                    label: 'Oldest'
                                }
                            ],
                            className: "sorting-custom-select",
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/components/CommentSection.js",
                            lineNumber: 135,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/CommentSection.js",
                        lineNumber: 134,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CommentSection.js",
                lineNumber: 129,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "comment-form-fb",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "comment-form-avatar",
                        children: "U"
                    }, void 0, false, {
                        fileName: "[project]/components/CommentSection.js",
                        lineNumber: 150,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "comment-form-main",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "comment-form-bubble",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: mainInputRef,
                                    contentEditable: true,
                                    className: "comment-form-input",
                                    "data-placeholder": "Write a comment...",
                                    onKeyDown: (e)=>{
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handlePost();
                                        }
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/CommentSection.js",
                                    lineNumber: 155,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "comment-form-divider"
                                }, void 0, false, {
                                    fileName: "[project]/components/CommentSection.js",
                                    lineNumber: 167,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "comment-form-footer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "comment-form-actions"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CommentSection.js",
                                            lineNumber: 169,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "comment-post-btn",
                                            onClick: handlePost,
                                            disabled: submittingComment,
                                            children: submittingComment ? '...' : 'Post'
                                        }, void 0, false, {
                                            fileName: "[project]/components/CommentSection.js",
                                            lineNumber: 170,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CommentSection.js",
                                    lineNumber: 168,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CommentSection.js",
                            lineNumber: 154,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/CommentSection.js",
                        lineNumber: 153,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CommentSection.js",
                lineNumber: 149,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "comment-list-fb",
                children: sortedComments.map((item)=>{
                    const cid = item.id || item._id;
                    const likedByServer = item.likedBy || [];
                    const isLiked = clientId && likedByServer.includes(clientId);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "comment-item-fb",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "comment-avatar-fb",
                                children: String(item.name || 'U').charAt(0).toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/components/CommentSection.js",
                                lineNumber: 189,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "comment-content-fb",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "comment-bubble-fb",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "comment-author-fb",
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/CommentSection.js",
                                                lineNumber: 194,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "comment-text-fb",
                                                children: item.text
                                            }, void 0, false, {
                                                fileName: "[project]/components/CommentSection.js",
                                                lineNumber: 195,
                                                columnNumber: 37
                                            }, this),
                                            (item.likes > 0 || isLiked) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "comment-reaction-badge",
                                                onClick: ()=>handleLike(item),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "reaction-icon",
                                                        children: "❤️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CommentSection.js",
                                                        lineNumber: 201,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "reaction-count",
                                                        children: item.likes || 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CommentSection.js",
                                                        lineNumber: 202,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CommentSection.js",
                                                lineNumber: 197,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CommentSection.js",
                                        lineNumber: 193,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "comment-meta-fb",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `meta-action-btn ${isLiked ? 'active' : ''}`,
                                                onClick: ()=>handleLike(item),
                                                children: isLiked ? 'Loved' : 'Love'
                                            }, void 0, false, {
                                                fileName: "[project]/components/CommentSection.js",
                                                lineNumber: 207,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "meta-dot",
                                                children: "•"
                                            }, void 0, false, {
                                                fileName: "[project]/components/CommentSection.js",
                                                lineNumber: 213,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "comment-time-fb",
                                                children: timeAgo(item.createdAt)
                                            }, void 0, false, {
                                                fileName: "[project]/components/CommentSection.js",
                                                lineNumber: 214,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CommentSection.js",
                                        lineNumber: 206,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CommentSection.js",
                                lineNumber: 192,
                                columnNumber: 29
                            }, this)
                        ]
                    }, cid, true, {
                        fileName: "[project]/components/CommentSection.js",
                        lineNumber: 188,
                        columnNumber: 25
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/CommentSection.js",
                lineNumber: 182,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/CommentSection.js",
        lineNumber: 128,
        columnNumber: 9
    }, this);
}
_s(CommentSection, "uDfptGcy3z9DSH1TsfPzHAOm5QI=");
_c = CommentSection;
var _c;
__turbopack_context__.k.register(_c, "CommentSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ViewCounter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewCounter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ViewCounter({ slug, apiBaseUrl }) {
    _s();
    const viewCountedFor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewCounter.useEffect": ()=>{
            const incrementView = {
                "ViewCounter.useEffect.incrementView": async ()=>{
                    if (viewCountedFor.current === slug) return;
                    // Mark as counted immediately to prevent double-calls in Strict Mode
                    viewCountedFor.current = slug;
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${apiBaseUrl}/api/blog/posts/${slug}/view`);
                    } catch (error) {
                        console.error('Failed to increment view count:', error);
                    // On error, we could potentially reset to allow retry, 
                    // but usually better to avoid spamming the server.
                    }
                }
            }["ViewCounter.useEffect.incrementView"];
            incrementView();
        }
    }["ViewCounter.useEffect"], [
        slug,
        apiBaseUrl
    ]);
    return null;
}
_s(ViewCounter, "lPl1U6cIF9IYUbhNYQIdKgO1FhY=");
_c = ViewCounter;
var _c;
__turbopack_context__.k.register(_c, "ViewCounter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_4b63e3ff._.js.map