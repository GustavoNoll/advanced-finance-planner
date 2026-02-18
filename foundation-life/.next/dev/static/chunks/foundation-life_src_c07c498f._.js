(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/foundation-life/src/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const url = ("TURBOPACK compile-time value", "https://rhvfzhcnzcpkhwhohuar.supabase.co");
const anonKey = ("TURBOPACK compile-time value", "sb_publishable_0JaAjQcWwquabMApdOclUA_1BAt9hL0");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url ?? '', anonKey ?? '');
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/lib/life-defaults.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LIFE_PLAN_DEFAULTS",
    ()=>LIFE_PLAN_DEFAULTS
]);
/**
 * Default values for the life plan (setup inicial).
 * Retorno anual 6%; inflação IPCA+5%.
 */ function getDefaultBirthDate() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 30);
    return d.toISOString().slice(0, 10) // YYYY-MM-DD
    ;
}
const LIFE_PLAN_DEFAULTS = {
    getDefaultBirthDate,
    lifeExpectancyYears: 90,
    baseNetWorth: 0,
    baseMonthlyIncome: 8000,
    baseMonthlyExpenses: 5000,
    monthlyContribution: 1500,
    expectedReturnYearly: 6,
    inflationYearly: 5,
    inflationLabel: 'IPCA+5',
    inflateIncome: true,
    inflateExpenses: true,
    retirementAge: 65,
    retirementMonthlyIncome: 0,
    inflateRetirementIncome: true
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            xl: 'h-12 rounded-lg px-8 text-base',
            icon: 'h-10 w-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/components/ui/button.tsx",
        lineNumber: 43,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = 'Button';
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, type, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/components/ui/input.tsx",
        lineNumber: 9,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = 'Input';
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Label = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/components/ui/label.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Label;
Label.displayName = 'Label';
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Label$React.forwardRef");
__turbopack_context__.k.register(_c1, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('rounded-lg border bg-card text-card-foreground shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/components/ui/card.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = 'Card';
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col space-y-1.5 p-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/components/ui/card.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = 'CardHeader';
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-2xl font-semibold leading-none tracking-tight', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/components/ui/card.tsx",
        lineNumber: 35,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = 'CardTitle';
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm text-muted-foreground', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/components/ui/card.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = 'CardDescription';
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('p-6 pt-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/components/ui/card.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = 'CardContent';
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center p-6 pt-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/components/ui/card.tsx",
        lineNumber: 70,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = 'CardFooter';
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SetupWizard",
    ()=>SetupWizard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/life-defaults.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/card.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const STEPS = [
    {
        key: 'birthDate',
        label: 'Qual sua data de nascimento?',
        type: 'date',
        fromPayload: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].getDefaultBirthDate()
    },
    {
        key: 'lifeExpectancy',
        label: 'Até quantos anos você quer planejar?',
        placeholder: 'Ex: 90',
        min: 60,
        max: 110,
        toValue: (v)=>v,
        fromPayload: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].lifeExpectancyYears
    },
    {
        key: 'baseNetWorth',
        label: 'Qual seu patrimônio atual? (R$)',
        placeholder: '0',
        min: 0,
        step: 1000,
        toValue: (v)=>v,
        fromPayload: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseNetWorth
    },
    {
        key: 'baseMonthlyIncome',
        label: 'Qual sua renda líquida mensal? (R$)',
        placeholder: 'Ex: 8000',
        min: 0,
        step: 500,
        toValue: (v)=>v,
        fromPayload: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseMonthlyIncome
    },
    {
        key: 'baseMonthlyExpenses',
        label: 'Quanto você gasta por mês, em média? (R$)',
        placeholder: 'Ex: 5000',
        min: 0,
        step: 500,
        toValue: (v)=>v,
        fromPayload: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseMonthlyExpenses
    }
];
function SetupWizard({ onComplete, isLoading }) {
    _s();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [values, setValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SetupWizard.useState": ()=>{
            const initial = {};
            STEPS.forEach({
                "SetupWizard.useState": (s)=>{
                    initial[s.key] = s.fromPayload();
                }
            }["SetupWizard.useState"]);
            return initial;
        }
    }["SetupWizard.useState"]);
    const current = STEPS[step];
    const value = values[current.key] ?? current.fromPayload();
    const isDateStep = 'type' in current && current.type === 'date';
    const isLast = step === STEPS.length - 1;
    const progress = (step + 1) / STEPS.length * 100;
    function handleNext() {
        if (isLast) {
            const birthDateRaw = values.birthDate ?? __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].getDefaultBirthDate();
            const birthDateStr = typeof birthDateRaw === 'string' ? birthDateRaw : __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].getDefaultBirthDate();
            onComplete({
                birthDate: new Date(birthDateStr + 'T12:00:00').toISOString(),
                lifeExpectancyYears: values.lifeExpectancy ?? __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].lifeExpectancyYears,
                baseNetWorth: values.baseNetWorth ?? __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseNetWorth,
                baseMonthlyIncome: values.baseMonthlyIncome ?? __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseMonthlyIncome,
                baseMonthlyExpenses: values.baseMonthlyExpenses ?? __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseMonthlyExpenses,
                monthlyContribution: Math.max(0, (values.baseMonthlyIncome ?? __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseMonthlyIncome) - (values.baseMonthlyExpenses ?? __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseMonthlyExpenses)),
                expectedReturnYearly: __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].expectedReturnYearly,
                inflationYearly: __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].inflationYearly,
                inflateIncome: __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].inflateIncome,
                inflateExpenses: __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].inflateExpenses,
                retirementAge: __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].retirementAge,
                retirementMonthlyIncome: __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].retirementMonthlyIncome,
                inflateRetirementIncome: __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].inflateRetirementIncome
            });
        } else {
            setStep((s)=>s + 1);
        }
    }
    function handleBack() {
        if (step > 0) setStep((s)=>s - 1);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "border-border/50 bg-card/50 backdrop-blur-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                    className: "space-y-1 pb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between text-xs text-muted-foreground",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Passo ",
                                    step + 1,
                                    " de ",
                                    STEPS.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 w-full overflow-hidden rounded-full bg-secondary",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full rounded-full bg-primary transition-all duration-300 ease-out",
                                style: {
                                    width: `${progress}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "wizard-input",
                                    className: "text-base font-medium",
                                    children: current.label
                                }, void 0, false, {
                                    fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this),
                                isDateStep ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    id: "wizard-input",
                                    type: "date",
                                    value: typeof value === 'string' ? value : '',
                                    onChange: (e)=>setValues((prev)=>({
                                                ...prev,
                                                [current.key]: e.target.value
                                            })),
                                    onKeyDown: (e)=>e.key === 'Enter' && handleNext(),
                                    className: "h-12 text-base",
                                    autoFocus: true
                                }, void 0, false, {
                                    fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                                    lineNumber: 144,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    id: "wizard-input",
                                    type: "number",
                                    min: 'min' in current ? current.min : undefined,
                                    max: 'max' in current ? current.max : undefined,
                                    step: 'step' in current ? current.step : 1,
                                    value: typeof value === 'number' ? value : Number(value) || 0,
                                    onChange: (e)=>setValues((prev)=>({
                                                ...prev,
                                                [current.key]: Number(e.target.value) || 0
                                            })),
                                    onKeyDown: (e)=>e.key === 'Enter' && handleNext(),
                                    placeholder: 'placeholder' in current ? current.placeholder : undefined,
                                    className: "h-12 text-base",
                                    autoFocus: true
                                }, void 0, false, {
                                    fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                                    lineNumber: 154,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 pt-2",
                            children: [
                                step > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline",
                                    onClick: handleBack,
                                    className: "shrink-0",
                                    children: "Voltar"
                                }, void 0, false, {
                                    fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    onClick: handleNext,
                                    disabled: isLoading,
                                    className: "min-w-[140px] flex-1",
                                    children: isLoading ? 'Criando...' : isLast ? 'Criar meu plano' : 'Continuar'
                                }, void 0, false, {
                                    fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-center text-xs text-muted-foreground",
                            children: [
                                "Premissas: retorno ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].expectedReturnYearly,
                                "% a.a. · Inflação ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].inflationLabel
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                            lineNumber: 191,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
            lineNumber: 126,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
_s(SetupWizard, "FGQTTp+4f5JlW9NGirr9zTbm23s=");
_c = SetupWizard;
var _c;
__turbopack_context__.k.register(_c, "SetupWizard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LifeTimelineChart",
    ()=>LifeTimelineChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/cartesian/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/chart/LineChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const MONTH_NAMES = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
];
function formatShort(value) {
    const abs = Math.abs(value);
    if (abs >= 1e6) return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (abs >= 1e3) return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(Math.round(value));
}
function LifeTimelineChart({ data }) {
    _s();
    const { chartData, showMonthly, xAxisKey, xInterval } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LifeTimelineChart.useMemo": ()=>{
            const isShortRange = data.length > 0 && data.length <= 24;
            if (isShortRange) {
                const points = data.map({
                    "LifeTimelineChart.useMemo.points": (point)=>({
                            label: `${MONTH_NAMES[point.date.getMonth()]} ${point.date.getFullYear()}`,
                            sortKey: point.date.getTime(),
                            netWorth: Math.round(point.netWorth),
                            realNetWorth: Math.round(point.realNetWorth)
                        })
                }["LifeTimelineChart.useMemo.points"]);
                return {
                    chartData: points,
                    showMonthly: true,
                    xAxisKey: 'label',
                    xInterval: 0
                };
            }
            const yearlyPoints = data.filter({
                "LifeTimelineChart.useMemo.yearlyPoints": (point)=>point.date.getMonth() === 0
            }["LifeTimelineChart.useMemo.yearlyPoints"]);
            const points = yearlyPoints.map({
                "LifeTimelineChart.useMemo.points": (point)=>({
                        label: String(point.date.getFullYear()),
                        sortKey: point.date.getTime(),
                        netWorth: Math.round(point.netWorth),
                        realNetWorth: Math.round(point.realNetWorth)
                    })
            }["LifeTimelineChart.useMemo.points"]);
            const interval = points.length > 20 ? Math.floor(points.length / 10) : 0;
            return {
                chartData: points,
                showMonthly: false,
                xAxisKey: 'label',
                xInterval: interval
            };
        }
    }["LifeTimelineChart.useMemo"], [
        data
    ]);
    if (chartData.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-64 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground",
            children: "Nenhum dado no período selecionado. Altere o filtro ou configure seus dados."
        }, void 0, false, {
            fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-72 w-full rounded-xl border border-border bg-muted/20 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
            width: "100%",
            height: "100%",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineChart"], {
                data: chartData,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                        strokeDasharray: "3 3",
                        className: "stroke-border"
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                        dataKey: xAxisKey,
                        className: "text-muted-foreground",
                        tickLine: false,
                        interval: showMonthly && chartData.length > 6 ? 'preserveStartEnd' : xInterval
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                        className: "text-muted-foreground",
                        tickLine: false,
                        tickFormatter: formatShort
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                        contentStyle: {
                            backgroundColor: 'hsl(var(--card))',
                            borderRadius: 8,
                            border: '1px solid hsl(var(--border))',
                            fontSize: 12
                        },
                        formatter: (value, name)=>[
                                formatShort(value),
                                name
                            ]
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                        type: "monotone",
                        dataKey: "netWorth",
                        stroke: "#3b82f6",
                        strokeWidth: 2,
                        dot: false,
                        name: "Patrimônio (nominal)"
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                        type: "monotone",
                        dataKey: "realNetWorth",
                        stroke: "#22c55e",
                        strokeWidth: 2,
                        dot: false,
                        name: "Patrimônio (real)"
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(LifeTimelineChart, "2nKCZWbhomJsbAd8lJyDvkENo7U=");
_c = LifeTimelineChart;
var _c;
__turbopack_context__.k.register(_c, "LifeTimelineChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LifeProjectionTable",
    ()=>LifeProjectionTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const MONTH_NAMES = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
];
function formatBRL(value) {
    return Math.round(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
function LifeProjectionTable({ yearlyData, monthlyData }) {
    _s();
    const [expandedYear, setExpandedYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const monthlyByYear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LifeProjectionTable.useMemo[monthlyByYear]": ()=>{
            const map = new Map();
            for (const p of monthlyData){
                const y = p.date.getFullYear();
                if (!map.has(y)) map.set(y, []);
                map.get(y).push(p);
            }
            map.forEach({
                "LifeProjectionTable.useMemo[monthlyByYear]": (arr)=>arr.sort({
                        "LifeProjectionTable.useMemo[monthlyByYear]": (a, b)=>a.date.getTime() - b.date.getTime()
                    }["LifeProjectionTable.useMemo[monthlyByYear]"])
            }["LifeProjectionTable.useMemo[monthlyByYear]"]);
            return map;
        }
    }["LifeProjectionTable.useMemo[monthlyByYear]"], [
        monthlyData
    ]);
    if (!yearlyData.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg border border-border bg-muted/20 py-8 text-center text-sm text-muted-foreground",
            children: "Nenhum dado no período. Altere o filtro acima."
        }, void 0, false, {
            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-2xl border border-border bg-muted/10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            className: "min-w-full divide-y divide-border text-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                    className: "bg-muted/50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "w-8 px-2 py-2",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                lineNumber: 48,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                children: "Ano"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                lineNumber: 49,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                children: "Idade"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                lineNumber: 52,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                children: "Renda anual"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                lineNumber: 55,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                children: "Gastos anuais"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                lineNumber: 58,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                children: "Aportes"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                lineNumber: 61,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                className: "px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                children: "Patrimônio final"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                lineNumber: 64,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                        lineNumber: 47,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                    lineNumber: 46,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                    className: "divide-y divide-border",
                    children: yearlyData.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('cursor-pointer transition-colors hover:bg-muted/50', expandedYear === row.year && 'bg-muted/50'),
                                    onClick: ()=>setExpandedYear((y)=>y === row.year ? null : row.year),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "w-8 px-2 py-2 text-muted-foreground",
                                            children: expandedYear === row.year ? '▼' : '▶'
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                            lineNumber: 79,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2 text-foreground",
                                            children: row.year
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                            lineNumber: 82,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2 text-right text-muted-foreground",
                                            children: row.age
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                            lineNumber: 83,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2 text-right text-muted-foreground",
                                            children: formatBRL(row.income)
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                            lineNumber: 84,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2 text-right text-muted-foreground",
                                            children: formatBRL(row.expenses)
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                            lineNumber: 87,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2 text-right text-muted-foreground",
                                            children: formatBRL(row.contribution)
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                            lineNumber: 90,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2 text-right font-medium text-foreground",
                                            children: formatBRL(row.netWorth)
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                            lineNumber: 93,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                    lineNumber: 72,
                                    columnNumber: 17
                                }, this),
                                expandedYear === row.year && (()=>{
                                    const months = monthlyByYear.get(row.year) ?? [];
                                    if (!months.length) {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: 7,
                                                className: "bg-muted/20 px-4 py-2 text-center text-xs text-muted-foreground",
                                                children: "Nenhum dado mensal para este ano."
                                            }, void 0, false, {
                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                lineNumber: 102,
                                                columnNumber: 25
                                            }, this)
                                        }, `${row.year}-empty`, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                            lineNumber: 101,
                                            columnNumber: 23
                                        }, this);
                                    }
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 7,
                                            className: "bg-muted/20 p-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "min-w-full text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "border-b border-border/50 text-muted-foreground",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-1.5 text-left",
                                                                    children: "Mês"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                    lineNumber: 114,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-1.5 text-right",
                                                                    children: "Idade"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                    lineNumber: 115,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-1.5 text-right",
                                                                    children: "Renda"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                    lineNumber: 116,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-1.5 text-right",
                                                                    children: "Gastos"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                    lineNumber: 117,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-1.5 text-right",
                                                                    children: "Aporte"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                    lineNumber: 118,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-1.5 text-right",
                                                                    children: "Patrimônio"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                    lineNumber: 119,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                            lineNumber: 113,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                        lineNumber: 112,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        children: months.map((m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: "border-b border-border/30 last:border-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-1.5 text-muted-foreground",
                                                                        children: [
                                                                            MONTH_NAMES[m.date.getMonth()],
                                                                            " ",
                                                                            m.date.getFullYear()
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                        lineNumber: 125,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-1.5 text-right text-muted-foreground",
                                                                        children: m.age
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                        lineNumber: 128,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-1.5 text-right text-muted-foreground",
                                                                        children: formatBRL(m.income)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                        lineNumber: 129,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-1.5 text-right text-muted-foreground",
                                                                        children: formatBRL(m.expenses)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                        lineNumber: 132,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-1.5 text-right text-muted-foreground",
                                                                        children: formatBRL(m.contribution)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                        lineNumber: 135,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-1.5 text-right font-medium text-foreground",
                                                                        children: formatBRL(m.netWorth)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                        lineNumber: 138,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                lineNumber: 124,
                                                                columnNumber: 31
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                lineNumber: 111,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                            lineNumber: 110,
                                            columnNumber: 23
                                        }, this)
                                    }, `${row.year}-monthly`, false, {
                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                        lineNumber: 109,
                                        columnNumber: 21
                                    }, this);
                                })()
                            ]
                        }, row.year, true, {
                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                            lineNumber: 71,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                    lineNumber: 69,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
            lineNumber: 45,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(LifeProjectionTable, "MF/qzzmAxDkeryHDviW0DGEOEW4=");
_c = LifeProjectionTable;
var _c;
__turbopack_context__.k.register(_c, "LifeProjectionTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/timeline/constants/event-types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EVENT_TYPES",
    ()=>EVENT_TYPES,
    "EVENT_TYPE_LABELS",
    ()=>EVENT_TYPE_LABELS
]);
const EVENT_TYPE_LABELS = {
    goal: 'Objetivo / Meta',
    contribution: 'Aporte',
    car: 'Carro',
    house: 'Casa / Imóvel',
    travel: 'Viagem',
    accident: 'Imprevisto / Acidente',
    renovation: 'Reforma',
    other: 'Outro'
};
const EVENT_TYPES = [
    'goal',
    'contribution',
    'car',
    'house',
    'travel',
    'accident',
    'renovation',
    'other'
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LifeEventForm",
    ()=>LifeEventForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$constants$2f$event$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/timeline/constants/event-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
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
const selectClassName = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
function LifeEventForm({ onSubmit, onCancel }) {
    _s();
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('contribution');
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [date, setDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "LifeEventForm.useState": ()=>new Date().toISOString().slice(0, 10)
    }["LifeEventForm.useState"]);
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [frequency, setFrequency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('once');
    const [inflationIndexed, setInflationIndexed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({
            type,
            title: title.trim(),
            date: new Date(date).toISOString(),
            amount: Number(amount) || 0,
            frequency,
            inflationIndexed
        });
        setTitle('');
        setAmount(0);
        setDate(new Date().toISOString().slice(0, 10));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                className: "pb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                    className: "text-base",
                    children: "Novo evento de vida"
                }, void 0, false, {
                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 sm:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Tipo"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 62,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: type,
                                            onChange: (e)=>setType(e.target.value),
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(selectClassName),
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$constants$2f$event$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EVENT_TYPES"].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: t,
                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$constants$2f$event$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EVENT_TYPE_LABELS"][t]
                                                }, t, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                                    lineNumber: 69,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 63,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Título"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 76,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            value: title,
                                            onChange: (e)=>setTitle(e.target.value),
                                            placeholder: "Ex: Promoção, Compra do carro"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 77,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Data"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 84,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            type: "date",
                                            value: date,
                                            onChange: (e)=>setDate(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 85,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Valor (R$)"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 88,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            type: "number",
                                            step: "0.01",
                                            value: amount || '',
                                            onChange: (e)=>setAmount(Number(e.target.value)),
                                            placeholder: "0"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 89,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Frequência"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 98,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: frequency,
                                            onChange: (e)=>setFrequency(e.target.value),
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(selectClassName),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "once",
                                                    children: "Uma vez"
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                                    lineNumber: 104,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "monthly",
                                                    children: "Mensal"
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "yearly",
                                                    children: "Anual"
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 99,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 pt-8 sm:col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            id: "inflation",
                                            checked: inflationIndexed,
                                            onChange: (e)=>setInflationIndexed(e.target.checked),
                                            className: "h-4 w-4 rounded border-input"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 110,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "inflation",
                                            className: "font-normal text-muted-foreground",
                                            children: "Ajustar pela inflação"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                            lineNumber: 117,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "submit",
                                    size: "sm",
                                    children: "Adicionar evento"
                                }, void 0, false, {
                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                onCancel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline",
                                    size: "sm",
                                    onClick: onCancel,
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                                    lineNumber: 127,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(LifeEventForm, "2HPVVJXTaocg67tAod9TjX+Lm4k=");
_c = LifeEventForm;
var _c;
__turbopack_context__.k.register(_c, "LifeEventForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LifeEventsList",
    ()=>LifeEventsList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$constants$2f$event$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/timeline/constants/event-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/button.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function LifeEventsList({ events, onDelete }) {
    if (events.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-muted-foreground",
            children: "Nenhum evento ainda. Adicione mudanças de renda, grandes compras, filhos, aposentadoria, etc."
        }, void 0, false, {
            fileName: "[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        className: "space-y-2",
        children: events.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-sm font-medium text-foreground",
                                children: event.title
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx",
                                lineNumber: 29,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                    __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$constants$2f$event$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EVENT_TYPE_LABELS"][event.type] ?? event.type,
                                    " · ",
                                    new Date(event.date).toLocaleDateString('pt-BR'),
                                    event.frequency !== 'once' && ` · ${event.frequency}`
                                ]
                            }, void 0, true, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx",
                                lineNumber: 32,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex shrink-0 items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-muted-foreground",
                                children: event.amount >= 0 ? `+${event.amount.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}` : event.amount.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "ghost",
                                size: "icon",
                                onClick: ()=>onDelete(event.id),
                                className: "h-8 w-8 text-muted-foreground hover:text-destructive",
                                "aria-label": "Excluir evento",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx",
                                lineNumber: 43,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this)
                ]
            }, event.id, true, {
                fileName: "[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = LifeEventsList;
var _c;
__turbopack_context__.k.register(_c, "LifeEventsList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/core/utils/micro-plan-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getActiveMicroPlanForDate",
    ()=>getActiveMicroPlanForDate
]);
function getActiveMicroPlanForDate(microPlans, targetDate) {
    if (!microPlans?.length) return null;
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const sorted = [
        ...microPlans
    ].sort((a, b)=>new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());
    let active = null;
    for (const plan of sorted){
        const d = new Date(plan.effectiveDate);
        const planYear = d.getFullYear();
        const planMonth = d.getMonth();
        if (planYear < targetYear || planYear === targetYear && planMonth <= targetMonth) {
            active = plan;
        }
    }
    return active;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/core/services/projection-engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildLifeProjection",
    ()=>buildLifeProjection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$core$2f$utils$2f$micro$2d$plan$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/core/utils/micro-plan-utils.ts [app-client] (ecmascript)");
;
function yearlyToMonthlyRate(yearlyPercent) {
    const yearly = yearlyPercent / 100;
    if (yearly <= -1) return 0;
    return Math.pow(1 + yearly, 1 / 12) - 1;
}
function getMonthsDiff(start, end) {
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}
function cloneDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function applyEventsForMonth(baseIncome, baseExpenses, date, events) {
    let income = baseIncome;
    let expenses = baseExpenses;
    let extraIncome = 0;
    let extraExpenses = 0;
    let oneTimeOutflow = 0;
    let oneTimeInflow = 0;
    for (const event of events){
        const eventMonthKey = event.date.getFullYear() * 12 + event.date.getMonth();
        const currentMonthKey = date.getFullYear() * 12 + date.getMonth();
        const isWithinDuration = !event.endDate || date >= event.date && date <= event.endDate;
        if (!isWithinDuration) continue;
        const isIncome = event.type === 'contribution';
        const amount = event.amount;
        const absAmount = Math.abs(amount);
        if (event.frequency === 'once') {
            if (currentMonthKey !== eventMonthKey) continue;
            if (isIncome) {
                extraIncome += amount;
            } else {
                oneTimeOutflow += absAmount;
                extraExpenses += absAmount;
            }
        }
        if (event.frequency === 'monthly') {
            if (currentMonthKey < eventMonthKey) continue;
            if (isIncome) income += amount;
            else expenses += absAmount;
        }
        if (event.frequency === 'yearly') {
            if (date.getMonth() !== event.date.getMonth()) continue;
            if (date.getFullYear() < event.date.getFullYear()) continue;
            if (isIncome) extraIncome += amount;
            else extraExpenses += absAmount;
        }
    }
    return {
        income,
        expenses,
        extraIncome,
        extraExpenses,
        oneTimeOutflow,
        oneTimeInflow
    };
}
function buildLifeProjection(params) {
    const { profile, settings, events, microPlans = [] } = params;
    const monthlyReturnRate = yearlyToMonthlyRate(settings.expectedReturnYearly);
    const monthlyInflationRate = yearlyToMonthlyRate(settings.inflationYearly);
    const startDate = new Date();
    const endDate = cloneDate(profile.birthDate);
    endDate.setFullYear(endDate.getFullYear() + profile.lifeExpectancyYears);
    const totalMonths = Math.max(0, getMonthsDiff(startDate, endDate));
    let currentNetWorth = settings.baseNetWorth;
    let accumulatedInflation = 1;
    let firstMonthWithZeroOrNegativeNetWorth = null;
    const monthly = [];
    const retirementAge = settings.retirementAge ?? 65;
    const inflateIncome = settings.inflateIncome ?? true;
    const inflateExpenses = settings.inflateExpenses ?? true;
    const inflateRetirementIncome = settings.inflateRetirementIncome ?? true;
    const retirementMonthlyIncome = settings.retirementMonthlyIncome ?? 0;
    for(let i = 0; i <= totalMonths; i++){
        const currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        const age = currentDate.getFullYear() - profile.birthDate.getFullYear() - (currentDate.getMonth() < profile.birthDate.getMonth() ? 1 : 0);
        const activeMicro = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$core$2f$utils$2f$micro$2d$plan$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getActiveMicroPlanForDate"])(microPlans, currentDate);
        const baseIncomeForMonth = activeMicro ? activeMicro.monthlyIncome : age < retirementAge ? settings.baseMonthlyIncome : retirementMonthlyIncome;
        const baseExpensesForMonth = activeMicro ? activeMicro.monthlyExpenses : settings.baseMonthlyExpenses;
        const inflateIncomeForMonth = age < retirementAge ? inflateIncome : inflateRetirementIncome;
        const nominalBaseIncome = inflateIncomeForMonth ? baseIncomeForMonth * accumulatedInflation : baseIncomeForMonth;
        const nominalBaseExpenses = inflateExpenses ? baseExpensesForMonth * accumulatedInflation : baseExpensesForMonth;
        const impact = applyEventsForMonth(nominalBaseIncome, nominalBaseExpenses, currentDate, events);
        const monthIncome = impact.income + impact.extraIncome;
        const monthExpenses = impact.expenses + impact.extraExpenses;
        const contribution = Math.max(0, monthIncome - monthExpenses);
        // Apply one-time inflows/outflows (e.g. large purchase reduces patrimônio; sale adds)
        currentNetWorth += impact.oneTimeInflow - impact.oneTimeOutflow;
        if (i >= 1 && currentNetWorth <= 0 && firstMonthWithZeroOrNegativeNetWorth === null) {
            firstMonthWithZeroOrNegativeNetWorth = i;
        }
        const preReturnNetWorth = currentNetWorth + contribution;
        const returns = preReturnNetWorth * monthlyReturnRate;
        currentNetWorth = preReturnNetWorth + returns;
        if (i >= 1 && currentNetWorth <= 0 && firstMonthWithZeroOrNegativeNetWorth === null) {
            firstMonthWithZeroOrNegativeNetWorth = i;
        }
        accumulatedInflation *= 1 + monthlyInflationRate;
        const realNetWorth = currentNetWorth / accumulatedInflation;
        monthly.push({
            date: currentDate,
            age,
            netWorth: currentNetWorth,
            realNetWorth,
            income: monthIncome,
            expenses: monthExpenses,
            contribution,
            returns
        });
    }
    const yearlyMap = new Map();
    for (const point of monthly){
        const year = point.date.getFullYear();
        const existing = yearlyMap.get(year);
        if (!existing) {
            yearlyMap.set(year, {
                year,
                age: point.age,
                netWorth: point.netWorth,
                realNetWorth: point.realNetWorth,
                income: point.income,
                expenses: point.expenses,
                contribution: point.contribution,
                returns: point.returns
            });
        } else {
            existing.netWorth = point.netWorth;
            existing.realNetWorth = point.realNetWorth;
            existing.income += point.income;
            existing.expenses += point.expenses;
            existing.contribution += point.contribution;
            existing.returns += point.returns;
        }
    }
    const yearly = Array.from(yearlyMap.values()).sort((a, b)=>a.year - b.year);
    return {
        monthly,
        yearly,
        firstMonthWithZeroOrNegativeNetWorth
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/app/actions/data:9e5488 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLifeData",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40c3c71f87e5ea7d12c538759c67dc0c0d65be1af3":"getLifeData"},"foundation-life/src/app/actions/life.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40c3c71f87e5ea7d12c538759c67dc0c0d65be1af3", __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getLifeData");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCB0eXBlIEN1cnJlbmN5Q29kZSA9ICdCUkwnIHwgJ1VTRCcgfCAnRVVSJ1xuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUGF5bG9hZCB7XG4gIGJpcnRoRGF0ZTogc3RyaW5nIC8vIElTT1xuICBsaWZlRXhwZWN0YW5jeVllYXJzOiBudW1iZXJcbiAgYmFzZU5ldFdvcnRoOiBudW1iZXJcbiAgYmFzZU1vbnRobHlJbmNvbWU6IG51bWJlclxuICBiYXNlTW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG4gIGV4cGVjdGVkUmV0dXJuWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0aW9uWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0ZUluY29tZTogYm9vbGVhblxuICBpbmZsYXRlRXhwZW5zZXM6IGJvb2xlYW5cbiAgcmV0aXJlbWVudEFnZTogbnVtYmVyXG4gIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBudW1iZXJcbiAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IGJvb2xlYW5cbiAgYmFzZUN1cnJlbmN5PzogQ3VycmVuY3lDb2RlXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZUV2ZW50UGF5bG9hZCB7XG4gIGlkPzogc3RyaW5nXG4gIHR5cGU6IExpZmVFdmVudFR5cGVcbiAgdGl0bGU6IHN0cmluZ1xuICBkYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGVuZERhdGU/OiBzdHJpbmdcbiAgYW1vdW50OiBudW1iZXJcbiAgZnJlcXVlbmN5OiAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5J1xuICBkdXJhdGlvbk1vbnRocz86IG51bWJlclxuICBpbmZsYXRpb25JbmRleGVkPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVNaWNyb1BsYW5QYXlsb2FkIHtcbiAgZWZmZWN0aXZlRGF0ZTogc3RyaW5nIC8vIElTTyBkYXRlIChZWVlZLU1NLUREIG9yIGZ1bGwgSVNPKVxuICBtb250aGx5SW5jb21lOiBudW1iZXJcbiAgbW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFSZXN1bHQge1xuICBwcm9maWxlSWQ6IHN0cmluZ1xuICBzY2VuYXJpb0lkOiBzdHJpbmdcbiAgYmlydGhEYXRlOiBzdHJpbmdcbiAgbGlmZUV4cGVjdGFuY3lZZWFyczogbnVtYmVyXG4gIGJhc2VDdXJyZW5jeTogQ3VycmVuY3lDb2RlXG4gIHNldHRpbmdzOiBMaWZlRGF0YVBheWxvYWRcbiAgZXZlbnRzOiBMaWZlRXZlbnRQYXlsb2FkW11cbiAgbWljcm9QbGFuczogKExpZmVNaWNyb1BsYW5QYXlsb2FkICYgeyBpZDogc3RyaW5nIH0pW11cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldExpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZyk6IFByb21pc2U8TGlmZURhdGFSZXN1bHQgfCBudWxsPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlPy5iaXJ0aERhdGUpIHJldHVybiBudWxsXG5cbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgICBpbmNsdWRlOiB7XG4gICAgICBzZXR0aW5nczogdHJ1ZSxcbiAgICAgIGV2ZW50czogeyBvcmRlckJ5OiB7IGRhdGU6ICdhc2MnIH0gfSxcbiAgICB9LFxuICB9KVxuXG4gIGlmICghc2NlbmFyaW8/LnNldHRpbmdzKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IG1pY3JvUGxhbnMgPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kTWFueSh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBvcmRlckJ5OiB7IGVmZmVjdGl2ZURhdGU6ICdhc2MnIH0sXG4gIH0pXG5cbiAgY29uc3Qgc2V0dGluZ3MgPSBzY2VuYXJpby5zZXR0aW5nc1xuICBjb25zdCBiaXJ0aERhdGUgPSBwcm9maWxlLmJpcnRoRGF0ZVxuXG4gIHJldHVybiB7XG4gICAgcHJvZmlsZUlkOiBwcm9maWxlLmlkLFxuICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcHJvZmlsZS5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgIGJhc2VDdXJyZW5jeTogKHByb2ZpbGUuYmFzZUN1cnJlbmN5IGFzIEN1cnJlbmN5Q29kZSkgfHwgJ0JSTCcsXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwcm9maWxlLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICBiYXNlTmV0V29ydGg6IHNldHRpbmdzLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBzZXR0aW5ncy5iYXNlTW9udGhseUluY29tZSxcbiAgICAgIGJhc2VNb250aGx5RXhwZW5zZXM6IHNldHRpbmdzLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBzZXR0aW5ncy5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHNldHRpbmdzLmV4cGVjdGVkUmV0dXJuWWVhcmx5LFxuICAgICAgaW5mbGF0aW9uWWVhcmx5OiBzZXR0aW5ncy5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBzZXR0aW5ncy5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHNldHRpbmdzLmluZmxhdGVFeHBlbnNlcyA/PyB0cnVlLFxuICAgICAgcmV0aXJlbWVudEFnZTogc2V0dGluZ3MucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBzZXR0aW5ncy5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVSZXRpcmVtZW50SW5jb21lID8/IHRydWUsXG4gICAgfSxcbiAgICBldmVudHM6IHNjZW5hcmlvLmV2ZW50cy5tYXAoZSA9PiAoe1xuICAgICAgaWQ6IGUuaWQsXG4gICAgICB0eXBlOiBlLnR5cGUgYXMgTGlmZUV2ZW50VHlwZSxcbiAgICAgIHRpdGxlOiBlLnRpdGxlLFxuICAgICAgZGF0ZTogZS5kYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmREYXRlOiBlLmVuZERhdGU/LnRvSVNPU3RyaW5nKCksXG4gICAgICBhbW91bnQ6IGUuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBlLmZyZXF1ZW5jeSBhcyAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5JyxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBlLmR1cmF0aW9uTW9udGhzID8/IHVuZGVmaW5lZCxcbiAgICAgIGluZmxhdGlvbkluZGV4ZWQ6IGUuaW5mbGF0aW9uSW5kZXhlZCxcbiAgICB9KSksXG4gICAgbWljcm9QbGFuczogbWljcm9QbGFucy5tYXAobSA9PiAoe1xuICAgICAgaWQ6IG0uaWQsXG4gICAgICBlZmZlY3RpdmVEYXRlOiBtLmVmZmVjdGl2ZURhdGUudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCksXG4gICAgICBtb250aGx5SW5jb21lOiBtLm1vbnRobHlJbmNvbWUsXG4gICAgICBtb250aGx5RXhwZW5zZXM6IG0ubW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogbS5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgIH0pKSxcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZywgcGF5bG9hZDogTGlmZURhdGFQYXlsb2FkKTogUHJvbWlzZTx7IHNjZW5hcmlvSWQ6IHN0cmluZyB9PiB7XG4gIGxldCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGNvbnN0IGJhc2VDdXJyZW5jeSA9IHBheWxvYWQuYmFzZUN1cnJlbmN5ID8/ICdCUkwnXG4gIGlmICghcHJvZmlsZSkge1xuICAgIHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBhdXRoVXNlcklkLFxuICAgICAgICBiaXJ0aERhdGU6IG5ldyBEYXRlKHBheWxvYWQuYmlydGhEYXRlKSxcbiAgICAgICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcGF5bG9hZC5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgICAgICBiYXNlQ3VycmVuY3ksXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICAgIGJhc2VDdXJyZW5jeSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGxldCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsIGlzRGVmYXVsdDogdHJ1ZSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB7XG4gICAgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICAgICAgbmFtZTogJ1BsYW5vIHByaW5jaXBhbCcsXG4gICAgICAgIGlzRGVmYXVsdDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGF3YWl0IHByaXNtYS5saWZlU2V0dGluZ3MudXBzZXJ0KHtcbiAgICB3aGVyZTogeyBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCB9LFxuICAgIGNyZWF0ZToge1xuICAgICAgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQsXG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gICAgdXBkYXRlOiB7XG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gIH0pXG5cbiAgcmV0dXJuIHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVFdmVudChcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IE9taXQ8TGlmZUV2ZW50UGF5bG9hZCwgJ2lkJz5cbik6IFByb21pc2U8eyBpZDogc3RyaW5nIH0+IHtcbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IHNjZW5hcmlvSWQsIHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0sXG4gIH0pXG4gIGlmICghc2NlbmFyaW8pIHRocm93IG5ldyBFcnJvcignU2NlbmFyaW8gbm90IGZvdW5kJylcblxuICBjb25zdCBldmVudCA9IGF3YWl0IHByaXNtYS5saWZlRXZlbnQuY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgdHlwZTogcGF5bG9hZC50eXBlLFxuICAgICAgdGl0bGU6IHBheWxvYWQudGl0bGUsXG4gICAgICBkYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmRhdGUpLFxuICAgICAgZW5kRGF0ZTogcGF5bG9hZC5lbmREYXRlID8gbmV3IERhdGUocGF5bG9hZC5lbmREYXRlKSA6IG51bGwsXG4gICAgICBhbW91bnQ6IHBheWxvYWQuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBwYXlsb2FkLmZyZXF1ZW5jeSxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBwYXlsb2FkLmR1cmF0aW9uTW9udGhzID8/IG51bGwsXG4gICAgICBpbmZsYXRpb25JbmRleGVkOiBwYXlsb2FkLmluZmxhdGlvbkluZGV4ZWQgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogZXZlbnQuaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlTGlmZUV2ZW50KGF1dGhVc2VySWQ6IHN0cmluZywgZXZlbnRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHsgd2hlcmU6IHsgYXV0aFVzZXJJZCB9IH0pXG4gIGlmICghcHJvZmlsZSkgcmV0dXJuXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IGV2ZW50SWQsIHNjZW5hcmlvOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCB9IH0sXG4gIH0pXG4gIGlmIChldmVudCkgYXdhaXQgcHJpc21hLmxpZmVFdmVudC5kZWxldGUoeyB3aGVyZTogeyBpZDogZXZlbnRJZCB9IH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZU1pY3JvUGxhbihcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IExpZmVNaWNyb1BsYW5QYXlsb2FkXG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpLFxuICAgICAgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lLFxuICAgICAgbW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLm1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbixcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogbWljcm9QbGFuLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgbWljcm9QbGFuSWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogUGFydGlhbDxMaWZlTWljcm9QbGFuUGF5bG9hZD5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAoIW1pY3JvUGxhbikgdGhyb3cgbmV3IEVycm9yKCdNaWNybyBwbGFuIG5vdCBmb3VuZCcpXG5cbiAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4udXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSxcbiAgICBkYXRhOiB7XG4gICAgICAuLi4ocGF5bG9hZC5lZmZlY3RpdmVEYXRlICE9IG51bGwgJiYgeyBlZmZlY3RpdmVEYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmVmZmVjdGl2ZURhdGUgKyAnVDEyOjAwOjAwJykgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5SW5jb21lICE9IG51bGwgJiYgeyBtb250aGx5SW5jb21lOiBwYXlsb2FkLm1vbnRobHlJbmNvbWUgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5RXhwZW5zZXMgIT0gbnVsbCAmJiB7IG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uICE9IG51bGwgJiYgeyBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24gfSksXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVNaWNyb1BsYW4oYXV0aFVzZXJJZDogc3RyaW5nLCBtaWNyb1BsYW5JZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkLCBzY2VuYXJpbzogeyBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9IH0sXG4gIH0pXG4gIGlmIChtaWNyb1BsYW4pIHtcbiAgICBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5kZWxldGUoeyB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSB9KVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InVTQXNEc0Isd0xBQUEifQ==
}),
"[project]/foundation-life/src/app/actions/data:5d41ba [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "saveLifeData",
    ()=>$$RSC_SERVER_ACTION_1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"600b891cdaa925d592b8f5aa6ab448824fa3e7f5ec":"saveLifeData"},"foundation-life/src/app/actions/life.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("600b891cdaa925d592b8f5aa6ab448824fa3e7f5ec", __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "saveLifeData");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCB0eXBlIEN1cnJlbmN5Q29kZSA9ICdCUkwnIHwgJ1VTRCcgfCAnRVVSJ1xuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUGF5bG9hZCB7XG4gIGJpcnRoRGF0ZTogc3RyaW5nIC8vIElTT1xuICBsaWZlRXhwZWN0YW5jeVllYXJzOiBudW1iZXJcbiAgYmFzZU5ldFdvcnRoOiBudW1iZXJcbiAgYmFzZU1vbnRobHlJbmNvbWU6IG51bWJlclxuICBiYXNlTW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG4gIGV4cGVjdGVkUmV0dXJuWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0aW9uWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0ZUluY29tZTogYm9vbGVhblxuICBpbmZsYXRlRXhwZW5zZXM6IGJvb2xlYW5cbiAgcmV0aXJlbWVudEFnZTogbnVtYmVyXG4gIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBudW1iZXJcbiAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IGJvb2xlYW5cbiAgYmFzZUN1cnJlbmN5PzogQ3VycmVuY3lDb2RlXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZUV2ZW50UGF5bG9hZCB7XG4gIGlkPzogc3RyaW5nXG4gIHR5cGU6IExpZmVFdmVudFR5cGVcbiAgdGl0bGU6IHN0cmluZ1xuICBkYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGVuZERhdGU/OiBzdHJpbmdcbiAgYW1vdW50OiBudW1iZXJcbiAgZnJlcXVlbmN5OiAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5J1xuICBkdXJhdGlvbk1vbnRocz86IG51bWJlclxuICBpbmZsYXRpb25JbmRleGVkPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVNaWNyb1BsYW5QYXlsb2FkIHtcbiAgZWZmZWN0aXZlRGF0ZTogc3RyaW5nIC8vIElTTyBkYXRlIChZWVlZLU1NLUREIG9yIGZ1bGwgSVNPKVxuICBtb250aGx5SW5jb21lOiBudW1iZXJcbiAgbW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFSZXN1bHQge1xuICBwcm9maWxlSWQ6IHN0cmluZ1xuICBzY2VuYXJpb0lkOiBzdHJpbmdcbiAgYmlydGhEYXRlOiBzdHJpbmdcbiAgbGlmZUV4cGVjdGFuY3lZZWFyczogbnVtYmVyXG4gIGJhc2VDdXJyZW5jeTogQ3VycmVuY3lDb2RlXG4gIHNldHRpbmdzOiBMaWZlRGF0YVBheWxvYWRcbiAgZXZlbnRzOiBMaWZlRXZlbnRQYXlsb2FkW11cbiAgbWljcm9QbGFuczogKExpZmVNaWNyb1BsYW5QYXlsb2FkICYgeyBpZDogc3RyaW5nIH0pW11cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldExpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZyk6IFByb21pc2U8TGlmZURhdGFSZXN1bHQgfCBudWxsPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlPy5iaXJ0aERhdGUpIHJldHVybiBudWxsXG5cbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgICBpbmNsdWRlOiB7XG4gICAgICBzZXR0aW5nczogdHJ1ZSxcbiAgICAgIGV2ZW50czogeyBvcmRlckJ5OiB7IGRhdGU6ICdhc2MnIH0gfSxcbiAgICB9LFxuICB9KVxuXG4gIGlmICghc2NlbmFyaW8/LnNldHRpbmdzKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IG1pY3JvUGxhbnMgPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kTWFueSh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBvcmRlckJ5OiB7IGVmZmVjdGl2ZURhdGU6ICdhc2MnIH0sXG4gIH0pXG5cbiAgY29uc3Qgc2V0dGluZ3MgPSBzY2VuYXJpby5zZXR0aW5nc1xuICBjb25zdCBiaXJ0aERhdGUgPSBwcm9maWxlLmJpcnRoRGF0ZVxuXG4gIHJldHVybiB7XG4gICAgcHJvZmlsZUlkOiBwcm9maWxlLmlkLFxuICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcHJvZmlsZS5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgIGJhc2VDdXJyZW5jeTogKHByb2ZpbGUuYmFzZUN1cnJlbmN5IGFzIEN1cnJlbmN5Q29kZSkgfHwgJ0JSTCcsXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwcm9maWxlLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICBiYXNlTmV0V29ydGg6IHNldHRpbmdzLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBzZXR0aW5ncy5iYXNlTW9udGhseUluY29tZSxcbiAgICAgIGJhc2VNb250aGx5RXhwZW5zZXM6IHNldHRpbmdzLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBzZXR0aW5ncy5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHNldHRpbmdzLmV4cGVjdGVkUmV0dXJuWWVhcmx5LFxuICAgICAgaW5mbGF0aW9uWWVhcmx5OiBzZXR0aW5ncy5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBzZXR0aW5ncy5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHNldHRpbmdzLmluZmxhdGVFeHBlbnNlcyA/PyB0cnVlLFxuICAgICAgcmV0aXJlbWVudEFnZTogc2V0dGluZ3MucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBzZXR0aW5ncy5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVSZXRpcmVtZW50SW5jb21lID8/IHRydWUsXG4gICAgfSxcbiAgICBldmVudHM6IHNjZW5hcmlvLmV2ZW50cy5tYXAoZSA9PiAoe1xuICAgICAgaWQ6IGUuaWQsXG4gICAgICB0eXBlOiBlLnR5cGUgYXMgTGlmZUV2ZW50VHlwZSxcbiAgICAgIHRpdGxlOiBlLnRpdGxlLFxuICAgICAgZGF0ZTogZS5kYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmREYXRlOiBlLmVuZERhdGU/LnRvSVNPU3RyaW5nKCksXG4gICAgICBhbW91bnQ6IGUuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBlLmZyZXF1ZW5jeSBhcyAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5JyxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBlLmR1cmF0aW9uTW9udGhzID8/IHVuZGVmaW5lZCxcbiAgICAgIGluZmxhdGlvbkluZGV4ZWQ6IGUuaW5mbGF0aW9uSW5kZXhlZCxcbiAgICB9KSksXG4gICAgbWljcm9QbGFuczogbWljcm9QbGFucy5tYXAobSA9PiAoe1xuICAgICAgaWQ6IG0uaWQsXG4gICAgICBlZmZlY3RpdmVEYXRlOiBtLmVmZmVjdGl2ZURhdGUudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCksXG4gICAgICBtb250aGx5SW5jb21lOiBtLm1vbnRobHlJbmNvbWUsXG4gICAgICBtb250aGx5RXhwZW5zZXM6IG0ubW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogbS5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgIH0pKSxcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZywgcGF5bG9hZDogTGlmZURhdGFQYXlsb2FkKTogUHJvbWlzZTx7IHNjZW5hcmlvSWQ6IHN0cmluZyB9PiB7XG4gIGxldCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGNvbnN0IGJhc2VDdXJyZW5jeSA9IHBheWxvYWQuYmFzZUN1cnJlbmN5ID8/ICdCUkwnXG4gIGlmICghcHJvZmlsZSkge1xuICAgIHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBhdXRoVXNlcklkLFxuICAgICAgICBiaXJ0aERhdGU6IG5ldyBEYXRlKHBheWxvYWQuYmlydGhEYXRlKSxcbiAgICAgICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcGF5bG9hZC5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgICAgICBiYXNlQ3VycmVuY3ksXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICAgIGJhc2VDdXJyZW5jeSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGxldCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsIGlzRGVmYXVsdDogdHJ1ZSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB7XG4gICAgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICAgICAgbmFtZTogJ1BsYW5vIHByaW5jaXBhbCcsXG4gICAgICAgIGlzRGVmYXVsdDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGF3YWl0IHByaXNtYS5saWZlU2V0dGluZ3MudXBzZXJ0KHtcbiAgICB3aGVyZTogeyBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCB9LFxuICAgIGNyZWF0ZToge1xuICAgICAgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQsXG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gICAgdXBkYXRlOiB7XG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gIH0pXG5cbiAgcmV0dXJuIHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVFdmVudChcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IE9taXQ8TGlmZUV2ZW50UGF5bG9hZCwgJ2lkJz5cbik6IFByb21pc2U8eyBpZDogc3RyaW5nIH0+IHtcbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IHNjZW5hcmlvSWQsIHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0sXG4gIH0pXG4gIGlmICghc2NlbmFyaW8pIHRocm93IG5ldyBFcnJvcignU2NlbmFyaW8gbm90IGZvdW5kJylcblxuICBjb25zdCBldmVudCA9IGF3YWl0IHByaXNtYS5saWZlRXZlbnQuY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgdHlwZTogcGF5bG9hZC50eXBlLFxuICAgICAgdGl0bGU6IHBheWxvYWQudGl0bGUsXG4gICAgICBkYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmRhdGUpLFxuICAgICAgZW5kRGF0ZTogcGF5bG9hZC5lbmREYXRlID8gbmV3IERhdGUocGF5bG9hZC5lbmREYXRlKSA6IG51bGwsXG4gICAgICBhbW91bnQ6IHBheWxvYWQuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBwYXlsb2FkLmZyZXF1ZW5jeSxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBwYXlsb2FkLmR1cmF0aW9uTW9udGhzID8/IG51bGwsXG4gICAgICBpbmZsYXRpb25JbmRleGVkOiBwYXlsb2FkLmluZmxhdGlvbkluZGV4ZWQgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogZXZlbnQuaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlTGlmZUV2ZW50KGF1dGhVc2VySWQ6IHN0cmluZywgZXZlbnRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHsgd2hlcmU6IHsgYXV0aFVzZXJJZCB9IH0pXG4gIGlmICghcHJvZmlsZSkgcmV0dXJuXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IGV2ZW50SWQsIHNjZW5hcmlvOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCB9IH0sXG4gIH0pXG4gIGlmIChldmVudCkgYXdhaXQgcHJpc21hLmxpZmVFdmVudC5kZWxldGUoeyB3aGVyZTogeyBpZDogZXZlbnRJZCB9IH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZU1pY3JvUGxhbihcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IExpZmVNaWNyb1BsYW5QYXlsb2FkXG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpLFxuICAgICAgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lLFxuICAgICAgbW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLm1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbixcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogbWljcm9QbGFuLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgbWljcm9QbGFuSWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogUGFydGlhbDxMaWZlTWljcm9QbGFuUGF5bG9hZD5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAoIW1pY3JvUGxhbikgdGhyb3cgbmV3IEVycm9yKCdNaWNybyBwbGFuIG5vdCBmb3VuZCcpXG5cbiAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4udXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSxcbiAgICBkYXRhOiB7XG4gICAgICAuLi4ocGF5bG9hZC5lZmZlY3RpdmVEYXRlICE9IG51bGwgJiYgeyBlZmZlY3RpdmVEYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmVmZmVjdGl2ZURhdGUgKyAnVDEyOjAwOjAwJykgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5SW5jb21lICE9IG51bGwgJiYgeyBtb250aGx5SW5jb21lOiBwYXlsb2FkLm1vbnRobHlJbmNvbWUgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5RXhwZW5zZXMgIT0gbnVsbCAmJiB7IG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uICE9IG51bGwgJiYgeyBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24gfSksXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVNaWNyb1BsYW4oYXV0aFVzZXJJZDogc3RyaW5nLCBtaWNyb1BsYW5JZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkLCBzY2VuYXJpbzogeyBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9IH0sXG4gIH0pXG4gIGlmIChtaWNyb1BsYW4pIHtcbiAgICBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5kZWxldGUoeyB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSB9KVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IndTQXlIc0IseUxBQUEifQ==
}),
"[project]/foundation-life/src/app/actions/data:dbb143 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "saveLifeEvent",
    ()=>$$RSC_SERVER_ACTION_2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"70f2553d7ae95e30f81f8fe1cf502e7d66ab08a3eb":"saveLifeEvent"},"foundation-life/src/app/actions/life.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("70f2553d7ae95e30f81f8fe1cf502e7d66ab08a3eb", __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "saveLifeEvent");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCB0eXBlIEN1cnJlbmN5Q29kZSA9ICdCUkwnIHwgJ1VTRCcgfCAnRVVSJ1xuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUGF5bG9hZCB7XG4gIGJpcnRoRGF0ZTogc3RyaW5nIC8vIElTT1xuICBsaWZlRXhwZWN0YW5jeVllYXJzOiBudW1iZXJcbiAgYmFzZU5ldFdvcnRoOiBudW1iZXJcbiAgYmFzZU1vbnRobHlJbmNvbWU6IG51bWJlclxuICBiYXNlTW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG4gIGV4cGVjdGVkUmV0dXJuWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0aW9uWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0ZUluY29tZTogYm9vbGVhblxuICBpbmZsYXRlRXhwZW5zZXM6IGJvb2xlYW5cbiAgcmV0aXJlbWVudEFnZTogbnVtYmVyXG4gIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBudW1iZXJcbiAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IGJvb2xlYW5cbiAgYmFzZUN1cnJlbmN5PzogQ3VycmVuY3lDb2RlXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZUV2ZW50UGF5bG9hZCB7XG4gIGlkPzogc3RyaW5nXG4gIHR5cGU6IExpZmVFdmVudFR5cGVcbiAgdGl0bGU6IHN0cmluZ1xuICBkYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGVuZERhdGU/OiBzdHJpbmdcbiAgYW1vdW50OiBudW1iZXJcbiAgZnJlcXVlbmN5OiAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5J1xuICBkdXJhdGlvbk1vbnRocz86IG51bWJlclxuICBpbmZsYXRpb25JbmRleGVkPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVNaWNyb1BsYW5QYXlsb2FkIHtcbiAgZWZmZWN0aXZlRGF0ZTogc3RyaW5nIC8vIElTTyBkYXRlIChZWVlZLU1NLUREIG9yIGZ1bGwgSVNPKVxuICBtb250aGx5SW5jb21lOiBudW1iZXJcbiAgbW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFSZXN1bHQge1xuICBwcm9maWxlSWQ6IHN0cmluZ1xuICBzY2VuYXJpb0lkOiBzdHJpbmdcbiAgYmlydGhEYXRlOiBzdHJpbmdcbiAgbGlmZUV4cGVjdGFuY3lZZWFyczogbnVtYmVyXG4gIGJhc2VDdXJyZW5jeTogQ3VycmVuY3lDb2RlXG4gIHNldHRpbmdzOiBMaWZlRGF0YVBheWxvYWRcbiAgZXZlbnRzOiBMaWZlRXZlbnRQYXlsb2FkW11cbiAgbWljcm9QbGFuczogKExpZmVNaWNyb1BsYW5QYXlsb2FkICYgeyBpZDogc3RyaW5nIH0pW11cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldExpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZyk6IFByb21pc2U8TGlmZURhdGFSZXN1bHQgfCBudWxsPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlPy5iaXJ0aERhdGUpIHJldHVybiBudWxsXG5cbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgICBpbmNsdWRlOiB7XG4gICAgICBzZXR0aW5nczogdHJ1ZSxcbiAgICAgIGV2ZW50czogeyBvcmRlckJ5OiB7IGRhdGU6ICdhc2MnIH0gfSxcbiAgICB9LFxuICB9KVxuXG4gIGlmICghc2NlbmFyaW8/LnNldHRpbmdzKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IG1pY3JvUGxhbnMgPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kTWFueSh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBvcmRlckJ5OiB7IGVmZmVjdGl2ZURhdGU6ICdhc2MnIH0sXG4gIH0pXG5cbiAgY29uc3Qgc2V0dGluZ3MgPSBzY2VuYXJpby5zZXR0aW5nc1xuICBjb25zdCBiaXJ0aERhdGUgPSBwcm9maWxlLmJpcnRoRGF0ZVxuXG4gIHJldHVybiB7XG4gICAgcHJvZmlsZUlkOiBwcm9maWxlLmlkLFxuICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcHJvZmlsZS5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgIGJhc2VDdXJyZW5jeTogKHByb2ZpbGUuYmFzZUN1cnJlbmN5IGFzIEN1cnJlbmN5Q29kZSkgfHwgJ0JSTCcsXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwcm9maWxlLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICBiYXNlTmV0V29ydGg6IHNldHRpbmdzLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBzZXR0aW5ncy5iYXNlTW9udGhseUluY29tZSxcbiAgICAgIGJhc2VNb250aGx5RXhwZW5zZXM6IHNldHRpbmdzLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBzZXR0aW5ncy5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHNldHRpbmdzLmV4cGVjdGVkUmV0dXJuWWVhcmx5LFxuICAgICAgaW5mbGF0aW9uWWVhcmx5OiBzZXR0aW5ncy5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBzZXR0aW5ncy5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHNldHRpbmdzLmluZmxhdGVFeHBlbnNlcyA/PyB0cnVlLFxuICAgICAgcmV0aXJlbWVudEFnZTogc2V0dGluZ3MucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBzZXR0aW5ncy5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVSZXRpcmVtZW50SW5jb21lID8/IHRydWUsXG4gICAgfSxcbiAgICBldmVudHM6IHNjZW5hcmlvLmV2ZW50cy5tYXAoZSA9PiAoe1xuICAgICAgaWQ6IGUuaWQsXG4gICAgICB0eXBlOiBlLnR5cGUgYXMgTGlmZUV2ZW50VHlwZSxcbiAgICAgIHRpdGxlOiBlLnRpdGxlLFxuICAgICAgZGF0ZTogZS5kYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmREYXRlOiBlLmVuZERhdGU/LnRvSVNPU3RyaW5nKCksXG4gICAgICBhbW91bnQ6IGUuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBlLmZyZXF1ZW5jeSBhcyAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5JyxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBlLmR1cmF0aW9uTW9udGhzID8/IHVuZGVmaW5lZCxcbiAgICAgIGluZmxhdGlvbkluZGV4ZWQ6IGUuaW5mbGF0aW9uSW5kZXhlZCxcbiAgICB9KSksXG4gICAgbWljcm9QbGFuczogbWljcm9QbGFucy5tYXAobSA9PiAoe1xuICAgICAgaWQ6IG0uaWQsXG4gICAgICBlZmZlY3RpdmVEYXRlOiBtLmVmZmVjdGl2ZURhdGUudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCksXG4gICAgICBtb250aGx5SW5jb21lOiBtLm1vbnRobHlJbmNvbWUsXG4gICAgICBtb250aGx5RXhwZW5zZXM6IG0ubW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogbS5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgIH0pKSxcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZywgcGF5bG9hZDogTGlmZURhdGFQYXlsb2FkKTogUHJvbWlzZTx7IHNjZW5hcmlvSWQ6IHN0cmluZyB9PiB7XG4gIGxldCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGNvbnN0IGJhc2VDdXJyZW5jeSA9IHBheWxvYWQuYmFzZUN1cnJlbmN5ID8/ICdCUkwnXG4gIGlmICghcHJvZmlsZSkge1xuICAgIHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBhdXRoVXNlcklkLFxuICAgICAgICBiaXJ0aERhdGU6IG5ldyBEYXRlKHBheWxvYWQuYmlydGhEYXRlKSxcbiAgICAgICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcGF5bG9hZC5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgICAgICBiYXNlQ3VycmVuY3ksXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICAgIGJhc2VDdXJyZW5jeSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGxldCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsIGlzRGVmYXVsdDogdHJ1ZSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB7XG4gICAgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICAgICAgbmFtZTogJ1BsYW5vIHByaW5jaXBhbCcsXG4gICAgICAgIGlzRGVmYXVsdDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGF3YWl0IHByaXNtYS5saWZlU2V0dGluZ3MudXBzZXJ0KHtcbiAgICB3aGVyZTogeyBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCB9LFxuICAgIGNyZWF0ZToge1xuICAgICAgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQsXG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gICAgdXBkYXRlOiB7XG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gIH0pXG5cbiAgcmV0dXJuIHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVFdmVudChcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IE9taXQ8TGlmZUV2ZW50UGF5bG9hZCwgJ2lkJz5cbik6IFByb21pc2U8eyBpZDogc3RyaW5nIH0+IHtcbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IHNjZW5hcmlvSWQsIHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0sXG4gIH0pXG4gIGlmICghc2NlbmFyaW8pIHRocm93IG5ldyBFcnJvcignU2NlbmFyaW8gbm90IGZvdW5kJylcblxuICBjb25zdCBldmVudCA9IGF3YWl0IHByaXNtYS5saWZlRXZlbnQuY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgdHlwZTogcGF5bG9hZC50eXBlLFxuICAgICAgdGl0bGU6IHBheWxvYWQudGl0bGUsXG4gICAgICBkYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmRhdGUpLFxuICAgICAgZW5kRGF0ZTogcGF5bG9hZC5lbmREYXRlID8gbmV3IERhdGUocGF5bG9hZC5lbmREYXRlKSA6IG51bGwsXG4gICAgICBhbW91bnQ6IHBheWxvYWQuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBwYXlsb2FkLmZyZXF1ZW5jeSxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBwYXlsb2FkLmR1cmF0aW9uTW9udGhzID8/IG51bGwsXG4gICAgICBpbmZsYXRpb25JbmRleGVkOiBwYXlsb2FkLmluZmxhdGlvbkluZGV4ZWQgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogZXZlbnQuaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlTGlmZUV2ZW50KGF1dGhVc2VySWQ6IHN0cmluZywgZXZlbnRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHsgd2hlcmU6IHsgYXV0aFVzZXJJZCB9IH0pXG4gIGlmICghcHJvZmlsZSkgcmV0dXJuXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IGV2ZW50SWQsIHNjZW5hcmlvOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCB9IH0sXG4gIH0pXG4gIGlmIChldmVudCkgYXdhaXQgcHJpc21hLmxpZmVFdmVudC5kZWxldGUoeyB3aGVyZTogeyBpZDogZXZlbnRJZCB9IH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZU1pY3JvUGxhbihcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IExpZmVNaWNyb1BsYW5QYXlsb2FkXG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpLFxuICAgICAgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lLFxuICAgICAgbW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLm1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbixcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogbWljcm9QbGFuLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgbWljcm9QbGFuSWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogUGFydGlhbDxMaWZlTWljcm9QbGFuUGF5bG9hZD5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAoIW1pY3JvUGxhbikgdGhyb3cgbmV3IEVycm9yKCdNaWNybyBwbGFuIG5vdCBmb3VuZCcpXG5cbiAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4udXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSxcbiAgICBkYXRhOiB7XG4gICAgICAuLi4ocGF5bG9hZC5lZmZlY3RpdmVEYXRlICE9IG51bGwgJiYgeyBlZmZlY3RpdmVEYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmVmZmVjdGl2ZURhdGUgKyAnVDEyOjAwOjAwJykgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5SW5jb21lICE9IG51bGwgJiYgeyBtb250aGx5SW5jb21lOiBwYXlsb2FkLm1vbnRobHlJbmNvbWUgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5RXhwZW5zZXMgIT0gbnVsbCAmJiB7IG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uICE9IG51bGwgJiYgeyBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24gfSksXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVNaWNyb1BsYW4oYXV0aFVzZXJJZDogc3RyaW5nLCBtaWNyb1BsYW5JZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkLCBzY2VuYXJpbzogeyBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9IH0sXG4gIH0pXG4gIGlmIChtaWNyb1BsYW4pIHtcbiAgICBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5kZWxldGUoeyB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSB9KVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6InlTQWtNc0IsMExBQUEifQ==
}),
"[project]/foundation-life/src/app/actions/data:b316b2 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteLifeEvent",
    ()=>$$RSC_SERVER_ACTION_3
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"60e8724e899a70540d02df124b7c7f048ff7c3dfc1":"deleteLifeEvent"},"foundation-life/src/app/actions/life.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60e8724e899a70540d02df124b7c7f048ff7c3dfc1", __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteLifeEvent");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCB0eXBlIEN1cnJlbmN5Q29kZSA9ICdCUkwnIHwgJ1VTRCcgfCAnRVVSJ1xuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUGF5bG9hZCB7XG4gIGJpcnRoRGF0ZTogc3RyaW5nIC8vIElTT1xuICBsaWZlRXhwZWN0YW5jeVllYXJzOiBudW1iZXJcbiAgYmFzZU5ldFdvcnRoOiBudW1iZXJcbiAgYmFzZU1vbnRobHlJbmNvbWU6IG51bWJlclxuICBiYXNlTW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG4gIGV4cGVjdGVkUmV0dXJuWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0aW9uWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0ZUluY29tZTogYm9vbGVhblxuICBpbmZsYXRlRXhwZW5zZXM6IGJvb2xlYW5cbiAgcmV0aXJlbWVudEFnZTogbnVtYmVyXG4gIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBudW1iZXJcbiAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IGJvb2xlYW5cbiAgYmFzZUN1cnJlbmN5PzogQ3VycmVuY3lDb2RlXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZUV2ZW50UGF5bG9hZCB7XG4gIGlkPzogc3RyaW5nXG4gIHR5cGU6IExpZmVFdmVudFR5cGVcbiAgdGl0bGU6IHN0cmluZ1xuICBkYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGVuZERhdGU/OiBzdHJpbmdcbiAgYW1vdW50OiBudW1iZXJcbiAgZnJlcXVlbmN5OiAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5J1xuICBkdXJhdGlvbk1vbnRocz86IG51bWJlclxuICBpbmZsYXRpb25JbmRleGVkPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVNaWNyb1BsYW5QYXlsb2FkIHtcbiAgZWZmZWN0aXZlRGF0ZTogc3RyaW5nIC8vIElTTyBkYXRlIChZWVlZLU1NLUREIG9yIGZ1bGwgSVNPKVxuICBtb250aGx5SW5jb21lOiBudW1iZXJcbiAgbW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFSZXN1bHQge1xuICBwcm9maWxlSWQ6IHN0cmluZ1xuICBzY2VuYXJpb0lkOiBzdHJpbmdcbiAgYmlydGhEYXRlOiBzdHJpbmdcbiAgbGlmZUV4cGVjdGFuY3lZZWFyczogbnVtYmVyXG4gIGJhc2VDdXJyZW5jeTogQ3VycmVuY3lDb2RlXG4gIHNldHRpbmdzOiBMaWZlRGF0YVBheWxvYWRcbiAgZXZlbnRzOiBMaWZlRXZlbnRQYXlsb2FkW11cbiAgbWljcm9QbGFuczogKExpZmVNaWNyb1BsYW5QYXlsb2FkICYgeyBpZDogc3RyaW5nIH0pW11cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldExpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZyk6IFByb21pc2U8TGlmZURhdGFSZXN1bHQgfCBudWxsPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlPy5iaXJ0aERhdGUpIHJldHVybiBudWxsXG5cbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgICBpbmNsdWRlOiB7XG4gICAgICBzZXR0aW5nczogdHJ1ZSxcbiAgICAgIGV2ZW50czogeyBvcmRlckJ5OiB7IGRhdGU6ICdhc2MnIH0gfSxcbiAgICB9LFxuICB9KVxuXG4gIGlmICghc2NlbmFyaW8/LnNldHRpbmdzKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IG1pY3JvUGxhbnMgPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kTWFueSh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBvcmRlckJ5OiB7IGVmZmVjdGl2ZURhdGU6ICdhc2MnIH0sXG4gIH0pXG5cbiAgY29uc3Qgc2V0dGluZ3MgPSBzY2VuYXJpby5zZXR0aW5nc1xuICBjb25zdCBiaXJ0aERhdGUgPSBwcm9maWxlLmJpcnRoRGF0ZVxuXG4gIHJldHVybiB7XG4gICAgcHJvZmlsZUlkOiBwcm9maWxlLmlkLFxuICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcHJvZmlsZS5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgIGJhc2VDdXJyZW5jeTogKHByb2ZpbGUuYmFzZUN1cnJlbmN5IGFzIEN1cnJlbmN5Q29kZSkgfHwgJ0JSTCcsXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwcm9maWxlLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICBiYXNlTmV0V29ydGg6IHNldHRpbmdzLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBzZXR0aW5ncy5iYXNlTW9udGhseUluY29tZSxcbiAgICAgIGJhc2VNb250aGx5RXhwZW5zZXM6IHNldHRpbmdzLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBzZXR0aW5ncy5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHNldHRpbmdzLmV4cGVjdGVkUmV0dXJuWWVhcmx5LFxuICAgICAgaW5mbGF0aW9uWWVhcmx5OiBzZXR0aW5ncy5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBzZXR0aW5ncy5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHNldHRpbmdzLmluZmxhdGVFeHBlbnNlcyA/PyB0cnVlLFxuICAgICAgcmV0aXJlbWVudEFnZTogc2V0dGluZ3MucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBzZXR0aW5ncy5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVSZXRpcmVtZW50SW5jb21lID8/IHRydWUsXG4gICAgfSxcbiAgICBldmVudHM6IHNjZW5hcmlvLmV2ZW50cy5tYXAoZSA9PiAoe1xuICAgICAgaWQ6IGUuaWQsXG4gICAgICB0eXBlOiBlLnR5cGUgYXMgTGlmZUV2ZW50VHlwZSxcbiAgICAgIHRpdGxlOiBlLnRpdGxlLFxuICAgICAgZGF0ZTogZS5kYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmREYXRlOiBlLmVuZERhdGU/LnRvSVNPU3RyaW5nKCksXG4gICAgICBhbW91bnQ6IGUuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBlLmZyZXF1ZW5jeSBhcyAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5JyxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBlLmR1cmF0aW9uTW9udGhzID8/IHVuZGVmaW5lZCxcbiAgICAgIGluZmxhdGlvbkluZGV4ZWQ6IGUuaW5mbGF0aW9uSW5kZXhlZCxcbiAgICB9KSksXG4gICAgbWljcm9QbGFuczogbWljcm9QbGFucy5tYXAobSA9PiAoe1xuICAgICAgaWQ6IG0uaWQsXG4gICAgICBlZmZlY3RpdmVEYXRlOiBtLmVmZmVjdGl2ZURhdGUudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCksXG4gICAgICBtb250aGx5SW5jb21lOiBtLm1vbnRobHlJbmNvbWUsXG4gICAgICBtb250aGx5RXhwZW5zZXM6IG0ubW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogbS5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgIH0pKSxcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZywgcGF5bG9hZDogTGlmZURhdGFQYXlsb2FkKTogUHJvbWlzZTx7IHNjZW5hcmlvSWQ6IHN0cmluZyB9PiB7XG4gIGxldCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGNvbnN0IGJhc2VDdXJyZW5jeSA9IHBheWxvYWQuYmFzZUN1cnJlbmN5ID8/ICdCUkwnXG4gIGlmICghcHJvZmlsZSkge1xuICAgIHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBhdXRoVXNlcklkLFxuICAgICAgICBiaXJ0aERhdGU6IG5ldyBEYXRlKHBheWxvYWQuYmlydGhEYXRlKSxcbiAgICAgICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcGF5bG9hZC5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgICAgICBiYXNlQ3VycmVuY3ksXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICAgIGJhc2VDdXJyZW5jeSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGxldCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsIGlzRGVmYXVsdDogdHJ1ZSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB7XG4gICAgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICAgICAgbmFtZTogJ1BsYW5vIHByaW5jaXBhbCcsXG4gICAgICAgIGlzRGVmYXVsdDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGF3YWl0IHByaXNtYS5saWZlU2V0dGluZ3MudXBzZXJ0KHtcbiAgICB3aGVyZTogeyBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCB9LFxuICAgIGNyZWF0ZToge1xuICAgICAgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQsXG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gICAgdXBkYXRlOiB7XG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gIH0pXG5cbiAgcmV0dXJuIHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVFdmVudChcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IE9taXQ8TGlmZUV2ZW50UGF5bG9hZCwgJ2lkJz5cbik6IFByb21pc2U8eyBpZDogc3RyaW5nIH0+IHtcbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IHNjZW5hcmlvSWQsIHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0sXG4gIH0pXG4gIGlmICghc2NlbmFyaW8pIHRocm93IG5ldyBFcnJvcignU2NlbmFyaW8gbm90IGZvdW5kJylcblxuICBjb25zdCBldmVudCA9IGF3YWl0IHByaXNtYS5saWZlRXZlbnQuY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgdHlwZTogcGF5bG9hZC50eXBlLFxuICAgICAgdGl0bGU6IHBheWxvYWQudGl0bGUsXG4gICAgICBkYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmRhdGUpLFxuICAgICAgZW5kRGF0ZTogcGF5bG9hZC5lbmREYXRlID8gbmV3IERhdGUocGF5bG9hZC5lbmREYXRlKSA6IG51bGwsXG4gICAgICBhbW91bnQ6IHBheWxvYWQuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBwYXlsb2FkLmZyZXF1ZW5jeSxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBwYXlsb2FkLmR1cmF0aW9uTW9udGhzID8/IG51bGwsXG4gICAgICBpbmZsYXRpb25JbmRleGVkOiBwYXlsb2FkLmluZmxhdGlvbkluZGV4ZWQgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogZXZlbnQuaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlTGlmZUV2ZW50KGF1dGhVc2VySWQ6IHN0cmluZywgZXZlbnRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHsgd2hlcmU6IHsgYXV0aFVzZXJJZCB9IH0pXG4gIGlmICghcHJvZmlsZSkgcmV0dXJuXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IGV2ZW50SWQsIHNjZW5hcmlvOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCB9IH0sXG4gIH0pXG4gIGlmIChldmVudCkgYXdhaXQgcHJpc21hLmxpZmVFdmVudC5kZWxldGUoeyB3aGVyZTogeyBpZDogZXZlbnRJZCB9IH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZU1pY3JvUGxhbihcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IExpZmVNaWNyb1BsYW5QYXlsb2FkXG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpLFxuICAgICAgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lLFxuICAgICAgbW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLm1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbixcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogbWljcm9QbGFuLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgbWljcm9QbGFuSWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogUGFydGlhbDxMaWZlTWljcm9QbGFuUGF5bG9hZD5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAoIW1pY3JvUGxhbikgdGhyb3cgbmV3IEVycm9yKCdNaWNybyBwbGFuIG5vdCBmb3VuZCcpXG5cbiAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4udXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSxcbiAgICBkYXRhOiB7XG4gICAgICAuLi4ocGF5bG9hZC5lZmZlY3RpdmVEYXRlICE9IG51bGwgJiYgeyBlZmZlY3RpdmVEYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmVmZmVjdGl2ZURhdGUgKyAnVDEyOjAwOjAwJykgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5SW5jb21lICE9IG51bGwgJiYgeyBtb250aGx5SW5jb21lOiBwYXlsb2FkLm1vbnRobHlJbmNvbWUgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5RXhwZW5zZXMgIT0gbnVsbCAmJiB7IG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uICE9IG51bGwgJiYgeyBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24gfSksXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVNaWNyb1BsYW4oYXV0aFVzZXJJZDogc3RyaW5nLCBtaWNyb1BsYW5JZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkLCBzY2VuYXJpbzogeyBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9IH0sXG4gIH0pXG4gIGlmIChtaWNyb1BsYW4pIHtcbiAgICBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5kZWxldGUoeyB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSB9KVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjJTQTROc0IsNExBQUEifQ==
}),
"[project]/foundation-life/src/app/actions/data:d0f4d7 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "saveLifeMicroPlan",
    ()=>$$RSC_SERVER_ACTION_4
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"70bc2341ebf592c74631753ee3e6ed36c6e9bd537b":"saveLifeMicroPlan"},"foundation-life/src/app/actions/life.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("70bc2341ebf592c74631753ee3e6ed36c6e9bd537b", __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "saveLifeMicroPlan");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCB0eXBlIEN1cnJlbmN5Q29kZSA9ICdCUkwnIHwgJ1VTRCcgfCAnRVVSJ1xuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUGF5bG9hZCB7XG4gIGJpcnRoRGF0ZTogc3RyaW5nIC8vIElTT1xuICBsaWZlRXhwZWN0YW5jeVllYXJzOiBudW1iZXJcbiAgYmFzZU5ldFdvcnRoOiBudW1iZXJcbiAgYmFzZU1vbnRobHlJbmNvbWU6IG51bWJlclxuICBiYXNlTW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG4gIGV4cGVjdGVkUmV0dXJuWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0aW9uWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0ZUluY29tZTogYm9vbGVhblxuICBpbmZsYXRlRXhwZW5zZXM6IGJvb2xlYW5cbiAgcmV0aXJlbWVudEFnZTogbnVtYmVyXG4gIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBudW1iZXJcbiAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IGJvb2xlYW5cbiAgYmFzZUN1cnJlbmN5PzogQ3VycmVuY3lDb2RlXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZUV2ZW50UGF5bG9hZCB7XG4gIGlkPzogc3RyaW5nXG4gIHR5cGU6IExpZmVFdmVudFR5cGVcbiAgdGl0bGU6IHN0cmluZ1xuICBkYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGVuZERhdGU/OiBzdHJpbmdcbiAgYW1vdW50OiBudW1iZXJcbiAgZnJlcXVlbmN5OiAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5J1xuICBkdXJhdGlvbk1vbnRocz86IG51bWJlclxuICBpbmZsYXRpb25JbmRleGVkPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVNaWNyb1BsYW5QYXlsb2FkIHtcbiAgZWZmZWN0aXZlRGF0ZTogc3RyaW5nIC8vIElTTyBkYXRlIChZWVlZLU1NLUREIG9yIGZ1bGwgSVNPKVxuICBtb250aGx5SW5jb21lOiBudW1iZXJcbiAgbW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFSZXN1bHQge1xuICBwcm9maWxlSWQ6IHN0cmluZ1xuICBzY2VuYXJpb0lkOiBzdHJpbmdcbiAgYmlydGhEYXRlOiBzdHJpbmdcbiAgbGlmZUV4cGVjdGFuY3lZZWFyczogbnVtYmVyXG4gIGJhc2VDdXJyZW5jeTogQ3VycmVuY3lDb2RlXG4gIHNldHRpbmdzOiBMaWZlRGF0YVBheWxvYWRcbiAgZXZlbnRzOiBMaWZlRXZlbnRQYXlsb2FkW11cbiAgbWljcm9QbGFuczogKExpZmVNaWNyb1BsYW5QYXlsb2FkICYgeyBpZDogc3RyaW5nIH0pW11cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldExpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZyk6IFByb21pc2U8TGlmZURhdGFSZXN1bHQgfCBudWxsPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlPy5iaXJ0aERhdGUpIHJldHVybiBudWxsXG5cbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgICBpbmNsdWRlOiB7XG4gICAgICBzZXR0aW5nczogdHJ1ZSxcbiAgICAgIGV2ZW50czogeyBvcmRlckJ5OiB7IGRhdGU6ICdhc2MnIH0gfSxcbiAgICB9LFxuICB9KVxuXG4gIGlmICghc2NlbmFyaW8/LnNldHRpbmdzKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IG1pY3JvUGxhbnMgPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kTWFueSh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBvcmRlckJ5OiB7IGVmZmVjdGl2ZURhdGU6ICdhc2MnIH0sXG4gIH0pXG5cbiAgY29uc3Qgc2V0dGluZ3MgPSBzY2VuYXJpby5zZXR0aW5nc1xuICBjb25zdCBiaXJ0aERhdGUgPSBwcm9maWxlLmJpcnRoRGF0ZVxuXG4gIHJldHVybiB7XG4gICAgcHJvZmlsZUlkOiBwcm9maWxlLmlkLFxuICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcHJvZmlsZS5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgIGJhc2VDdXJyZW5jeTogKHByb2ZpbGUuYmFzZUN1cnJlbmN5IGFzIEN1cnJlbmN5Q29kZSkgfHwgJ0JSTCcsXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwcm9maWxlLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICBiYXNlTmV0V29ydGg6IHNldHRpbmdzLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBzZXR0aW5ncy5iYXNlTW9udGhseUluY29tZSxcbiAgICAgIGJhc2VNb250aGx5RXhwZW5zZXM6IHNldHRpbmdzLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBzZXR0aW5ncy5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHNldHRpbmdzLmV4cGVjdGVkUmV0dXJuWWVhcmx5LFxuICAgICAgaW5mbGF0aW9uWWVhcmx5OiBzZXR0aW5ncy5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBzZXR0aW5ncy5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHNldHRpbmdzLmluZmxhdGVFeHBlbnNlcyA/PyB0cnVlLFxuICAgICAgcmV0aXJlbWVudEFnZTogc2V0dGluZ3MucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBzZXR0aW5ncy5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVSZXRpcmVtZW50SW5jb21lID8/IHRydWUsXG4gICAgfSxcbiAgICBldmVudHM6IHNjZW5hcmlvLmV2ZW50cy5tYXAoZSA9PiAoe1xuICAgICAgaWQ6IGUuaWQsXG4gICAgICB0eXBlOiBlLnR5cGUgYXMgTGlmZUV2ZW50VHlwZSxcbiAgICAgIHRpdGxlOiBlLnRpdGxlLFxuICAgICAgZGF0ZTogZS5kYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmREYXRlOiBlLmVuZERhdGU/LnRvSVNPU3RyaW5nKCksXG4gICAgICBhbW91bnQ6IGUuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBlLmZyZXF1ZW5jeSBhcyAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5JyxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBlLmR1cmF0aW9uTW9udGhzID8/IHVuZGVmaW5lZCxcbiAgICAgIGluZmxhdGlvbkluZGV4ZWQ6IGUuaW5mbGF0aW9uSW5kZXhlZCxcbiAgICB9KSksXG4gICAgbWljcm9QbGFuczogbWljcm9QbGFucy5tYXAobSA9PiAoe1xuICAgICAgaWQ6IG0uaWQsXG4gICAgICBlZmZlY3RpdmVEYXRlOiBtLmVmZmVjdGl2ZURhdGUudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCksXG4gICAgICBtb250aGx5SW5jb21lOiBtLm1vbnRobHlJbmNvbWUsXG4gICAgICBtb250aGx5RXhwZW5zZXM6IG0ubW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogbS5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgIH0pKSxcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZywgcGF5bG9hZDogTGlmZURhdGFQYXlsb2FkKTogUHJvbWlzZTx7IHNjZW5hcmlvSWQ6IHN0cmluZyB9PiB7XG4gIGxldCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGNvbnN0IGJhc2VDdXJyZW5jeSA9IHBheWxvYWQuYmFzZUN1cnJlbmN5ID8/ICdCUkwnXG4gIGlmICghcHJvZmlsZSkge1xuICAgIHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBhdXRoVXNlcklkLFxuICAgICAgICBiaXJ0aERhdGU6IG5ldyBEYXRlKHBheWxvYWQuYmlydGhEYXRlKSxcbiAgICAgICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcGF5bG9hZC5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgICAgICBiYXNlQ3VycmVuY3ksXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICAgIGJhc2VDdXJyZW5jeSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGxldCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsIGlzRGVmYXVsdDogdHJ1ZSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB7XG4gICAgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICAgICAgbmFtZTogJ1BsYW5vIHByaW5jaXBhbCcsXG4gICAgICAgIGlzRGVmYXVsdDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGF3YWl0IHByaXNtYS5saWZlU2V0dGluZ3MudXBzZXJ0KHtcbiAgICB3aGVyZTogeyBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCB9LFxuICAgIGNyZWF0ZToge1xuICAgICAgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQsXG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gICAgdXBkYXRlOiB7XG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gIH0pXG5cbiAgcmV0dXJuIHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVFdmVudChcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IE9taXQ8TGlmZUV2ZW50UGF5bG9hZCwgJ2lkJz5cbik6IFByb21pc2U8eyBpZDogc3RyaW5nIH0+IHtcbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IHNjZW5hcmlvSWQsIHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0sXG4gIH0pXG4gIGlmICghc2NlbmFyaW8pIHRocm93IG5ldyBFcnJvcignU2NlbmFyaW8gbm90IGZvdW5kJylcblxuICBjb25zdCBldmVudCA9IGF3YWl0IHByaXNtYS5saWZlRXZlbnQuY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgdHlwZTogcGF5bG9hZC50eXBlLFxuICAgICAgdGl0bGU6IHBheWxvYWQudGl0bGUsXG4gICAgICBkYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmRhdGUpLFxuICAgICAgZW5kRGF0ZTogcGF5bG9hZC5lbmREYXRlID8gbmV3IERhdGUocGF5bG9hZC5lbmREYXRlKSA6IG51bGwsXG4gICAgICBhbW91bnQ6IHBheWxvYWQuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBwYXlsb2FkLmZyZXF1ZW5jeSxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBwYXlsb2FkLmR1cmF0aW9uTW9udGhzID8/IG51bGwsXG4gICAgICBpbmZsYXRpb25JbmRleGVkOiBwYXlsb2FkLmluZmxhdGlvbkluZGV4ZWQgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogZXZlbnQuaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlTGlmZUV2ZW50KGF1dGhVc2VySWQ6IHN0cmluZywgZXZlbnRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHsgd2hlcmU6IHsgYXV0aFVzZXJJZCB9IH0pXG4gIGlmICghcHJvZmlsZSkgcmV0dXJuXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IGV2ZW50SWQsIHNjZW5hcmlvOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCB9IH0sXG4gIH0pXG4gIGlmIChldmVudCkgYXdhaXQgcHJpc21hLmxpZmVFdmVudC5kZWxldGUoeyB3aGVyZTogeyBpZDogZXZlbnRJZCB9IH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZU1pY3JvUGxhbihcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IExpZmVNaWNyb1BsYW5QYXlsb2FkXG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpLFxuICAgICAgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lLFxuICAgICAgbW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLm1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbixcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogbWljcm9QbGFuLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgbWljcm9QbGFuSWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogUGFydGlhbDxMaWZlTWljcm9QbGFuUGF5bG9hZD5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAoIW1pY3JvUGxhbikgdGhyb3cgbmV3IEVycm9yKCdNaWNybyBwbGFuIG5vdCBmb3VuZCcpXG5cbiAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4udXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSxcbiAgICBkYXRhOiB7XG4gICAgICAuLi4ocGF5bG9hZC5lZmZlY3RpdmVEYXRlICE9IG51bGwgJiYgeyBlZmZlY3RpdmVEYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmVmZmVjdGl2ZURhdGUgKyAnVDEyOjAwOjAwJykgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5SW5jb21lICE9IG51bGwgJiYgeyBtb250aGx5SW5jb21lOiBwYXlsb2FkLm1vbnRobHlJbmNvbWUgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5RXhwZW5zZXMgIT0gbnVsbCAmJiB7IG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uICE9IG51bGwgJiYgeyBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24gfSksXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVNaWNyb1BsYW4oYXV0aFVzZXJJZDogc3RyaW5nLCBtaWNyb1BsYW5JZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkLCBzY2VuYXJpbzogeyBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9IH0sXG4gIH0pXG4gIGlmIChtaWNyb1BsYW4pIHtcbiAgICBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5kZWxldGUoeyB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSB9KVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjZTQXNPc0IsOExBQUEifQ==
}),
"[project]/foundation-life/src/app/actions/data:19710a [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteLifeMicroPlan",
    ()=>$$RSC_SERVER_ACTION_6
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"60930212137d8c346826a64f1c60690a51d72ad0dc":"deleteLifeMicroPlan"},"foundation-life/src/app/actions/life.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60930212137d8c346826a64f1c60690a51d72ad0dc", __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteLifeMicroPlan");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCB0eXBlIEN1cnJlbmN5Q29kZSA9ICdCUkwnIHwgJ1VTRCcgfCAnRVVSJ1xuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUGF5bG9hZCB7XG4gIGJpcnRoRGF0ZTogc3RyaW5nIC8vIElTT1xuICBsaWZlRXhwZWN0YW5jeVllYXJzOiBudW1iZXJcbiAgYmFzZU5ldFdvcnRoOiBudW1iZXJcbiAgYmFzZU1vbnRobHlJbmNvbWU6IG51bWJlclxuICBiYXNlTW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG4gIGV4cGVjdGVkUmV0dXJuWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0aW9uWWVhcmx5OiBudW1iZXJcbiAgaW5mbGF0ZUluY29tZTogYm9vbGVhblxuICBpbmZsYXRlRXhwZW5zZXM6IGJvb2xlYW5cbiAgcmV0aXJlbWVudEFnZTogbnVtYmVyXG4gIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBudW1iZXJcbiAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IGJvb2xlYW5cbiAgYmFzZUN1cnJlbmN5PzogQ3VycmVuY3lDb2RlXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZUV2ZW50UGF5bG9hZCB7XG4gIGlkPzogc3RyaW5nXG4gIHR5cGU6IExpZmVFdmVudFR5cGVcbiAgdGl0bGU6IHN0cmluZ1xuICBkYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGVuZERhdGU/OiBzdHJpbmdcbiAgYW1vdW50OiBudW1iZXJcbiAgZnJlcXVlbmN5OiAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5J1xuICBkdXJhdGlvbk1vbnRocz86IG51bWJlclxuICBpbmZsYXRpb25JbmRleGVkPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVNaWNyb1BsYW5QYXlsb2FkIHtcbiAgZWZmZWN0aXZlRGF0ZTogc3RyaW5nIC8vIElTTyBkYXRlIChZWVlZLU1NLUREIG9yIGZ1bGwgSVNPKVxuICBtb250aGx5SW5jb21lOiBudW1iZXJcbiAgbW9udGhseUV4cGVuc2VzOiBudW1iZXJcbiAgbW9udGhseUNvbnRyaWJ1dGlvbjogbnVtYmVyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFSZXN1bHQge1xuICBwcm9maWxlSWQ6IHN0cmluZ1xuICBzY2VuYXJpb0lkOiBzdHJpbmdcbiAgYmlydGhEYXRlOiBzdHJpbmdcbiAgbGlmZUV4cGVjdGFuY3lZZWFyczogbnVtYmVyXG4gIGJhc2VDdXJyZW5jeTogQ3VycmVuY3lDb2RlXG4gIHNldHRpbmdzOiBMaWZlRGF0YVBheWxvYWRcbiAgZXZlbnRzOiBMaWZlRXZlbnRQYXlsb2FkW11cbiAgbWljcm9QbGFuczogKExpZmVNaWNyb1BsYW5QYXlsb2FkICYgeyBpZDogc3RyaW5nIH0pW11cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldExpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZyk6IFByb21pc2U8TGlmZURhdGFSZXN1bHQgfCBudWxsPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlPy5iaXJ0aERhdGUpIHJldHVybiBudWxsXG5cbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgICBpbmNsdWRlOiB7XG4gICAgICBzZXR0aW5nczogdHJ1ZSxcbiAgICAgIGV2ZW50czogeyBvcmRlckJ5OiB7IGRhdGU6ICdhc2MnIH0gfSxcbiAgICB9LFxuICB9KVxuXG4gIGlmICghc2NlbmFyaW8/LnNldHRpbmdzKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IG1pY3JvUGxhbnMgPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kTWFueSh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBvcmRlckJ5OiB7IGVmZmVjdGl2ZURhdGU6ICdhc2MnIH0sXG4gIH0pXG5cbiAgY29uc3Qgc2V0dGluZ3MgPSBzY2VuYXJpby5zZXR0aW5nc1xuICBjb25zdCBiaXJ0aERhdGUgPSBwcm9maWxlLmJpcnRoRGF0ZVxuXG4gIHJldHVybiB7XG4gICAgcHJvZmlsZUlkOiBwcm9maWxlLmlkLFxuICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcHJvZmlsZS5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgIGJhc2VDdXJyZW5jeTogKHByb2ZpbGUuYmFzZUN1cnJlbmN5IGFzIEN1cnJlbmN5Q29kZSkgfHwgJ0JSTCcsXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgIGJpcnRoRGF0ZTogYmlydGhEYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwcm9maWxlLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICBiYXNlTmV0V29ydGg6IHNldHRpbmdzLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBzZXR0aW5ncy5iYXNlTW9udGhseUluY29tZSxcbiAgICAgIGJhc2VNb250aGx5RXhwZW5zZXM6IHNldHRpbmdzLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBzZXR0aW5ncy5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHNldHRpbmdzLmV4cGVjdGVkUmV0dXJuWWVhcmx5LFxuICAgICAgaW5mbGF0aW9uWWVhcmx5OiBzZXR0aW5ncy5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBzZXR0aW5ncy5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHNldHRpbmdzLmluZmxhdGVFeHBlbnNlcyA/PyB0cnVlLFxuICAgICAgcmV0aXJlbWVudEFnZTogc2V0dGluZ3MucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBzZXR0aW5ncy5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVSZXRpcmVtZW50SW5jb21lID8/IHRydWUsXG4gICAgfSxcbiAgICBldmVudHM6IHNjZW5hcmlvLmV2ZW50cy5tYXAoZSA9PiAoe1xuICAgICAgaWQ6IGUuaWQsXG4gICAgICB0eXBlOiBlLnR5cGUgYXMgTGlmZUV2ZW50VHlwZSxcbiAgICAgIHRpdGxlOiBlLnRpdGxlLFxuICAgICAgZGF0ZTogZS5kYXRlLnRvSVNPU3RyaW5nKCksXG4gICAgICBlbmREYXRlOiBlLmVuZERhdGU/LnRvSVNPU3RyaW5nKCksXG4gICAgICBhbW91bnQ6IGUuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBlLmZyZXF1ZW5jeSBhcyAnb25jZScgfCAnbW9udGhseScgfCAneWVhcmx5JyxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBlLmR1cmF0aW9uTW9udGhzID8/IHVuZGVmaW5lZCxcbiAgICAgIGluZmxhdGlvbkluZGV4ZWQ6IGUuaW5mbGF0aW9uSW5kZXhlZCxcbiAgICB9KSksXG4gICAgbWljcm9QbGFuczogbWljcm9QbGFucy5tYXAobSA9PiAoe1xuICAgICAgaWQ6IG0uaWQsXG4gICAgICBlZmZlY3RpdmVEYXRlOiBtLmVmZmVjdGl2ZURhdGUudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCksXG4gICAgICBtb250aGx5SW5jb21lOiBtLm1vbnRobHlJbmNvbWUsXG4gICAgICBtb250aGx5RXhwZW5zZXM6IG0ubW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogbS5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgIH0pKSxcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVEYXRhKGF1dGhVc2VySWQ6IHN0cmluZywgcGF5bG9hZDogTGlmZURhdGFQYXlsb2FkKTogUHJvbWlzZTx7IHNjZW5hcmlvSWQ6IHN0cmluZyB9PiB7XG4gIGxldCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGNvbnN0IGJhc2VDdXJyZW5jeSA9IHBheWxvYWQuYmFzZUN1cnJlbmN5ID8/ICdCUkwnXG4gIGlmICghcHJvZmlsZSkge1xuICAgIHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBhdXRoVXNlcklkLFxuICAgICAgICBiaXJ0aERhdGU6IG5ldyBEYXRlKHBheWxvYWQuYmlydGhEYXRlKSxcbiAgICAgICAgbGlmZUV4cGVjdGFuY3lZZWFyczogcGF5bG9hZC5saWZlRXhwZWN0YW5jeVllYXJzLFxuICAgICAgICBiYXNlQ3VycmVuY3ksXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICAgIGJhc2VDdXJyZW5jeSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGxldCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsIGlzRGVmYXVsdDogdHJ1ZSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB7XG4gICAgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICAgICAgbmFtZTogJ1BsYW5vIHByaW5jaXBhbCcsXG4gICAgICAgIGlzRGVmYXVsdDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGF3YWl0IHByaXNtYS5saWZlU2V0dGluZ3MudXBzZXJ0KHtcbiAgICB3aGVyZTogeyBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCB9LFxuICAgIGNyZWF0ZToge1xuICAgICAgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQsXG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gICAgdXBkYXRlOiB7XG4gICAgICBiYXNlTmV0V29ydGg6IHBheWxvYWQuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHBheWxvYWQuYmFzZU1vbnRobHlJbmNvbWUsXG4gICAgICBiYXNlTW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLmJhc2VNb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogcGF5bG9hZC5leHBlY3RlZFJldHVyblllYXJseSxcbiAgICAgIGluZmxhdGlvblllYXJseTogcGF5bG9hZC5pbmZsYXRpb25ZZWFybHksXG4gICAgICBpbmZsYXRlSW5jb21lOiBwYXlsb2FkLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogcGF5bG9hZC5pbmZsYXRlRXhwZW5zZXMgPz8gdHJ1ZSxcbiAgICAgIHJldGlyZW1lbnRBZ2U6IHBheWxvYWQucmV0aXJlbWVudEFnZSA/PyA2NSxcbiAgICAgIHJldGlyZW1lbnRNb250aGx5SW5jb21lOiBwYXlsb2FkLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogcGF5bG9hZC5pbmZsYXRlUmV0aXJlbWVudEluY29tZSA/PyB0cnVlLFxuICAgIH0sXG4gIH0pXG5cbiAgcmV0dXJuIHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVFdmVudChcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IE9taXQ8TGlmZUV2ZW50UGF5bG9hZCwgJ2lkJz5cbik6IFByb21pc2U8eyBpZDogc3RyaW5nIH0+IHtcbiAgY29uc3Qgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IHNjZW5hcmlvSWQsIHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0sXG4gIH0pXG4gIGlmICghc2NlbmFyaW8pIHRocm93IG5ldyBFcnJvcignU2NlbmFyaW8gbm90IGZvdW5kJylcblxuICBjb25zdCBldmVudCA9IGF3YWl0IHByaXNtYS5saWZlRXZlbnQuY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgdHlwZTogcGF5bG9hZC50eXBlLFxuICAgICAgdGl0bGU6IHBheWxvYWQudGl0bGUsXG4gICAgICBkYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmRhdGUpLFxuICAgICAgZW5kRGF0ZTogcGF5bG9hZC5lbmREYXRlID8gbmV3IERhdGUocGF5bG9hZC5lbmREYXRlKSA6IG51bGwsXG4gICAgICBhbW91bnQ6IHBheWxvYWQuYW1vdW50LFxuICAgICAgZnJlcXVlbmN5OiBwYXlsb2FkLmZyZXF1ZW5jeSxcbiAgICAgIGR1cmF0aW9uTW9udGhzOiBwYXlsb2FkLmR1cmF0aW9uTW9udGhzID8/IG51bGwsXG4gICAgICBpbmZsYXRpb25JbmRleGVkOiBwYXlsb2FkLmluZmxhdGlvbkluZGV4ZWQgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogZXZlbnQuaWQgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlTGlmZUV2ZW50KGF1dGhVc2VySWQ6IHN0cmluZywgZXZlbnRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHsgd2hlcmU6IHsgYXV0aFVzZXJJZCB9IH0pXG4gIGlmICghcHJvZmlsZSkgcmV0dXJuXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IGV2ZW50SWQsIHNjZW5hcmlvOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCB9IH0sXG4gIH0pXG4gIGlmIChldmVudCkgYXdhaXQgcHJpc21hLmxpZmVFdmVudC5kZWxldGUoeyB3aGVyZTogeyBpZDogZXZlbnRJZCB9IH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZU1pY3JvUGxhbihcbiAgYXV0aFVzZXJJZDogc3RyaW5nLFxuICBzY2VuYXJpb0lkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IExpZmVNaWNyb1BsYW5QYXlsb2FkXG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICBzY2VuYXJpb0lkLFxuICAgICAgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpLFxuICAgICAgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lLFxuICAgICAgbW9udGhseUV4cGVuc2VzOiBwYXlsb2FkLm1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbixcbiAgICB9LFxuICB9KVxuICByZXR1cm4geyBpZDogbWljcm9QbGFuLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgbWljcm9QbGFuSWQ6IHN0cmluZyxcbiAgcGF5bG9hZDogUGFydGlhbDxMaWZlTWljcm9QbGFuUGF5bG9hZD5cbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAoIW1pY3JvUGxhbikgdGhyb3cgbmV3IEVycm9yKCdNaWNybyBwbGFuIG5vdCBmb3VuZCcpXG5cbiAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4udXBkYXRlKHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSxcbiAgICBkYXRhOiB7XG4gICAgICAuLi4ocGF5bG9hZC5lZmZlY3RpdmVEYXRlICE9IG51bGwgJiYgeyBlZmZlY3RpdmVEYXRlOiBuZXcgRGF0ZShwYXlsb2FkLmVmZmVjdGl2ZURhdGUgKyAnVDEyOjAwOjAwJykgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5SW5jb21lICE9IG51bGwgJiYgeyBtb250aGx5SW5jb21lOiBwYXlsb2FkLm1vbnRobHlJbmNvbWUgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5RXhwZW5zZXMgIT0gbnVsbCAmJiB7IG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMgfSksXG4gICAgICAuLi4ocGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uICE9IG51bGwgJiYgeyBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24gfSksXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVNaWNyb1BsYW4oYXV0aFVzZXJJZDogc3RyaW5nLCBtaWNyb1BsYW5JZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkLCBzY2VuYXJpbzogeyBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9IH0sXG4gIH0pXG4gIGlmIChtaWNyb1BsYW4pIHtcbiAgICBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5kZWxldGUoeyB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQgfSB9KVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IitTQWlSc0IsZ01BQUEifQ==
}),
"[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LifeMicroPlanForm",
    ()=>LifeMicroPlanForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/card.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function LifeMicroPlanForm({ onSubmit, onCancel, defaultDate = new Date().toISOString().slice(0, 10) }) {
    _s();
    const [effectiveDate, setEffectiveDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultDate);
    const [monthlyIncome, setMonthlyIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [monthlyExpenses, setMonthlyExpenses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({
            effectiveDate,
            monthlyIncome,
            monthlyExpenses,
            monthlyContribution: Math.max(0, monthlyIncome - monthlyExpenses)
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                className: "pb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                    className: "text-base",
                    children: "Novo micro plano"
                }, void 0, false, {
                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 sm:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "A partir de (data)"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            type: "date",
                                            value: effectiveDate,
                                            onChange: (e)=>setEffectiveDate(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Renda mensal (R$)"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 58,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            type: "number",
                                            min: 0,
                                            value: monthlyIncome || '',
                                            onChange: (e)=>setMonthlyIncome(Number(e.target.value)),
                                            placeholder: "0"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 59,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Gastos mensais (R$)"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            type: "number",
                                            min: 0,
                                            value: monthlyExpenses || '',
                                            onChange: (e)=>setMonthlyExpenses(Number(e.target.value)),
                                            placeholder: "0"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 69,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground",
                            children: "O aporte é calculado automaticamente (renda − gastos)."
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "submit",
                                    size: "sm",
                                    children: "Adicionar"
                                }, void 0, false, {
                                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this),
                                onCancel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline",
                                    size: "sm",
                                    onClick: onCancel,
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                    lineNumber: 86,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(LifeMicroPlanForm, "qDQzAPRqtVnS7WyI2DTPIlIcmhY=");
_c = LifeMicroPlanForm;
var _c;
__turbopack_context__.k.register(_c, "LifeMicroPlanForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/micro-plans/components/life-micro-plans-list.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LifeMicroPlansList",
    ()=>LifeMicroPlansList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/button.tsx [app-client] (ecmascript)");
'use client';
;
;
function formatDate(isoDate) {
    return new Date(isoDate + 'T12:00:00').toLocaleDateString('pt-BR', {
        month: 'short',
        year: 'numeric'
    });
}
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
function LifeMicroPlansList({ microPlans, onDelete }) {
    if (microPlans.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm text-muted-foreground",
            children: "Nenhum micro plano. Adicione para definir mudanças de renda, gastos e aporte a partir de uma data."
        }, void 0, false, {
            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plans-list.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this);
    }
    const sorted = [
        ...microPlans
    ].sort((a, b)=>new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        className: "space-y-2",
        children: sorted.map((plan)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-foreground",
                                children: [
                                    "A partir de ",
                                    formatDate(plan.effectiveDate)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plans-list.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                    "Renda ",
                                    formatCurrency(plan.monthlyIncome),
                                    " · Gastos ",
                                    formatCurrency(plan.monthlyExpenses),
                                    " · Aporte ",
                                    formatCurrency(plan.monthlyContribution)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plans-list.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plans-list.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        onClick: ()=>onDelete(plan.id),
                        className: "h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive",
                        "aria-label": "Excluir micro plano",
                        children: "×"
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plans-list.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                ]
            }, plan.id, true, {
                fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plans-list.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plans-list.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c = LifeMicroPlansList;
var _c;
__turbopack_context__.k.register(_c, "LifeMicroPlansList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/components/ui/collapsible-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CollapsibleCard",
    ()=>CollapsibleCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function CollapsibleCard({ title, description, defaultOpen = false, open: controlledOpen, onOpenChange, children, className, headerAction }) {
    _s();
    const [internalOpen, setInternalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? onOpenChange ?? (()=>{}) : setInternalOpen;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('overflow-hidden', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                className: "cursor-pointer select-none space-y-0 py-4 transition-colors hover:bg-muted/50",
                onClick: ()=>setOpen(!open),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-muted-foreground",
                                    "aria-hidden": true,
                                    children: open ? '▼' : '▶'
                                }, void 0, false, {
                                    fileName: "[project]/foundation-life/src/components/ui/collapsible-card.tsx",
                                    lineNumber: 43,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "text-base",
                                            children: title
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/components/ui/collapsible-card.tsx",
                                            lineNumber: 47,
                                            columnNumber: 15
                                        }, this),
                                        description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                            className: "mt-0.5",
                                            children: description
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/components/ui/collapsible-card.tsx",
                                            lineNumber: 49,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/components/ui/collapsible-card.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/components/ui/collapsible-card.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        headerAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: (e)=>e.stopPropagation(),
                            children: headerAction
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/components/ui/collapsible-card.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/foundation-life/src/components/ui/collapsible-card.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/components/ui/collapsible-card.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "pt-0",
                children: children
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/components/ui/collapsible-card.tsx",
                lineNumber: 58,
                columnNumber: 16
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/components/ui/collapsible-card.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(CollapsibleCard, "02lQPjUaUn/8vZaAiTGBQJQRahE=");
_c = CollapsibleCard;
var _c;
__turbopack_context__.k.register(_c, "CollapsibleCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChartRangeFilter",
    ()=>ChartRangeFilter,
    "filterMonthlyByRange",
    ()=>filterMonthlyByRange,
    "filterYearlyByRange",
    ()=>filterYearlyByRange,
    "getChartRange",
    ()=>getChartRange,
    "getDefaultChartRangeState",
    ()=>getDefaultChartRangeState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const PRESETS = [
    {
        value: 'current_year',
        label: 'Ano atual'
    },
    {
        value: 'next_5',
        label: 'Próximos 5 anos'
    },
    {
        value: 'next_10',
        label: 'Próximos 10 anos'
    },
    {
        value: 'all',
        label: 'Todos'
    },
    {
        value: 'custom',
        label: 'Personalizado'
    }
];
function getMonthKey(date) {
    return date.getFullYear() * 12 + date.getMonth();
}
function getChartRange(state) {
    const now = new Date();
    const currentKey = getMonthKey(now);
    switch(state.preset){
        case 'current_year':
            return {
                startKey: currentKey,
                endKey: currentKey + 11
            };
        case 'next_5':
            return {
                startKey: currentKey,
                endKey: currentKey + 60
            };
        case 'next_10':
            return {
                startKey: currentKey,
                endKey: currentKey + 120
            };
        case 'all':
            return {
                startKey: currentKey,
                endKey: currentKey + 1200
            };
        case 'custom':
            {
                const [sy, sm] = state.customStart.split('-').map(Number);
                const [ey, em] = state.customEnd.split('-').map(Number);
                const startKey = sy * 12 + (sm - 1);
                const endKey = ey * 12 + (em - 1);
                return {
                    startKey,
                    endKey
                };
            }
        default:
            return {
                startKey: currentKey,
                endKey: currentKey + 120
            };
    }
}
const defaultState = {
    preset: 'all',
    customStart: new Date().toISOString().slice(0, 7),
    customEnd: new Date(Date.now() + 10 * 365.25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7)
};
function ChartRangeFilter({ value, onChange, className }) {
    function handlePreset(preset) {
        onChange({
            ...value,
            preset
        });
    }
    function handleCustomRange(field, v) {
        onChange({
            ...value,
            [field]: v
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-wrap items-center gap-2', className),
        children: [
            PRESETS.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    variant: value.preset === p.value ? 'default' : 'outline',
                    size: "sm",
                    onClick: ()=>handlePreset(p.value),
                    children: p.label
                }, p.value, false, {
                    fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)),
            value.preset === 'custom' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ml-2 flex flex-wrap items-center gap-2 border-l border-border pl-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "chart-start",
                                className: "text-xs text-muted-foreground whitespace-nowrap",
                                children: "Início"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                id: "chart-start",
                                type: "month",
                                value: value.customStart,
                                onChange: (e)=>handleCustomRange('customStart', e.target.value),
                                className: "h-8 w-36"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "chart-end",
                                className: "text-xs text-muted-foreground whitespace-nowrap",
                                children: "Fim"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                id: "chart-end",
                                type: "month",
                                value: value.customEnd,
                                onChange: (e)=>handleCustomRange('customEnd', e.target.value),
                                className: "h-8 w-36"
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_c = ChartRangeFilter;
function getDefaultChartRangeState() {
    return defaultState;
}
function filterMonthlyByRange(data, range) {
    return data.filter((p)=>{
        const k = p.date.getFullYear() * 12 + p.date.getMonth();
        return k >= range.startKey && k <= range.endKey;
    });
}
function filterYearlyByRange(yearly, range) {
    const startYear = Math.floor(range.startKey / 12);
    const endYear = Math.floor(range.endKey / 12);
    return yearly.filter((r)=>r.year >= startYear && r.year <= endYear);
}
var _c;
__turbopack_context__.k.register(_c, "ChartRangeFilter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EditSidebar",
    ()=>EditSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
const SECTIONS = [
    {
        key: 'you',
        label: 'Você hoje',
        icon: IconUser
    },
    {
        key: 'aposentadoria',
        label: 'Aposentadoria',
        icon: IconPension
    },
    {
        key: 'microPlans',
        label: 'Micro planos',
        icon: IconLayers
    },
    {
        key: 'events',
        label: 'Eventos',
        icon: IconCalendar
    },
    {
        key: 'configuracoes',
        label: 'Configurações',
        icon: IconSliders
    }
];
function IconUser({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = IconUser;
function IconSliders({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "4",
                y1: "21",
                x2: "4",
                y2: "14"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "4",
                y1: "10",
                x2: "4",
                y2: "3"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "21",
                x2: "12",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "8",
                x2: "12",
                y2: "3"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "20",
                y1: "21",
                x2: "20",
                y2: "16"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "20",
                y1: "12",
                x2: "20",
                y2: "3"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "1",
                y1: "14",
                x2: "7",
                y2: "14"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "8",
                x2: "15",
                y2: "8"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "17",
                y1: "16",
                x2: "23",
                y2: "16"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c1 = IconSliders;
function IconLayers({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "12 2 2 7 12 12 22 7 12 2"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "2 17 12 22 22 17"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_c2 = IconLayers;
function IconCalendar({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "4",
                width: "18",
                height: "18",
                rx: "2",
                ry: "2"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "16",
                y1: "2",
                x2: "16",
                y2: "6"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "8",
                y1: "2",
                x2: "8",
                y2: "6"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "3",
                y1: "10",
                x2: "21",
                y2: "10"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_c3 = IconCalendar;
function IconPension({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "5"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "1",
                x2: "12",
                y2: "3"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "21",
                x2: "12",
                y2: "23"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "4.22",
                y1: "4.22",
                x2: "5.64",
                y2: "5.64"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "18.36",
                y1: "18.36",
                x2: "19.78",
                y2: "19.78"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "1",
                y1: "12",
                x2: "3",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "21",
                y1: "12",
                x2: "23",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "4.22",
                y1: "19.78",
                x2: "5.64",
                y2: "18.36"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "18.36",
                y1: "5.64",
                x2: "19.78",
                y2: "4.22"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_c4 = IconPension;
function EditSidebar({ onSelect, className, isOverlay, onCloseOverlay }) {
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-2', 'w-full min-w-[200px]', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-1 px-2 py-1 text-xs font-medium text-muted-foreground",
                children: "Editar dados"
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            SECTIONS.map(({ key, label, icon: Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    size: "sm",
                    className: "justify-start gap-3 text-left",
                    onClick: ()=>{
                        onSelect(key);
                        onCloseOverlay?.();
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: "shrink-0 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: label
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this)
                    ]
                }, key, true, {
                    fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
    if (isOverlay) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-40 bg-black/50 md:hidden",
                    onClick: onCloseOverlay,
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed left-0 top-0 z-50 h-full w-[240px] border-r border-border bg-background p-4 pt-20 shadow-xl md:hidden",
                    children: content
                }, void 0, false, {
                    fileName: "[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    return content;
}
_c5 = EditSidebar;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "IconUser");
__turbopack_context__.k.register(_c1, "IconSliders");
__turbopack_context__.k.register(_c2, "IconLayers");
__turbopack_context__.k.register(_c3, "IconCalendar");
__turbopack_context__.k.register(_c4, "IconPension");
__turbopack_context__.k.register(_c5, "EditSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/insights/utils/life-insights.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLifeInsights",
    ()=>getLifeInsights
]);
function formatBRL(value) {
    return Math.round(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
function getLifeInsights(projection, profile, settings) {
    const insights = [];
    const { monthly, firstMonthWithZeroOrNegativeNetWorth } = projection;
    const monthlyContribution = Math.max(0, settings.baseMonthlyIncome - settings.baseMonthlyExpenses);
    if (firstMonthWithZeroOrNegativeNetWorth !== null) {
        const point = monthly[firstMonthWithZeroOrNegativeNetWorth];
        const dateLabel = point ? point.date.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        }) : '';
        insights.push({
            id: 'dinheiro-insuficiente',
            type: 'danger',
            title: 'Dinheiro insuficiente',
            description: `Na projeção, o patrimônio atinge zero ou fica negativo${dateLabel ? ` em ${dateLabel}` : ''}. Ajuste renda, gastos ou eventos para evitar esse cenário.`
        });
    }
    if (settings.baseMonthlyExpenses > settings.baseMonthlyIncome) {
        insights.push({
            id: 'gastos-maior-renda',
            type: 'warning',
            title: 'Gastos superam a renda',
            description: 'Seus gastos mensais são maiores que a renda. Não há margem para investimentos; o patrimônio tende a cair. Considere reduzir gastos ou aumentar a renda.'
        });
    }
    if (monthly.length > 0 && monthlyContribution > 0) {
        const income = settings.baseMonthlyIncome;
        const pct = Math.round(monthlyContribution / income * 100);
        if (pct >= 10 && pct <= 50) {
            insights.push({
                id: 'margem-investimento',
                type: 'info',
                title: 'Margem para investir',
                description: `${pct}% da sua renda vai para investimentos (renda − gastos). Boa capacidade de acumulação.`
            });
        } else if (pct > 50) {
            insights.push({
                id: 'margem-alta',
                type: 'success',
                title: 'Alta capacidade de poupança',
                description: `${pct}% da sua renda vira aporte. Você pode antecipar metas ou aumentar o padrão de gastos com folga.`
            });
        }
    }
    const last = monthly[monthly.length - 1];
    if (last && firstMonthWithZeroOrNegativeNetWorth === null && last.netWorth > 0) {
        const yearsOfContributions = 10;
        const roughContributions = monthlyContribution * 12 * yearsOfContributions;
        if (last.netWorth > roughContributions * 2) {
            insights.push({
                id: 'sobra-no-fim',
                type: 'success',
                title: 'Sobra dinheiro ao final',
                description: `Ao final da projeção sobrariam ${formatBRL(last.netWorth)}. Você poderia aposentar mais cedo, aumentar gastos ao longo do tempo ou planejar herança/doações.`
            });
        }
    }
    const retirementAge = settings.retirementAge ?? 65;
    const retirementIncome = settings.retirementMonthlyIncome ?? 0;
    if (retirementIncome > 0 && settings.baseMonthlyExpenses > 0) {
        const coverage = Math.round(retirementIncome / settings.baseMonthlyExpenses * 100);
        if (coverage < 80) {
            insights.push({
                id: 'aposentadoria-cobertura',
                type: 'warning',
                title: 'Renda na aposentadoria',
                description: `Na aposentadoria (a partir dos ${retirementAge} anos), a renda projetada cobre cerca de ${coverage}% dos gastos atuais. O restante virá do patrimônio acumulado. Acompanhe se o valor acumulado é suficiente.`
            });
        } else if (coverage >= 100) {
            insights.push({
                id: 'aposentadoria-confortavel',
                type: 'info',
                title: 'Aposentadoria coberta',
                description: `Sua renda na aposentadoria cobre os gastos projetados (${coverage}% ou mais). O patrimônio pode servir como reserva ou para desejos extras.`
            });
        }
    }
    if (monthly.length > 12) {
        let maxReal = monthly[0].realNetWorth;
        for(let i = 1; i < monthly.length; i++){
            if (monthly[i].realNetWorth > maxReal) maxReal = monthly[i].realNetWorth;
        }
        if (last && last.realNetWorth < maxReal * 0.9) {
            insights.push({
                id: 'patrimonio-real-cai',
                type: 'warning',
                title: 'Poder de compra do patrimônio',
                description: 'Em parte da projeção, o patrimônio em termos reais (descontada a inflação) tende a cair. Isso pode ser esperado após aposentadoria; verifique se o ritmo de uso está adequado.'
            });
        }
    }
    if (settings.baseNetWorth <= 0 && monthlyContribution > 0 && firstMonthWithZeroOrNegativeNetWorth === null) {
        insights.push({
            id: 'comecando-do-zero',
            type: 'info',
            title: 'Começando a acumular',
            description: 'Você está partindo de patrimônio zero ou negativo. Com aportes regulares e retorno positivo, o patrimônio tende a crescer ao longo do tempo.'
        });
    }
    return insights;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LifeInsightsCard",
    ()=>LifeInsightsCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
const TYPE_STYLES = {
    danger: 'border-destructive/50 bg-destructive/10 text-destructive',
    warning: 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    info: 'border-primary/50 bg-primary/10 text-primary'
};
const TYPE_ICONS = {
    danger: '⚠',
    warning: '⚡',
    success: '✓',
    info: 'ℹ'
};
function LifeInsightsCard({ insights, className }) {
    if (insights.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('overflow-hidden', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                className: "pb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                        className: "text-base",
                        children: "Insights"
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                        children: "Análise automática da sua projeção: pontos de atenção e oportunidades."
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "space-y-3",
                children: insights.map((insight)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex gap-3 rounded-lg border px-3 py-2.5 text-sm', TYPE_STYLES[insight.type]),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "shrink-0 text-base",
                                "aria-hidden": true,
                                children: TYPE_ICONS[insight.type]
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium",
                                        children: insight.title
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx",
                                        lineNumber: 58,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-0.5 text-muted-foreground",
                                        children: insight.description
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this)
                        ]
                    }, insight.id, true, {
                        fileName: "[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = LifeInsightsCard;
var _c;
__turbopack_context__.k.register(_c, "LifeInsightsCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/contexts/currency-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CurrencyProvider",
    ()=>CurrencyProvider,
    "useCurrency",
    ()=>useCurrency,
    "useCurrencySetter",
    ()=>useCurrencySetter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const CurrencyContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function CurrencyProvider({ currency, setCurrency, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CurrencyContext.Provider, {
        value: {
            currency,
            setCurrency
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/contexts/currency-context.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_c = CurrencyProvider;
function useCurrency() {
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CurrencyContext);
    return ctx?.currency ?? 'BRL';
}
_s(useCurrency, "/dMy7t63NXD4eYACoT93CePwGrg=");
function useCurrencySetter() {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CurrencyContext)?.setCurrency;
}
_s1(useCurrencySetter, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "CurrencyProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LifeDashboard",
    ()=>LifeDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/life-defaults.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$onboarding$2f$components$2f$setup$2d$wizard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$life$2d$timeline$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$life$2d$projection$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$life$2d$event$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/timeline/components/life-event-form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$life$2d$events$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/timeline/components/life-events-list.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$core$2f$services$2f$projection$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/core/services/projection-engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$9e5488__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/foundation-life/src/app/actions/data:9e5488 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$5d41ba__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/foundation-life/src/app/actions/data:5d41ba [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$dbb143__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/foundation-life/src/app/actions/data:dbb143 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$b316b2__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/foundation-life/src/app/actions/data:b316b2 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$d0f4d7__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/foundation-life/src/app/actions/data:d0f4d7 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$19710a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/foundation-life/src/app/actions/data:19710a [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$micro$2d$plans$2f$components$2f$life$2d$micro$2d$plan$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$micro$2d$plans$2f$components$2f$life$2d$micro$2d$plans$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/micro-plans/components/life-micro-plans-list.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$collapsible$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/collapsible-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$chart$2d$range$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$dashboard$2f$components$2f$edit$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/dashboard/components/edit-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$insights$2f$utils$2f$life$2d$insights$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/insights/utils/life-insights.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$insights$2f$components$2f$life$2d$insights$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/modules/insights/components/life-insights-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$contexts$2f$currency$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/contexts/currency-context.tsx [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function LifeDashboard() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [authUserId, setAuthUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [scenarioId, setScenarioId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [setupSaving, setSetupSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [eventSaving, setEventSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasPlan, setHasPlan] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [birthDate, setBirthDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "LifeDashboard.useState": ()=>{
            const d = new Date();
            d.setFullYear(d.getFullYear() - 30);
            return d.toISOString().slice(0, 10) // YYYY-MM-DD
            ;
        }
    }["LifeDashboard.useState"]);
    const [lifeExpectancy, setLifeExpectancy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].lifeExpectancyYears);
    const [netWorth, setNetWorth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseNetWorth);
    const [income, setIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseMonthlyIncome);
    const [expenses, setExpenses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].baseMonthlyExpenses);
    const [returnYearly, setReturnYearly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].expectedReturnYearly);
    const [inflationYearly, setInflationYearly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].inflationYearly);
    const [inflateIncome, setInflateIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].inflateIncome);
    const [inflateExpenses, setInflateExpenses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].inflateExpenses);
    const [retirementAge, setRetirementAge] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].retirementAge);
    const [retirementMonthlyIncome, setRetirementMonthlyIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].retirementMonthlyIncome);
    const [inflateRetirementIncome, setInflateRetirementIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].inflateRetirementIncome);
    const [currency, setCurrency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('BRL');
    const [events, setEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showEventForm, setShowEventForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [microPlans, setMicroPlans] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showMicroPlanForm, setShowMicroPlanForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [microPlanSaving, setMicroPlanSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chartRange, setChartRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$chart$2d$range$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultChartRangeState"])());
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sectionOpen, setSectionOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        you: false,
        aposentadoria: false,
        microPlans: false,
        events: false,
        configuracoes: false
    });
    const sectionRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        you: null,
        aposentadoria: null,
        microPlans: null,
        events: null,
        configuracoes: null
    });
    const lastSavedPlanRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LifeDashboard.useEffect": ()=>{
            async function init() {
                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
                if (!data.user) {
                    router.replace('/login');
                    return;
                }
                setAuthUserId(data.user.id);
                const saved = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$9e5488__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getLifeData"])(data.user.id);
                if (saved) {
                    setHasPlan(true);
                    setBirthDate(saved.birthDate.slice(0, 10)); // YYYY-MM-DD para input date
                    setLifeExpectancy(saved.lifeExpectancyYears);
                    setNetWorth(saved.settings.baseNetWorth);
                    setIncome(saved.settings.baseMonthlyIncome);
                    setExpenses(saved.settings.baseMonthlyExpenses);
                    setReturnYearly(saved.settings.expectedReturnYearly);
                    setInflationYearly(saved.settings.inflationYearly);
                    setInflateIncome(saved.settings.inflateIncome ?? true);
                    setInflateExpenses(saved.settings.inflateExpenses ?? true);
                    setRetirementAge(saved.settings.retirementAge ?? 65);
                    setRetirementMonthlyIncome(saved.settings.retirementMonthlyIncome ?? 0);
                    setInflateRetirementIncome(saved.settings.inflateRetirementIncome ?? true);
                    setCurrency(saved.baseCurrency ?? 'BRL');
                    setScenarioId(saved.scenarioId);
                    setEvents(saved.events.map({
                        "LifeDashboard.useEffect.init": (e)=>({
                                id: e.id,
                                type: e.type,
                                title: e.title,
                                date: new Date(e.date),
                                endDate: e.endDate ? new Date(e.endDate) : undefined,
                                amount: e.amount,
                                frequency: e.frequency,
                                durationMonths: e.durationMonths,
                                inflationIndexed: e.inflationIndexed ?? true
                            })
                    }["LifeDashboard.useEffect.init"]));
                    setMicroPlans(saved.microPlans.map({
                        "LifeDashboard.useEffect.init": (m)=>({
                                id: m.id,
                                effectiveDate: m.effectiveDate,
                                monthlyIncome: m.monthlyIncome,
                                monthlyExpenses: m.monthlyExpenses,
                                monthlyContribution: m.monthlyContribution
                            })
                    }["LifeDashboard.useEffect.init"]));
                    lastSavedPlanRef.current = JSON.stringify({
                        birthDate: saved.birthDate.slice(0, 10),
                        lifeExpectancyYears: saved.lifeExpectancyYears,
                        baseNetWorth: saved.settings.baseNetWorth,
                        baseMonthlyIncome: saved.settings.baseMonthlyIncome,
                        baseMonthlyExpenses: saved.settings.baseMonthlyExpenses,
                        baseCurrency: saved.baseCurrency,
                        expectedReturnYearly: saved.settings.expectedReturnYearly,
                        inflationYearly: saved.settings.inflationYearly,
                        inflateIncome: saved.settings.inflateIncome ?? true,
                        inflateExpenses: saved.settings.inflateExpenses ?? true,
                        retirementAge: saved.settings.retirementAge ?? 65,
                        retirementMonthlyIncome: saved.settings.retirementMonthlyIncome ?? 0,
                        inflateRetirementIncome: saved.settings.inflateRetirementIncome ?? true
                    });
                }
                setLoading(false);
            }
            init();
        }
    }["LifeDashboard.useEffect"], [
        router
    ]);
    async function handleSetupComplete(payload) {
        if (!authUserId) return;
        setSetupSaving(true);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$5d41ba__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["saveLifeData"])(authUserId, payload);
            setScenarioId(result.scenarioId);
            setHasPlan(true);
            setBirthDate(payload.birthDate.slice(0, 10));
            setLifeExpectancy(payload.lifeExpectancyYears);
            setNetWorth(payload.baseNetWorth);
            setIncome(payload.baseMonthlyIncome);
            setExpenses(payload.baseMonthlyExpenses);
            setReturnYearly(payload.expectedReturnYearly);
            setInflationYearly(payload.inflationYearly);
            setInflateIncome(payload.inflateIncome ?? true);
            setInflateExpenses(payload.inflateExpenses ?? true);
            setRetirementAge(payload.retirementAge ?? 65);
            setRetirementMonthlyIncome(payload.retirementMonthlyIncome ?? 0);
            setInflateRetirementIncome(payload.inflateRetirementIncome ?? true);
            lastSavedPlanRef.current = JSON.stringify({
                birthDate: payload.birthDate.slice(0, 10),
                lifeExpectancyYears: payload.lifeExpectancyYears,
                baseNetWorth: payload.baseNetWorth,
                baseMonthlyIncome: payload.baseMonthlyIncome,
                baseMonthlyExpenses: payload.baseMonthlyExpenses,
                expectedReturnYearly: payload.expectedReturnYearly,
                inflationYearly: payload.inflationYearly,
                inflateIncome: payload.inflateIncome ?? true,
                inflateExpenses: payload.inflateExpenses ?? true,
                retirementAge: payload.retirementAge ?? 65,
                retirementMonthlyIncome: payload.retirementMonthlyIncome ?? 0,
                inflateRetirementIncome: payload.inflateRetirementIncome ?? true
            });
        } finally{
            setSetupSaving(false);
        }
    }
    const birthDateAsDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LifeDashboard.useMemo[birthDateAsDate]": ()=>new Date(birthDate + 'T12:00:00')
    }["LifeDashboard.useMemo[birthDateAsDate]"], [
        birthDate
    ]);
    const microPlansForEngine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LifeDashboard.useMemo[microPlansForEngine]": ()=>microPlans.map({
                "LifeDashboard.useMemo[microPlansForEngine]": (m)=>({
                        id: m.id,
                        effectiveDate: new Date(m.effectiveDate + 'T12:00:00'),
                        monthlyIncome: m.monthlyIncome,
                        monthlyExpenses: m.monthlyExpenses,
                        monthlyContribution: m.monthlyContribution
                    })
            }["LifeDashboard.useMemo[microPlansForEngine]"])
    }["LifeDashboard.useMemo[microPlansForEngine]"], [
        microPlans
    ]);
    const projection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LifeDashboard.useMemo[projection]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$core$2f$services$2f$projection$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildLifeProjection"])({
                profile: {
                    birthDate: birthDateAsDate,
                    lifeExpectancyYears: lifeExpectancy
                },
                settings: {
                    baseNetWorth: netWorth,
                    baseMonthlyIncome: income,
                    baseMonthlyExpenses: expenses,
                    monthlyContribution: Math.max(0, income - expenses),
                    expectedReturnYearly: returnYearly,
                    inflationYearly,
                    inflateIncome,
                    inflateExpenses,
                    retirementAge,
                    retirementMonthlyIncome,
                    inflateRetirementIncome
                },
                events,
                microPlans: microPlansForEngine
            })
    }["LifeDashboard.useMemo[projection]"], [
        birthDateAsDate,
        lifeExpectancy,
        netWorth,
        income,
        expenses,
        returnYearly,
        inflationYearly,
        inflateIncome,
        inflateExpenses,
        retirementAge,
        retirementMonthlyIncome,
        inflateRetirementIncome,
        events,
        microPlansForEngine
    ]);
    const chartRangeKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LifeDashboard.useMemo[chartRangeKeys]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$chart$2d$range$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getChartRange"])(chartRange)
    }["LifeDashboard.useMemo[chartRangeKeys]"], [
        chartRange
    ]);
    const filteredMonthly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LifeDashboard.useMemo[filteredMonthly]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$chart$2d$range$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterMonthlyByRange"])(projection.monthly, chartRangeKeys)
    }["LifeDashboard.useMemo[filteredMonthly]"], [
        projection.monthly,
        chartRangeKeys
    ]);
    const filteredYearly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LifeDashboard.useMemo[filteredYearly]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$chart$2d$range$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["filterYearlyByRange"])(projection.yearly, chartRangeKeys)
    }["LifeDashboard.useMemo[filteredYearly]"], [
        projection.yearly,
        chartRangeKeys
    ]);
    const insights = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LifeDashboard.useMemo[insights]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$insights$2f$utils$2f$life$2d$insights$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLifeInsights"])(projection, {
                birthDate: birthDateAsDate,
                lifeExpectancyYears: lifeExpectancy
            }, {
                baseNetWorth: netWorth,
                baseMonthlyIncome: income,
                baseMonthlyExpenses: expenses,
                monthlyContribution: Math.max(0, income - expenses),
                expectedReturnYearly: returnYearly,
                inflationYearly,
                inflateIncome,
                inflateExpenses,
                retirementAge,
                retirementMonthlyIncome,
                inflateRetirementIncome
            })
    }["LifeDashboard.useMemo[insights]"], [
        projection,
        birthDateAsDate,
        lifeExpectancy,
        netWorth,
        income,
        expenses,
        returnYearly,
        inflationYearly,
        inflateIncome,
        inflateExpenses,
        retirementAge,
        retirementMonthlyIncome,
        inflateRetirementIncome
    ]);
    const derivedContribution = Math.max(0, income - expenses);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LifeDashboard.useEffect": ()=>{
            if (!authUserId || !hasPlan) return;
            const payload = {
                birthDate,
                lifeExpectancyYears: lifeExpectancy,
                baseNetWorth: netWorth,
                baseMonthlyIncome: income,
                baseMonthlyExpenses: expenses,
                baseCurrency: currency,
                expectedReturnYearly: returnYearly,
                inflationYearly,
                inflateIncome,
                inflateExpenses,
                retirementAge,
                retirementMonthlyIncome,
                inflateRetirementIncome
            };
            const payloadKey = JSON.stringify(payload);
            if (payloadKey === lastSavedPlanRef.current) return;
            const t = setTimeout({
                "LifeDashboard.useEffect.t": async ()=>{
                    setSaving(true);
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$5d41ba__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["saveLifeData"])(authUserId, {
                            birthDate: new Date(birthDate + 'T12:00:00').toISOString(),
                            lifeExpectancyYears: lifeExpectancy,
                            baseNetWorth: netWorth,
                            baseMonthlyIncome: income,
                            baseMonthlyExpenses: expenses,
                            monthlyContribution: derivedContribution,
                            expectedReturnYearly: returnYearly,
                            inflationYearly,
                            inflateIncome,
                            inflateExpenses,
                            retirementAge,
                            retirementMonthlyIncome,
                            inflateRetirementIncome,
                            baseCurrency: currency
                        });
                        setScenarioId(result.scenarioId);
                        lastSavedPlanRef.current = payloadKey;
                    } finally{
                        setSaving(false);
                    }
                }
            }["LifeDashboard.useEffect.t"], 1500);
            return ({
                "LifeDashboard.useEffect": ()=>clearTimeout(t)
            })["LifeDashboard.useEffect"];
        }
    }["LifeDashboard.useEffect"], [
        authUserId,
        hasPlan,
        birthDate,
        lifeExpectancy,
        netWorth,
        income,
        expenses,
        currency,
        returnYearly,
        inflationYearly,
        inflateIncome,
        inflateExpenses,
        retirementAge,
        retirementMonthlyIncome,
        inflateRetirementIncome
    ]);
    async function handleSavePlan() {
        if (!authUserId) return;
        setSaving(true);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$5d41ba__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["saveLifeData"])(authUserId, {
                birthDate: new Date(birthDate + 'T12:00:00').toISOString(),
                lifeExpectancyYears: lifeExpectancy,
                baseNetWorth: netWorth,
                baseMonthlyIncome: income,
                baseMonthlyExpenses: expenses,
                monthlyContribution: derivedContribution,
                expectedReturnYearly: returnYearly,
                inflationYearly,
                inflateIncome,
                inflateExpenses,
                retirementAge,
                retirementMonthlyIncome,
                inflateRetirementIncome,
                baseCurrency: currency
            });
            setScenarioId(result.scenarioId);
        } finally{
            setSaving(false);
        }
    }
    async function handleAddEvent(payload) {
        if (!authUserId) return;
        let sid = scenarioId;
        if (!sid) {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$5d41ba__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["saveLifeData"])(authUserId, {
                birthDate: new Date(birthDate + 'T12:00:00').toISOString(),
                lifeExpectancyYears: lifeExpectancy,
                baseNetWorth: netWorth,
                baseMonthlyIncome: income,
                baseMonthlyExpenses: expenses,
                monthlyContribution: derivedContribution,
                expectedReturnYearly: returnYearly,
                inflationYearly,
                inflateIncome,
                inflateExpenses,
                retirementAge,
                retirementMonthlyIncome,
                inflateRetirementIncome,
                baseCurrency: currency
            });
            sid = result.scenarioId;
            setScenarioId(sid);
        }
        setEventSaving(true);
        try {
            const { id } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$dbb143__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["saveLifeEvent"])(authUserId, sid, payload);
            setEvents((prev)=>[
                    ...prev,
                    {
                        id,
                        type: payload.type,
                        title: payload.title,
                        date: new Date(payload.date),
                        endDate: payload.endDate ? new Date(payload.endDate) : undefined,
                        amount: payload.amount,
                        frequency: payload.frequency,
                        durationMonths: payload.durationMonths,
                        inflationIndexed: payload.inflationIndexed
                    }
                ]);
            setShowEventForm(false);
        } finally{
            setEventSaving(false);
        }
    }
    async function handleDeleteEvent(id) {
        if (!authUserId) return;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$b316b2__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteLifeEvent"])(authUserId, id);
        setEvents((prev)=>prev.filter((e)=>e.id !== id));
    }
    async function handleAddMicroPlan(payload) {
        if (!authUserId || !scenarioId) return;
        setMicroPlanSaving(true);
        try {
            const { id } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$d0f4d7__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["saveLifeMicroPlan"])(authUserId, scenarioId, payload);
            setMicroPlans((prev)=>[
                    ...prev,
                    {
                        id,
                        effectiveDate: payload.effectiveDate,
                        monthlyIncome: payload.monthlyIncome,
                        monthlyExpenses: payload.monthlyExpenses,
                        monthlyContribution: payload.monthlyContribution
                    }
                ]);
            setShowMicroPlanForm(false);
        } finally{
            setMicroPlanSaving(false);
        }
    }
    async function handleDeleteMicroPlan(id) {
        if (!authUserId) return;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$app$2f$actions$2f$data$3a$19710a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteLifeMicroPlan"])(authUserId, id);
        setMicroPlans((prev)=>prev.filter((m)=>m.id !== id));
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-background text-muted-foreground",
            children: "Carregando seu planejamento..."
        }, void 0, false, {
            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
            lineNumber: 497,
            columnNumber: 7
        }, this);
    }
    if (!hasPlan) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 pt-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-semibold text-foreground",
                            children: "Seu plano de vida"
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                            lineNumber: 507,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-muted-foreground",
                            children: "Responda algumas perguntas para criarmos seu cenário inicial."
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                            lineNumber: 510,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                    lineNumber: 506,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$onboarding$2f$components$2f$setup$2d$wizard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SetupWizard"], {
                    onComplete: handleSetupComplete,
                    isLoading: setupSaving
                }, void 0, false, {
                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                    lineNumber: 514,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
            lineNumber: 505,
            columnNumber: 7
        }, this);
    }
    function focusSection(key) {
        setSectionOpen((prev)=>({
                ...prev,
                [key]: true
            }));
        setSidebarOpen(false);
        setTimeout(()=>sectionRefs.current[key]?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            }), 100);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$dashboard$2f$components$2f$edit$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditSidebar"], {
                onSelect: focusSection,
                isOverlay: true,
                onCloseOverlay: ()=>setSidebarOpen(false)
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                lineNumber: 531,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-6 px-4 py-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden shrink-0 md:block",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "sticky top-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$dashboard$2f$components$2f$edit$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditSidebar"], {
                                onSelect: focusSection
                            }, void 0, false, {
                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                lineNumber: 540,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                            lineNumber: 539,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                        lineNumber: 538,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$contexts$2f$currency$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CurrencyProvider"], {
                        currency: currency,
                        setCurrency: setCurrency,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto flex max-w-5xl flex-col gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                        className: "flex flex-wrap items-center justify-between gap-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "outline",
                                                    size: "icon",
                                                    className: "shrink-0 md:hidden",
                                                    onClick: ()=>setSidebarOpen((o)=>!o),
                                                    "aria-label": "Abrir menu de edição",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm",
                                                        children: sidebarOpen ? '✕' : '☰'
                                                    }, void 0, false, {
                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                        lineNumber: 555,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 548,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                            className: "text-2xl font-semibold tracking-tight text-foreground",
                                                            children: "Seu plano de vida"
                                                        }, void 0, false, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 558,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 text-sm text-muted-foreground",
                                                            children: "Projeção patrimonial. Use a sidebar para editar dados."
                                                        }, void 0, false, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 561,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                            lineNumber: 547,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                        lineNumber: 546,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                className: "pb-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap items-center justify-between gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                                    className: "text-base",
                                                                    children: "Projeção patrimonial"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 573,
                                                                    columnNumber: 17
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                                    children: "Evolução ao longo do tempo — use os filtros para alterar o período"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 574,
                                                                    columnNumber: 17
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 572,
                                                            columnNumber: 15
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$chart$2d$range$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChartRangeFilter"], {
                                                            value: chartRange,
                                                            onChange: setChartRange
                                                        }, void 0, false, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 576,
                                                            columnNumber: 15
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 571,
                                                    columnNumber: 13
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                lineNumber: 570,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$life$2d$timeline$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LifeTimelineChart"], {
                                                    data: filteredMonthly
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 13
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                lineNumber: 579,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                        lineNumber: 569,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$insights$2f$components$2f$life$2d$insights$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LifeInsightsCard"], {
                                        insights: insights
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                        lineNumber: 584,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                        className: "text-base",
                                                        children: "Tabela anual"
                                                    }, void 0, false, {
                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                        lineNumber: 588,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                        children: "Resumo no período selecionado"
                                                    }, void 0, false, {
                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                        lineNumber: 589,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                lineNumber: 587,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$life$2d$projection$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LifeProjectionTable"], {
                                                    yearlyData: filteredYearly,
                                                    monthlyData: projection.monthly
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 592,
                                                    columnNumber: 13
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                lineNumber: 591,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                        lineNumber: 586,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: (el)=>{
                                            sectionRefs.current.you = el;
                                        },
                                        className: "scroll-mt-24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$collapsible$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleCard"], {
                                            title: "Você hoje",
                                            description: "Dados atuais para a projeção — salvamento automático após pausa na edição",
                                            open: sectionOpen.you,
                                            onOpenChange: (o)=>setSectionOpen((prev)=>({
                                                        ...prev,
                                                        you: o
                                                    })),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "birthDate",
                                                                    className: "text-muted-foreground",
                                                                    children: "Data de nascimento"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 609,
                                                                    columnNumber: 15
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    id: "birthDate",
                                                                    type: "date",
                                                                    value: birthDate,
                                                                    onChange: (e)=>setBirthDate(e.target.value)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 610,
                                                                    columnNumber: 15
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 608,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "lifeExp",
                                                                    className: "text-muted-foreground",
                                                                    children: "Expectativa de vida"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 618,
                                                                    columnNumber: 15
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    id: "lifeExp",
                                                                    type: "number",
                                                                    min: 60,
                                                                    max: 110,
                                                                    value: lifeExpectancy,
                                                                    onChange: (e)=>setLifeExpectancy(Number(e.target.value) || 0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 619,
                                                                    columnNumber: 15
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 617,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "netWorth",
                                                                    className: "text-muted-foreground",
                                                                    children: "Patrimônio atual (R$)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 629,
                                                                    columnNumber: 15
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    id: "netWorth",
                                                                    type: "number",
                                                                    value: netWorth,
                                                                    onChange: (e)=>setNetWorth(Number(e.target.value) || 0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 630,
                                                                    columnNumber: 15
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 628,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "income",
                                                                    className: "text-muted-foreground",
                                                                    children: "Renda mensal (R$)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 638,
                                                                    columnNumber: 15
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    id: "income",
                                                                    type: "number",
                                                                    value: income,
                                                                    onChange: (e)=>setIncome(Number(e.target.value) || 0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 639,
                                                                    columnNumber: 15
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 637,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "expenses",
                                                                    className: "text-muted-foreground",
                                                                    children: "Gastos mensais (R$)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 647,
                                                                    columnNumber: 15
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    id: "expenses",
                                                                    type: "number",
                                                                    value: expenses,
                                                                    onChange: (e)=>setExpenses(Number(e.target.value) || 0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 648,
                                                                    columnNumber: 15
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 646,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 607,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-2 text-xs text-muted-foreground",
                                                    children: "O aporte é calculado automaticamente como renda − gastos."
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 656,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                            lineNumber: 601,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                        lineNumber: 600,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: (el)=>{
                                            sectionRefs.current.aposentadoria = el;
                                        },
                                        className: "scroll-mt-24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$collapsible$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleCard"], {
                                            title: "Aposentadoria",
                                            description: "Idade e renda a partir da aposentadoria — salvamento automático após pausa na edição",
                                            open: sectionOpen.aposentadoria,
                                            onOpenChange: (o)=>setSectionOpen((prev)=>({
                                                        ...prev,
                                                        aposentadoria: o
                                                    })),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "retirementAge",
                                                                    children: "Idade de aposentadoria"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 671,
                                                                    columnNumber: 15
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    id: "retirementAge",
                                                                    type: "number",
                                                                    min: 40,
                                                                    max: 90,
                                                                    value: retirementAge,
                                                                    onChange: (e)=>setRetirementAge(Number(e.target.value) || 65)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 672,
                                                                    columnNumber: 15
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 670,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                    htmlFor: "retirementMonthlyIncome",
                                                                    children: "Renda mensal (R$)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 682,
                                                                    columnNumber: 15
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                    id: "retirementMonthlyIncome",
                                                                    type: "number",
                                                                    min: 0,
                                                                    value: retirementMonthlyIncome,
                                                                    onChange: (e)=>setRetirementMonthlyIncome(Number(e.target.value) || 0),
                                                                    placeholder: "Ex: 8000"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                    lineNumber: 683,
                                                                    columnNumber: 15
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 681,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 669,
                                                    columnNumber: 11
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "mt-3 flex items-center gap-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: inflateRetirementIncome,
                                                            onChange: (e)=>setInflateRetirementIncome(e.target.checked),
                                                            className: "h-4 w-4 rounded border-input"
                                                        }, void 0, false, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 694,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Inflacionar renda de aposentadoria"
                                                        }, void 0, false, {
                                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                            lineNumber: 700,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 693,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                            lineNumber: 663,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                        lineNumber: 662,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: (el)=>{
                                            sectionRefs.current.microPlans = el;
                                        },
                                        className: "scroll-mt-24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$collapsible$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleCard"], {
                                            title: "Micro planos",
                                            description: "A partir de uma data: outra renda, gastos e aporte",
                                            open: sectionOpen.microPlans,
                                            onOpenChange: (o)=>setSectionOpen((prev)=>({
                                                        ...prev,
                                                        microPlans: o
                                                    })),
                                            headerAction: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                size: "sm",
                                                onClick: ()=>setShowMicroPlanForm((p)=>!p),
                                                disabled: !scenarioId,
                                                children: showMicroPlanForm ? 'Ocultar' : '+ Adicionar'
                                            }, void 0, false, {
                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                lineNumber: 712,
                                                columnNumber: 13
                                            }, void 0),
                                            children: [
                                                showMicroPlanForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$micro$2d$plans$2f$components$2f$life$2d$micro$2d$plan$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LifeMicroPlanForm"], {
                                                        onSubmit: handleAddMicroPlan,
                                                        onCancel: ()=>setShowMicroPlanForm(false)
                                                    }, void 0, false, {
                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                        lineNumber: 724,
                                                        columnNumber: 15
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 723,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$micro$2d$plans$2f$components$2f$life$2d$micro$2d$plans$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LifeMicroPlansList"], {
                                                    microPlans: microPlans,
                                                    onDelete: handleDeleteMicroPlan
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 730,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                            lineNumber: 706,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                        lineNumber: 705,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: (el)=>{
                                            sectionRefs.current.events = el;
                                        },
                                        className: "scroll-mt-24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$collapsible$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleCard"], {
                                            title: "Eventos de vida",
                                            description: "Mudanças de renda, gastos e marcos",
                                            open: sectionOpen.events,
                                            onOpenChange: (o)=>setSectionOpen((prev)=>({
                                                        ...prev,
                                                        events: o
                                                    })),
                                            headerAction: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                size: "sm",
                                                onClick: ()=>setShowEventForm((p)=>!p),
                                                children: showEventForm ? 'Ocultar' : '+ Adicionar evento'
                                            }, void 0, false, {
                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                lineNumber: 741,
                                                columnNumber: 13
                                            }, void 0),
                                            children: [
                                                showEventForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$life$2d$event$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LifeEventForm"], {
                                                        onSubmit: handleAddEvent,
                                                        onCancel: ()=>setShowEventForm(false)
                                                    }, void 0, false, {
                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                        lineNumber: 752,
                                                        columnNumber: 15
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 751,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$modules$2f$timeline$2f$components$2f$life$2d$events$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LifeEventsList"], {
                                                    events: events,
                                                    onDelete: handleDeleteEvent
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                    lineNumber: 758,
                                                    columnNumber: 11
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                            lineNumber: 735,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                        lineNumber: 734,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: (el)=>{
                                            sectionRefs.current.configuracoes = el;
                                        },
                                        className: "scroll-mt-24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$collapsible$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CollapsibleCard"], {
                                            title: "Configurações",
                                            description: "Retorno, inflação e indexação — salvamento automático após pausa na edição",
                                            open: sectionOpen.configuracoes,
                                            onOpenChange: (o)=>setSectionOpen((prev)=>({
                                                        ...prev,
                                                        configuracoes: o
                                                    })),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mb-2 text-sm font-medium text-muted-foreground",
                                                                children: "Retorno e inflação"
                                                            }, void 0, false, {
                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                lineNumber: 771,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid grid-cols-2 gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                                htmlFor: "returnYearly",
                                                                                children: "Retorno anual (%)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                                lineNumber: 774,
                                                                                columnNumber: 19
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                                id: "returnYearly",
                                                                                type: "number",
                                                                                value: returnYearly,
                                                                                onChange: (e)=>setReturnYearly(Number(e.target.value) || 0)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                                lineNumber: 775,
                                                                                columnNumber: 19
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                        lineNumber: 773,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                                htmlFor: "inflationYearly",
                                                                                children: "Inflação anual (%)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                                lineNumber: 783,
                                                                                columnNumber: 19
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                                                id: "inflationYearly",
                                                                                type: "number",
                                                                                value: inflationYearly,
                                                                                onChange: (e)=>setInflationYearly(Number(e.target.value) || 0)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                                lineNumber: 784,
                                                                                columnNumber: 19
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                        lineNumber: 782,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                lineNumber: 772,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                        lineNumber: 770,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-lg border border-border/50 bg-muted/20 p-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mb-2 text-sm font-medium text-muted-foreground",
                                                                children: "Indexação"
                                                            }, void 0, false, {
                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                lineNumber: 794,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "flex items-center gap-2 text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: inflateIncome,
                                                                                onChange: (e)=>setInflateIncome(e.target.checked),
                                                                                className: "h-4 w-4 rounded border-input"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                                lineNumber: 797,
                                                                                columnNumber: 19
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: "Inflacionar renda"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                                lineNumber: 803,
                                                                                columnNumber: 19
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                        lineNumber: 796,
                                                                        columnNumber: 17
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "flex items-center gap-2 text-sm",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: inflateExpenses,
                                                                                onChange: (e)=>setInflateExpenses(e.target.checked),
                                                                                className: "h-4 w-4 rounded border-input"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                                lineNumber: 806,
                                                                                columnNumber: 19
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: "Inflacionar gastos"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                                lineNumber: 812,
                                                                                columnNumber: 19
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                        lineNumber: 805,
                                                                        columnNumber: 17
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                                lineNumber: 795,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                        lineNumber: 793,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                                lineNumber: 769,
                                                columnNumber: 11
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                            lineNumber: 763,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                        lineNumber: 762,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                                lineNumber: 545,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                            lineNumber: 544,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                        lineNumber: 543,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
                lineNumber: 537,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx",
        lineNumber: 529,
        columnNumber: 5
    }, this);
}
_s(LifeDashboard, "+e6dEp9M3rkEZ+6G6dzlp19nvOI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LifeDashboard;
var _c;
__turbopack_context__.k.register(_c, "LifeDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=foundation-life_src_c07c498f._.js.map