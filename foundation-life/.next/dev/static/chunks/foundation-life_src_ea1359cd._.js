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
    },
    {
        key: 'monthlyContribution',
        label: 'Quanto você consegue investir por mês? (R$)',
        placeholder: 'Ex: 1500',
        min: 0,
        step: 100,
        toValue: (v)=>v,
        fromPayload: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].monthlyContribution
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
                monthlyContribution: values.monthlyContribution ?? __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$life$2d$defaults$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIFE_PLAN_DEFAULTS"].monthlyContribution,
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
                                lineNumber: 134,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                            lineNumber: 133,
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
                                lineNumber: 137,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                    lineNumber: 132,
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
                                    lineNumber: 145,
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
                                    lineNumber: 149,
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
                                    lineNumber: 159,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                            lineNumber: 144,
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
                                    lineNumber: 177,
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
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                            lineNumber: 175,
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
                            lineNumber: 196,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
            lineNumber: 131,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/modules/onboarding/components/setup-wizard.tsx",
        lineNumber: 130,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/cartesian/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/chart/LineChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
'use client';
;
;
function LifeTimelineChart({ data }) {
    const yearlyPoints = data.filter((point)=>point.date.getMonth() === 0);
    const chartData = yearlyPoints.map((point)=>({
            year: point.date.getFullYear(),
            netWorth: Math.round(point.netWorth),
            realNetWorth: Math.round(point.realNetWorth)
        }));
    if (chartData.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-64 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground",
            children: "Nenhum dado no período selecionado. Altere o filtro ou configure seus dados."
        }, void 0, false, {
            fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
            lineNumber: 29,
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
                        lineNumber: 39,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                        dataKey: "year",
                        className: "text-muted-foreground",
                        tickLine: false
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                        lineNumber: 40,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                        className: "text-muted-foreground",
                        tickLine: false
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                        contentStyle: {
                            backgroundColor: 'hsl(var(--card))',
                            borderRadius: 8,
                            border: '1px solid hsl(var(--border))',
                            fontSize: 12
                        }
                    }, void 0, false, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                        lineNumber: 49,
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
                        lineNumber: 57,
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
                        lineNumber: 65,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/foundation-life/src/modules/timeline/components/life-timeline-chart.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/foundation-life/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
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
function LifeProjectionTable({ yearlyData, fullYearlyData, monthlyData }) {
    _s();
    const [showFullRange, setShowFullRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [expandedYear, setExpandedYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const displayYearly = showFullRange ? fullYearlyData : yearlyData;
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
    if (!displayYearly.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg border border-border bg-muted/20 py-8 text-center text-sm text-muted-foreground",
            children: "Nenhum dado no período. Altere o filtro ou use “Ver período completo”."
        }, void 0, false, {
            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: ()=>setShowFullRange((s)=>!s),
                    children: showFullRange ? 'Voltar ao período do filtro' : 'Ver período completo (hoje até expectativa de vida)'
                }, void 0, false, {
                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                        children: "Ano"
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                        lineNumber: 68,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                        children: "Idade"
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                        children: "Renda anual"
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                        children: "Gastos anuais"
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                        lineNumber: 77,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                        children: "Aportes"
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground",
                                        children: "Patrimônio final"
                                    }, void 0, false, {
                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "divide-y divide-border",
                            children: displayYearly.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
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
                                                    lineNumber: 98,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-2 text-foreground",
                                                    children: row.year
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-2 text-right text-muted-foreground",
                                                    children: row.age
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-2 text-right text-muted-foreground",
                                                    children: formatBRL(row.income)
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-2 text-right text-muted-foreground",
                                                    children: formatBRL(row.expenses)
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-2 text-right text-muted-foreground",
                                                    children: formatBRL(row.contribution)
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-2 text-right font-medium text-foreground",
                                                    children: formatBRL(row.netWorth)
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                            lineNumber: 91,
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
                                                        lineNumber: 121,
                                                        columnNumber: 25
                                                    }, this)
                                                }, `${row.year}-empty`, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                    lineNumber: 120,
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
                                                                            lineNumber: 133,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "px-4 py-1.5 text-right",
                                                                            children: "Idade"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                            lineNumber: 134,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "px-4 py-1.5 text-right",
                                                                            children: "Renda"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                            lineNumber: 135,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "px-4 py-1.5 text-right",
                                                                            children: "Gastos"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                            lineNumber: 136,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "px-4 py-1.5 text-right",
                                                                            children: "Aporte"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                            lineNumber: 137,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "px-4 py-1.5 text-right",
                                                                            children: "Patrimônio"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                            lineNumber: 138,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                    lineNumber: 132,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                lineNumber: 131,
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
                                                                                lineNumber: 144,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-4 py-1.5 text-right text-muted-foreground",
                                                                                children: m.age
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                                lineNumber: 147,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-4 py-1.5 text-right text-muted-foreground",
                                                                                children: formatBRL(m.income)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                                lineNumber: 148,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-4 py-1.5 text-right text-muted-foreground",
                                                                                children: formatBRL(m.expenses)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                                lineNumber: 151,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-4 py-1.5 text-right text-muted-foreground",
                                                                                children: formatBRL(m.contribution)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                                lineNumber: 154,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "px-4 py-1.5 text-right font-medium text-foreground",
                                                                                children: formatBRL(m.netWorth)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                                lineNumber: 157,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, i, true, {
                                                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                        lineNumber: 143,
                                                                        columnNumber: 31
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                                lineNumber: 141,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                    lineNumber: 129,
                                                    columnNumber: 23
                                                }, this)
                                            }, `${row.year}-monthly`, false, {
                                                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                                lineNumber: 128,
                                                columnNumber: 21
                                            }, this);
                                        })()
                                    ]
                                }, row.year, true, {
                                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/timeline/components/life-projection-table.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(LifeProjectionTable, "A7Eh/oDmUX2FTMBeNWQCmzuUh40=");
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
        const baseContributionForMonth = activeMicro ? activeMicro.monthlyContribution : settings.monthlyContribution;
        const inflateIncomeForMonth = age < retirementAge ? inflateIncome : inflateRetirementIncome;
        const nominalBaseIncome = inflateIncomeForMonth ? baseIncomeForMonth * accumulatedInflation : baseIncomeForMonth;
        const nominalBaseExpenses = inflateExpenses ? baseExpensesForMonth * accumulatedInflation : baseExpensesForMonth;
        const impact = applyEventsForMonth(nominalBaseIncome, nominalBaseExpenses, currentDate, events);
        const monthIncome = impact.income + impact.extraIncome;
        const monthExpenses = impact.expenses + impact.extraExpenses;
        const availableForInvestments = Math.max(0, monthIncome - monthExpenses);
        const contribution = Math.min(baseContributionForMonth, availableForInvestments);
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
                income: point.income * 12,
                expenses: point.expenses * 12,
                contribution: point.contribution * 12,
                returns: point.returns * 12
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
"[project]/foundation-life/src/app/actions/data:c69fe9 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
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
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFQYXlsb2FkIHtcbiAgYmlydGhEYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBiYXNlTmV0V29ydGg6IG51bWJlclxuICBiYXNlTW9udGhseUluY29tZTogbnVtYmVyXG4gIGJhc2VNb250aGx5RXhwZW5zZXM6IG51bWJlclxuICBtb250aGx5Q29udHJpYnV0aW9uOiBudW1iZXJcbiAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IG51bWJlclxuICBpbmZsYXRpb25ZZWFybHk6IG51bWJlclxuICBpbmZsYXRlSW5jb21lOiBib29sZWFuXG4gIGluZmxhdGVFeHBlbnNlczogYm9vbGVhblxuICByZXRpcmVtZW50QWdlOiBudW1iZXJcbiAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IG51bWJlclxuICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVFdmVudFBheWxvYWQge1xuICBpZD86IHN0cmluZ1xuICB0eXBlOiBMaWZlRXZlbnRUeXBlXG4gIHRpdGxlOiBzdHJpbmdcbiAgZGF0ZTogc3RyaW5nIC8vIElTT1xuICBlbmREYXRlPzogc3RyaW5nXG4gIGFtb3VudDogbnVtYmVyXG4gIGZyZXF1ZW5jeTogJ29uY2UnIHwgJ21vbnRobHknIHwgJ3llYXJseSdcbiAgZHVyYXRpb25Nb250aHM/OiBudW1iZXJcbiAgaW5mbGF0aW9uSW5kZXhlZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWZlTWljcm9QbGFuUGF5bG9hZCB7XG4gIGVmZmVjdGl2ZURhdGU6IHN0cmluZyAvLyBJU08gZGF0ZSAoWVlZWS1NTS1ERCBvciBmdWxsIElTTylcbiAgbW9udGhseUluY29tZTogbnVtYmVyXG4gIG1vbnRobHlFeHBlbnNlczogbnVtYmVyXG4gIG1vbnRobHlDb250cmlidXRpb246IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUmVzdWx0IHtcbiAgcHJvZmlsZUlkOiBzdHJpbmdcbiAgc2NlbmFyaW9JZDogc3RyaW5nXG4gIGJpcnRoRGF0ZTogc3RyaW5nXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBzZXR0aW5nczogTGlmZURhdGFQYXlsb2FkXG4gIGV2ZW50czogTGlmZUV2ZW50UGF5bG9hZFtdXG4gIG1pY3JvUGxhbnM6IChMaWZlTWljcm9QbGFuUGF5bG9hZCAmIHsgaWQ6IHN0cmluZyB9KVtdXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMaWZlRGF0YShhdXRoVXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPExpZmVEYXRhUmVzdWx0IHwgbnVsbD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGlmICghcHJvZmlsZT8uYmlydGhEYXRlKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCwgaXNEZWZhdWx0OiB0cnVlIH0sXG4gICAgaW5jbHVkZToge1xuICAgICAgc2V0dGluZ3M6IHRydWUsXG4gICAgICBldmVudHM6IHsgb3JkZXJCeTogeyBkYXRlOiAnYXNjJyB9IH0sXG4gICAgfSxcbiAgfSlcblxuICBpZiAoIXNjZW5hcmlvPy5zZXR0aW5ncykgcmV0dXJuIG51bGxcblxuICBjb25zdCBtaWNyb1BsYW5zID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZE1hbnkoe1xuICAgIHdoZXJlOiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH0sXG4gICAgb3JkZXJCeTogeyBlZmZlY3RpdmVEYXRlOiAnYXNjJyB9LFxuICB9KVxuXG4gIGNvbnN0IHNldHRpbmdzID0gc2NlbmFyaW8uc2V0dGluZ3NcbiAgY29uc3QgYmlydGhEYXRlID0gcHJvZmlsZS5iaXJ0aERhdGVcblxuICByZXR1cm4ge1xuICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCxcbiAgICBiaXJ0aERhdGU6IGJpcnRoRGF0ZS50b0lTT1N0cmluZygpLFxuICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICBzZXR0aW5nczoge1xuICAgICAgYmlydGhEYXRlOiBiaXJ0aERhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICAgIGJhc2VOZXRXb3J0aDogc2V0dGluZ3MuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHNldHRpbmdzLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogc2V0dGluZ3MuYmFzZU1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHNldHRpbmdzLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogc2V0dGluZ3MuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHNldHRpbmdzLmluZmxhdGlvblllYXJseSxcbiAgICAgIGluZmxhdGVJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogc2V0dGluZ3MuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBzZXR0aW5ncy5yZXRpcmVtZW50QWdlID8/IDY1LFxuICAgICAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IHNldHRpbmdzLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogc2V0dGluZ3MuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIGV2ZW50czogc2NlbmFyaW8uZXZlbnRzLm1hcChlID0+ICh7XG4gICAgICBpZDogZS5pZCxcbiAgICAgIHR5cGU6IGUudHlwZSBhcyBMaWZlRXZlbnRUeXBlLFxuICAgICAgdGl0bGU6IGUudGl0bGUsXG4gICAgICBkYXRlOiBlLmRhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZERhdGU6IGUuZW5kRGF0ZT8udG9JU09TdHJpbmcoKSxcbiAgICAgIGFtb3VudDogZS5hbW91bnQsXG4gICAgICBmcmVxdWVuY3k6IGUuZnJlcXVlbmN5IGFzICdvbmNlJyB8ICdtb250aGx5JyB8ICd5ZWFybHknLFxuICAgICAgZHVyYXRpb25Nb250aHM6IGUuZHVyYXRpb25Nb250aHMgPz8gdW5kZWZpbmVkLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogZS5pbmZsYXRpb25JbmRleGVkLFxuICAgIH0pKSxcbiAgICBtaWNyb1BsYW5zOiBtaWNyb1BsYW5zLm1hcChtID0+ICh7XG4gICAgICBpZDogbS5pZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG0uZWZmZWN0aXZlRGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IG0ubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogbS5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBtLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSkpLFxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZURhdGEoYXV0aFVzZXJJZDogc3RyaW5nLCBwYXlsb2FkOiBMaWZlRGF0YVBheWxvYWQpOiBQcm9taXNlPHsgc2NlbmFyaW9JZDogc3RyaW5nIH0+IHtcbiAgbGV0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlKSB7XG4gICAgcHJvZmlsZSA9IGF3YWl0IHByaXNtYS5wcm9maWxlLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIGF1dGhVc2VySWQsXG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBsZXQgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykge1xuICAgIHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsXG4gICAgICAgIG5hbWU6ICdQbGFubyBwcmluY2lwYWwnLFxuICAgICAgICBpc0RlZmF1bHQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBhd2FpdCBwcmlzbWEubGlmZVNldHRpbmdzLnVwc2VydCh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBjcmVhdGU6IHtcbiAgICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIHVwZGF0ZToge1xuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuXG4gIHJldHVybiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVMaWZlRXZlbnQoXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBPbWl0PExpZmVFdmVudFBheWxvYWQsICdpZCc+XG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIHR5cGU6IHBheWxvYWQudHlwZSxcbiAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxuICAgICAgZGF0ZTogbmV3IERhdGUocGF5bG9hZC5kYXRlKSxcbiAgICAgIGVuZERhdGU6IHBheWxvYWQuZW5kRGF0ZSA/IG5ldyBEYXRlKHBheWxvYWQuZW5kRGF0ZSkgOiBudWxsLFxuICAgICAgYW1vdW50OiBwYXlsb2FkLmFtb3VudCxcbiAgICAgIGZyZXF1ZW5jeTogcGF5bG9hZC5mcmVxdWVuY3ksXG4gICAgICBkdXJhdGlvbk1vbnRoczogcGF5bG9hZC5kdXJhdGlvbk1vbnRocyA/PyBudWxsLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogcGF5bG9hZC5pbmZsYXRpb25JbmRleGVkID8/IHRydWUsXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IGV2ZW50LmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVFdmVudChhdXRoVXNlcklkOiBzdHJpbmcsIGV2ZW50SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGF1dGhVc2VySWQgfSB9KVxuICBpZiAoIXByb2ZpbGUpIHJldHVyblxuXG4gIGNvbnN0IGV2ZW50ID0gYXdhaXQgcHJpc21hLmxpZmVFdmVudC5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBldmVudElkLCBzY2VuYXJpbzogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQgfSB9LFxuICB9KVxuICBpZiAoZXZlbnQpIGF3YWl0IHByaXNtYS5saWZlRXZlbnQuZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IGV2ZW50SWQgfSB9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBMaWZlTWljcm9QbGFuUGF5bG9hZFxuKTogUHJvbWlzZTx7IGlkOiBzdHJpbmcgfT4ge1xuICBjb25zdCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogc2NlbmFyaW9JZCwgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykgdGhyb3cgbmV3IEVycm9yKCdTY2VuYXJpbyBub3QgZm91bmQnKVxuXG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG5ldyBEYXRlKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSArICdUMTI6MDA6MDAnKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IHBheWxvYWQubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IG1pY3JvUGxhbi5pZCB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVMaWZlTWljcm9QbGFuKFxuICBhdXRoVXNlcklkOiBzdHJpbmcsXG4gIG1pY3JvUGxhbklkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IFBhcnRpYWw8TGlmZU1pY3JvUGxhblBheWxvYWQ+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQsIHNjZW5hcmlvOiB7IHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0gfSxcbiAgfSlcbiAgaWYgKCFtaWNyb1BsYW4pIHRocm93IG5ldyBFcnJvcignTWljcm8gcGxhbiBub3QgZm91bmQnKVxuXG4gIGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0sXG4gICAgZGF0YToge1xuICAgICAgLi4uKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSAhPSBudWxsICYmIHsgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUluY29tZSAhPSBudWxsICYmIHsgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUV4cGVuc2VzICE9IG51bGwgJiYgeyBtb250aGx5RXhwZW5zZXM6IHBheWxvYWQubW9udGhseUV4cGVuc2VzIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbiAhPSBudWxsICYmIHsgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uIH0pLFxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVMaWZlTWljcm9QbGFuKGF1dGhVc2VySWQ6IHN0cmluZywgbWljcm9QbGFuSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAobWljcm9QbGFuKSB7XG4gICAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0gfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ1U0FrRHNCLHdMQUFBIn0=
}),
"[project]/foundation-life/src/app/actions/data:45aa41 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
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
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFQYXlsb2FkIHtcbiAgYmlydGhEYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBiYXNlTmV0V29ydGg6IG51bWJlclxuICBiYXNlTW9udGhseUluY29tZTogbnVtYmVyXG4gIGJhc2VNb250aGx5RXhwZW5zZXM6IG51bWJlclxuICBtb250aGx5Q29udHJpYnV0aW9uOiBudW1iZXJcbiAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IG51bWJlclxuICBpbmZsYXRpb25ZZWFybHk6IG51bWJlclxuICBpbmZsYXRlSW5jb21lOiBib29sZWFuXG4gIGluZmxhdGVFeHBlbnNlczogYm9vbGVhblxuICByZXRpcmVtZW50QWdlOiBudW1iZXJcbiAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IG51bWJlclxuICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVFdmVudFBheWxvYWQge1xuICBpZD86IHN0cmluZ1xuICB0eXBlOiBMaWZlRXZlbnRUeXBlXG4gIHRpdGxlOiBzdHJpbmdcbiAgZGF0ZTogc3RyaW5nIC8vIElTT1xuICBlbmREYXRlPzogc3RyaW5nXG4gIGFtb3VudDogbnVtYmVyXG4gIGZyZXF1ZW5jeTogJ29uY2UnIHwgJ21vbnRobHknIHwgJ3llYXJseSdcbiAgZHVyYXRpb25Nb250aHM/OiBudW1iZXJcbiAgaW5mbGF0aW9uSW5kZXhlZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWZlTWljcm9QbGFuUGF5bG9hZCB7XG4gIGVmZmVjdGl2ZURhdGU6IHN0cmluZyAvLyBJU08gZGF0ZSAoWVlZWS1NTS1ERCBvciBmdWxsIElTTylcbiAgbW9udGhseUluY29tZTogbnVtYmVyXG4gIG1vbnRobHlFeHBlbnNlczogbnVtYmVyXG4gIG1vbnRobHlDb250cmlidXRpb246IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUmVzdWx0IHtcbiAgcHJvZmlsZUlkOiBzdHJpbmdcbiAgc2NlbmFyaW9JZDogc3RyaW5nXG4gIGJpcnRoRGF0ZTogc3RyaW5nXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBzZXR0aW5nczogTGlmZURhdGFQYXlsb2FkXG4gIGV2ZW50czogTGlmZUV2ZW50UGF5bG9hZFtdXG4gIG1pY3JvUGxhbnM6IChMaWZlTWljcm9QbGFuUGF5bG9hZCAmIHsgaWQ6IHN0cmluZyB9KVtdXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMaWZlRGF0YShhdXRoVXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPExpZmVEYXRhUmVzdWx0IHwgbnVsbD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGlmICghcHJvZmlsZT8uYmlydGhEYXRlKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCwgaXNEZWZhdWx0OiB0cnVlIH0sXG4gICAgaW5jbHVkZToge1xuICAgICAgc2V0dGluZ3M6IHRydWUsXG4gICAgICBldmVudHM6IHsgb3JkZXJCeTogeyBkYXRlOiAnYXNjJyB9IH0sXG4gICAgfSxcbiAgfSlcblxuICBpZiAoIXNjZW5hcmlvPy5zZXR0aW5ncykgcmV0dXJuIG51bGxcblxuICBjb25zdCBtaWNyb1BsYW5zID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZE1hbnkoe1xuICAgIHdoZXJlOiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH0sXG4gICAgb3JkZXJCeTogeyBlZmZlY3RpdmVEYXRlOiAnYXNjJyB9LFxuICB9KVxuXG4gIGNvbnN0IHNldHRpbmdzID0gc2NlbmFyaW8uc2V0dGluZ3NcbiAgY29uc3QgYmlydGhEYXRlID0gcHJvZmlsZS5iaXJ0aERhdGVcblxuICByZXR1cm4ge1xuICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCxcbiAgICBiaXJ0aERhdGU6IGJpcnRoRGF0ZS50b0lTT1N0cmluZygpLFxuICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICBzZXR0aW5nczoge1xuICAgICAgYmlydGhEYXRlOiBiaXJ0aERhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICAgIGJhc2VOZXRXb3J0aDogc2V0dGluZ3MuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHNldHRpbmdzLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogc2V0dGluZ3MuYmFzZU1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHNldHRpbmdzLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogc2V0dGluZ3MuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHNldHRpbmdzLmluZmxhdGlvblllYXJseSxcbiAgICAgIGluZmxhdGVJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogc2V0dGluZ3MuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBzZXR0aW5ncy5yZXRpcmVtZW50QWdlID8/IDY1LFxuICAgICAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IHNldHRpbmdzLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogc2V0dGluZ3MuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIGV2ZW50czogc2NlbmFyaW8uZXZlbnRzLm1hcChlID0+ICh7XG4gICAgICBpZDogZS5pZCxcbiAgICAgIHR5cGU6IGUudHlwZSBhcyBMaWZlRXZlbnRUeXBlLFxuICAgICAgdGl0bGU6IGUudGl0bGUsXG4gICAgICBkYXRlOiBlLmRhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZERhdGU6IGUuZW5kRGF0ZT8udG9JU09TdHJpbmcoKSxcbiAgICAgIGFtb3VudDogZS5hbW91bnQsXG4gICAgICBmcmVxdWVuY3k6IGUuZnJlcXVlbmN5IGFzICdvbmNlJyB8ICdtb250aGx5JyB8ICd5ZWFybHknLFxuICAgICAgZHVyYXRpb25Nb250aHM6IGUuZHVyYXRpb25Nb250aHMgPz8gdW5kZWZpbmVkLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogZS5pbmZsYXRpb25JbmRleGVkLFxuICAgIH0pKSxcbiAgICBtaWNyb1BsYW5zOiBtaWNyb1BsYW5zLm1hcChtID0+ICh7XG4gICAgICBpZDogbS5pZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG0uZWZmZWN0aXZlRGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IG0ubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogbS5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBtLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSkpLFxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZURhdGEoYXV0aFVzZXJJZDogc3RyaW5nLCBwYXlsb2FkOiBMaWZlRGF0YVBheWxvYWQpOiBQcm9taXNlPHsgc2NlbmFyaW9JZDogc3RyaW5nIH0+IHtcbiAgbGV0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlKSB7XG4gICAgcHJvZmlsZSA9IGF3YWl0IHByaXNtYS5wcm9maWxlLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIGF1dGhVc2VySWQsXG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBsZXQgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykge1xuICAgIHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsXG4gICAgICAgIG5hbWU6ICdQbGFubyBwcmluY2lwYWwnLFxuICAgICAgICBpc0RlZmF1bHQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBhd2FpdCBwcmlzbWEubGlmZVNldHRpbmdzLnVwc2VydCh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBjcmVhdGU6IHtcbiAgICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIHVwZGF0ZToge1xuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuXG4gIHJldHVybiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVMaWZlRXZlbnQoXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBPbWl0PExpZmVFdmVudFBheWxvYWQsICdpZCc+XG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIHR5cGU6IHBheWxvYWQudHlwZSxcbiAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxuICAgICAgZGF0ZTogbmV3IERhdGUocGF5bG9hZC5kYXRlKSxcbiAgICAgIGVuZERhdGU6IHBheWxvYWQuZW5kRGF0ZSA/IG5ldyBEYXRlKHBheWxvYWQuZW5kRGF0ZSkgOiBudWxsLFxuICAgICAgYW1vdW50OiBwYXlsb2FkLmFtb3VudCxcbiAgICAgIGZyZXF1ZW5jeTogcGF5bG9hZC5mcmVxdWVuY3ksXG4gICAgICBkdXJhdGlvbk1vbnRoczogcGF5bG9hZC5kdXJhdGlvbk1vbnRocyA/PyBudWxsLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogcGF5bG9hZC5pbmZsYXRpb25JbmRleGVkID8/IHRydWUsXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IGV2ZW50LmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVFdmVudChhdXRoVXNlcklkOiBzdHJpbmcsIGV2ZW50SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGF1dGhVc2VySWQgfSB9KVxuICBpZiAoIXByb2ZpbGUpIHJldHVyblxuXG4gIGNvbnN0IGV2ZW50ID0gYXdhaXQgcHJpc21hLmxpZmVFdmVudC5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBldmVudElkLCBzY2VuYXJpbzogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQgfSB9LFxuICB9KVxuICBpZiAoZXZlbnQpIGF3YWl0IHByaXNtYS5saWZlRXZlbnQuZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IGV2ZW50SWQgfSB9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBMaWZlTWljcm9QbGFuUGF5bG9hZFxuKTogUHJvbWlzZTx7IGlkOiBzdHJpbmcgfT4ge1xuICBjb25zdCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogc2NlbmFyaW9JZCwgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykgdGhyb3cgbmV3IEVycm9yKCdTY2VuYXJpbyBub3QgZm91bmQnKVxuXG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG5ldyBEYXRlKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSArICdUMTI6MDA6MDAnKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IHBheWxvYWQubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IG1pY3JvUGxhbi5pZCB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVMaWZlTWljcm9QbGFuKFxuICBhdXRoVXNlcklkOiBzdHJpbmcsXG4gIG1pY3JvUGxhbklkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IFBhcnRpYWw8TGlmZU1pY3JvUGxhblBheWxvYWQ+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQsIHNjZW5hcmlvOiB7IHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0gfSxcbiAgfSlcbiAgaWYgKCFtaWNyb1BsYW4pIHRocm93IG5ldyBFcnJvcignTWljcm8gcGxhbiBub3QgZm91bmQnKVxuXG4gIGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0sXG4gICAgZGF0YToge1xuICAgICAgLi4uKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSAhPSBudWxsICYmIHsgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUluY29tZSAhPSBudWxsICYmIHsgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUV4cGVuc2VzICE9IG51bGwgJiYgeyBtb250aGx5RXhwZW5zZXM6IHBheWxvYWQubW9udGhseUV4cGVuc2VzIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbiAhPSBudWxsICYmIHsgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uIH0pLFxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVMaWZlTWljcm9QbGFuKGF1dGhVc2VySWQ6IHN0cmluZywgbWljcm9QbGFuSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAobWljcm9QbGFuKSB7XG4gICAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0gfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ3U0FvSHNCLHlMQUFBIn0=
}),
"[project]/foundation-life/src/app/actions/data:86bf2a [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
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
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFQYXlsb2FkIHtcbiAgYmlydGhEYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBiYXNlTmV0V29ydGg6IG51bWJlclxuICBiYXNlTW9udGhseUluY29tZTogbnVtYmVyXG4gIGJhc2VNb250aGx5RXhwZW5zZXM6IG51bWJlclxuICBtb250aGx5Q29udHJpYnV0aW9uOiBudW1iZXJcbiAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IG51bWJlclxuICBpbmZsYXRpb25ZZWFybHk6IG51bWJlclxuICBpbmZsYXRlSW5jb21lOiBib29sZWFuXG4gIGluZmxhdGVFeHBlbnNlczogYm9vbGVhblxuICByZXRpcmVtZW50QWdlOiBudW1iZXJcbiAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IG51bWJlclxuICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVFdmVudFBheWxvYWQge1xuICBpZD86IHN0cmluZ1xuICB0eXBlOiBMaWZlRXZlbnRUeXBlXG4gIHRpdGxlOiBzdHJpbmdcbiAgZGF0ZTogc3RyaW5nIC8vIElTT1xuICBlbmREYXRlPzogc3RyaW5nXG4gIGFtb3VudDogbnVtYmVyXG4gIGZyZXF1ZW5jeTogJ29uY2UnIHwgJ21vbnRobHknIHwgJ3llYXJseSdcbiAgZHVyYXRpb25Nb250aHM/OiBudW1iZXJcbiAgaW5mbGF0aW9uSW5kZXhlZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWZlTWljcm9QbGFuUGF5bG9hZCB7XG4gIGVmZmVjdGl2ZURhdGU6IHN0cmluZyAvLyBJU08gZGF0ZSAoWVlZWS1NTS1ERCBvciBmdWxsIElTTylcbiAgbW9udGhseUluY29tZTogbnVtYmVyXG4gIG1vbnRobHlFeHBlbnNlczogbnVtYmVyXG4gIG1vbnRobHlDb250cmlidXRpb246IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUmVzdWx0IHtcbiAgcHJvZmlsZUlkOiBzdHJpbmdcbiAgc2NlbmFyaW9JZDogc3RyaW5nXG4gIGJpcnRoRGF0ZTogc3RyaW5nXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBzZXR0aW5nczogTGlmZURhdGFQYXlsb2FkXG4gIGV2ZW50czogTGlmZUV2ZW50UGF5bG9hZFtdXG4gIG1pY3JvUGxhbnM6IChMaWZlTWljcm9QbGFuUGF5bG9hZCAmIHsgaWQ6IHN0cmluZyB9KVtdXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMaWZlRGF0YShhdXRoVXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPExpZmVEYXRhUmVzdWx0IHwgbnVsbD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGlmICghcHJvZmlsZT8uYmlydGhEYXRlKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCwgaXNEZWZhdWx0OiB0cnVlIH0sXG4gICAgaW5jbHVkZToge1xuICAgICAgc2V0dGluZ3M6IHRydWUsXG4gICAgICBldmVudHM6IHsgb3JkZXJCeTogeyBkYXRlOiAnYXNjJyB9IH0sXG4gICAgfSxcbiAgfSlcblxuICBpZiAoIXNjZW5hcmlvPy5zZXR0aW5ncykgcmV0dXJuIG51bGxcblxuICBjb25zdCBtaWNyb1BsYW5zID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZE1hbnkoe1xuICAgIHdoZXJlOiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH0sXG4gICAgb3JkZXJCeTogeyBlZmZlY3RpdmVEYXRlOiAnYXNjJyB9LFxuICB9KVxuXG4gIGNvbnN0IHNldHRpbmdzID0gc2NlbmFyaW8uc2V0dGluZ3NcbiAgY29uc3QgYmlydGhEYXRlID0gcHJvZmlsZS5iaXJ0aERhdGVcblxuICByZXR1cm4ge1xuICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCxcbiAgICBiaXJ0aERhdGU6IGJpcnRoRGF0ZS50b0lTT1N0cmluZygpLFxuICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICBzZXR0aW5nczoge1xuICAgICAgYmlydGhEYXRlOiBiaXJ0aERhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICAgIGJhc2VOZXRXb3J0aDogc2V0dGluZ3MuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHNldHRpbmdzLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogc2V0dGluZ3MuYmFzZU1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHNldHRpbmdzLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogc2V0dGluZ3MuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHNldHRpbmdzLmluZmxhdGlvblllYXJseSxcbiAgICAgIGluZmxhdGVJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogc2V0dGluZ3MuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBzZXR0aW5ncy5yZXRpcmVtZW50QWdlID8/IDY1LFxuICAgICAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IHNldHRpbmdzLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogc2V0dGluZ3MuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIGV2ZW50czogc2NlbmFyaW8uZXZlbnRzLm1hcChlID0+ICh7XG4gICAgICBpZDogZS5pZCxcbiAgICAgIHR5cGU6IGUudHlwZSBhcyBMaWZlRXZlbnRUeXBlLFxuICAgICAgdGl0bGU6IGUudGl0bGUsXG4gICAgICBkYXRlOiBlLmRhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZERhdGU6IGUuZW5kRGF0ZT8udG9JU09TdHJpbmcoKSxcbiAgICAgIGFtb3VudDogZS5hbW91bnQsXG4gICAgICBmcmVxdWVuY3k6IGUuZnJlcXVlbmN5IGFzICdvbmNlJyB8ICdtb250aGx5JyB8ICd5ZWFybHknLFxuICAgICAgZHVyYXRpb25Nb250aHM6IGUuZHVyYXRpb25Nb250aHMgPz8gdW5kZWZpbmVkLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogZS5pbmZsYXRpb25JbmRleGVkLFxuICAgIH0pKSxcbiAgICBtaWNyb1BsYW5zOiBtaWNyb1BsYW5zLm1hcChtID0+ICh7XG4gICAgICBpZDogbS5pZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG0uZWZmZWN0aXZlRGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IG0ubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogbS5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBtLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSkpLFxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZURhdGEoYXV0aFVzZXJJZDogc3RyaW5nLCBwYXlsb2FkOiBMaWZlRGF0YVBheWxvYWQpOiBQcm9taXNlPHsgc2NlbmFyaW9JZDogc3RyaW5nIH0+IHtcbiAgbGV0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlKSB7XG4gICAgcHJvZmlsZSA9IGF3YWl0IHByaXNtYS5wcm9maWxlLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIGF1dGhVc2VySWQsXG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBsZXQgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykge1xuICAgIHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsXG4gICAgICAgIG5hbWU6ICdQbGFubyBwcmluY2lwYWwnLFxuICAgICAgICBpc0RlZmF1bHQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBhd2FpdCBwcmlzbWEubGlmZVNldHRpbmdzLnVwc2VydCh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBjcmVhdGU6IHtcbiAgICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIHVwZGF0ZToge1xuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuXG4gIHJldHVybiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVMaWZlRXZlbnQoXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBPbWl0PExpZmVFdmVudFBheWxvYWQsICdpZCc+XG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIHR5cGU6IHBheWxvYWQudHlwZSxcbiAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxuICAgICAgZGF0ZTogbmV3IERhdGUocGF5bG9hZC5kYXRlKSxcbiAgICAgIGVuZERhdGU6IHBheWxvYWQuZW5kRGF0ZSA/IG5ldyBEYXRlKHBheWxvYWQuZW5kRGF0ZSkgOiBudWxsLFxuICAgICAgYW1vdW50OiBwYXlsb2FkLmFtb3VudCxcbiAgICAgIGZyZXF1ZW5jeTogcGF5bG9hZC5mcmVxdWVuY3ksXG4gICAgICBkdXJhdGlvbk1vbnRoczogcGF5bG9hZC5kdXJhdGlvbk1vbnRocyA/PyBudWxsLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogcGF5bG9hZC5pbmZsYXRpb25JbmRleGVkID8/IHRydWUsXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IGV2ZW50LmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVFdmVudChhdXRoVXNlcklkOiBzdHJpbmcsIGV2ZW50SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGF1dGhVc2VySWQgfSB9KVxuICBpZiAoIXByb2ZpbGUpIHJldHVyblxuXG4gIGNvbnN0IGV2ZW50ID0gYXdhaXQgcHJpc21hLmxpZmVFdmVudC5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBldmVudElkLCBzY2VuYXJpbzogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQgfSB9LFxuICB9KVxuICBpZiAoZXZlbnQpIGF3YWl0IHByaXNtYS5saWZlRXZlbnQuZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IGV2ZW50SWQgfSB9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBMaWZlTWljcm9QbGFuUGF5bG9hZFxuKTogUHJvbWlzZTx7IGlkOiBzdHJpbmcgfT4ge1xuICBjb25zdCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogc2NlbmFyaW9JZCwgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykgdGhyb3cgbmV3IEVycm9yKCdTY2VuYXJpbyBub3QgZm91bmQnKVxuXG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG5ldyBEYXRlKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSArICdUMTI6MDA6MDAnKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IHBheWxvYWQubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IG1pY3JvUGxhbi5pZCB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVMaWZlTWljcm9QbGFuKFxuICBhdXRoVXNlcklkOiBzdHJpbmcsXG4gIG1pY3JvUGxhbklkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IFBhcnRpYWw8TGlmZU1pY3JvUGxhblBheWxvYWQ+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQsIHNjZW5hcmlvOiB7IHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0gfSxcbiAgfSlcbiAgaWYgKCFtaWNyb1BsYW4pIHRocm93IG5ldyBFcnJvcignTWljcm8gcGxhbiBub3QgZm91bmQnKVxuXG4gIGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0sXG4gICAgZGF0YToge1xuICAgICAgLi4uKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSAhPSBudWxsICYmIHsgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUluY29tZSAhPSBudWxsICYmIHsgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUV4cGVuc2VzICE9IG51bGwgJiYgeyBtb250aGx5RXhwZW5zZXM6IHBheWxvYWQubW9udGhseUV4cGVuc2VzIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbiAhPSBudWxsICYmIHsgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uIH0pLFxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVMaWZlTWljcm9QbGFuKGF1dGhVc2VySWQ6IHN0cmluZywgbWljcm9QbGFuSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAobWljcm9QbGFuKSB7XG4gICAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0gfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ5U0EwTHNCLDBMQUFBIn0=
}),
"[project]/foundation-life/src/app/actions/data:cd55d3 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
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
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFQYXlsb2FkIHtcbiAgYmlydGhEYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBiYXNlTmV0V29ydGg6IG51bWJlclxuICBiYXNlTW9udGhseUluY29tZTogbnVtYmVyXG4gIGJhc2VNb250aGx5RXhwZW5zZXM6IG51bWJlclxuICBtb250aGx5Q29udHJpYnV0aW9uOiBudW1iZXJcbiAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IG51bWJlclxuICBpbmZsYXRpb25ZZWFybHk6IG51bWJlclxuICBpbmZsYXRlSW5jb21lOiBib29sZWFuXG4gIGluZmxhdGVFeHBlbnNlczogYm9vbGVhblxuICByZXRpcmVtZW50QWdlOiBudW1iZXJcbiAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IG51bWJlclxuICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVFdmVudFBheWxvYWQge1xuICBpZD86IHN0cmluZ1xuICB0eXBlOiBMaWZlRXZlbnRUeXBlXG4gIHRpdGxlOiBzdHJpbmdcbiAgZGF0ZTogc3RyaW5nIC8vIElTT1xuICBlbmREYXRlPzogc3RyaW5nXG4gIGFtb3VudDogbnVtYmVyXG4gIGZyZXF1ZW5jeTogJ29uY2UnIHwgJ21vbnRobHknIHwgJ3llYXJseSdcbiAgZHVyYXRpb25Nb250aHM/OiBudW1iZXJcbiAgaW5mbGF0aW9uSW5kZXhlZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWZlTWljcm9QbGFuUGF5bG9hZCB7XG4gIGVmZmVjdGl2ZURhdGU6IHN0cmluZyAvLyBJU08gZGF0ZSAoWVlZWS1NTS1ERCBvciBmdWxsIElTTylcbiAgbW9udGhseUluY29tZTogbnVtYmVyXG4gIG1vbnRobHlFeHBlbnNlczogbnVtYmVyXG4gIG1vbnRobHlDb250cmlidXRpb246IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUmVzdWx0IHtcbiAgcHJvZmlsZUlkOiBzdHJpbmdcbiAgc2NlbmFyaW9JZDogc3RyaW5nXG4gIGJpcnRoRGF0ZTogc3RyaW5nXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBzZXR0aW5nczogTGlmZURhdGFQYXlsb2FkXG4gIGV2ZW50czogTGlmZUV2ZW50UGF5bG9hZFtdXG4gIG1pY3JvUGxhbnM6IChMaWZlTWljcm9QbGFuUGF5bG9hZCAmIHsgaWQ6IHN0cmluZyB9KVtdXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMaWZlRGF0YShhdXRoVXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPExpZmVEYXRhUmVzdWx0IHwgbnVsbD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGlmICghcHJvZmlsZT8uYmlydGhEYXRlKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCwgaXNEZWZhdWx0OiB0cnVlIH0sXG4gICAgaW5jbHVkZToge1xuICAgICAgc2V0dGluZ3M6IHRydWUsXG4gICAgICBldmVudHM6IHsgb3JkZXJCeTogeyBkYXRlOiAnYXNjJyB9IH0sXG4gICAgfSxcbiAgfSlcblxuICBpZiAoIXNjZW5hcmlvPy5zZXR0aW5ncykgcmV0dXJuIG51bGxcblxuICBjb25zdCBtaWNyb1BsYW5zID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZE1hbnkoe1xuICAgIHdoZXJlOiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH0sXG4gICAgb3JkZXJCeTogeyBlZmZlY3RpdmVEYXRlOiAnYXNjJyB9LFxuICB9KVxuXG4gIGNvbnN0IHNldHRpbmdzID0gc2NlbmFyaW8uc2V0dGluZ3NcbiAgY29uc3QgYmlydGhEYXRlID0gcHJvZmlsZS5iaXJ0aERhdGVcblxuICByZXR1cm4ge1xuICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCxcbiAgICBiaXJ0aERhdGU6IGJpcnRoRGF0ZS50b0lTT1N0cmluZygpLFxuICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICBzZXR0aW5nczoge1xuICAgICAgYmlydGhEYXRlOiBiaXJ0aERhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICAgIGJhc2VOZXRXb3J0aDogc2V0dGluZ3MuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHNldHRpbmdzLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogc2V0dGluZ3MuYmFzZU1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHNldHRpbmdzLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogc2V0dGluZ3MuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHNldHRpbmdzLmluZmxhdGlvblllYXJseSxcbiAgICAgIGluZmxhdGVJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogc2V0dGluZ3MuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBzZXR0aW5ncy5yZXRpcmVtZW50QWdlID8/IDY1LFxuICAgICAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IHNldHRpbmdzLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogc2V0dGluZ3MuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIGV2ZW50czogc2NlbmFyaW8uZXZlbnRzLm1hcChlID0+ICh7XG4gICAgICBpZDogZS5pZCxcbiAgICAgIHR5cGU6IGUudHlwZSBhcyBMaWZlRXZlbnRUeXBlLFxuICAgICAgdGl0bGU6IGUudGl0bGUsXG4gICAgICBkYXRlOiBlLmRhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZERhdGU6IGUuZW5kRGF0ZT8udG9JU09TdHJpbmcoKSxcbiAgICAgIGFtb3VudDogZS5hbW91bnQsXG4gICAgICBmcmVxdWVuY3k6IGUuZnJlcXVlbmN5IGFzICdvbmNlJyB8ICdtb250aGx5JyB8ICd5ZWFybHknLFxuICAgICAgZHVyYXRpb25Nb250aHM6IGUuZHVyYXRpb25Nb250aHMgPz8gdW5kZWZpbmVkLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogZS5pbmZsYXRpb25JbmRleGVkLFxuICAgIH0pKSxcbiAgICBtaWNyb1BsYW5zOiBtaWNyb1BsYW5zLm1hcChtID0+ICh7XG4gICAgICBpZDogbS5pZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG0uZWZmZWN0aXZlRGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IG0ubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogbS5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBtLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSkpLFxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZURhdGEoYXV0aFVzZXJJZDogc3RyaW5nLCBwYXlsb2FkOiBMaWZlRGF0YVBheWxvYWQpOiBQcm9taXNlPHsgc2NlbmFyaW9JZDogc3RyaW5nIH0+IHtcbiAgbGV0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlKSB7XG4gICAgcHJvZmlsZSA9IGF3YWl0IHByaXNtYS5wcm9maWxlLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIGF1dGhVc2VySWQsXG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBsZXQgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykge1xuICAgIHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsXG4gICAgICAgIG5hbWU6ICdQbGFubyBwcmluY2lwYWwnLFxuICAgICAgICBpc0RlZmF1bHQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBhd2FpdCBwcmlzbWEubGlmZVNldHRpbmdzLnVwc2VydCh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBjcmVhdGU6IHtcbiAgICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIHVwZGF0ZToge1xuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuXG4gIHJldHVybiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVMaWZlRXZlbnQoXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBPbWl0PExpZmVFdmVudFBheWxvYWQsICdpZCc+XG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIHR5cGU6IHBheWxvYWQudHlwZSxcbiAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxuICAgICAgZGF0ZTogbmV3IERhdGUocGF5bG9hZC5kYXRlKSxcbiAgICAgIGVuZERhdGU6IHBheWxvYWQuZW5kRGF0ZSA/IG5ldyBEYXRlKHBheWxvYWQuZW5kRGF0ZSkgOiBudWxsLFxuICAgICAgYW1vdW50OiBwYXlsb2FkLmFtb3VudCxcbiAgICAgIGZyZXF1ZW5jeTogcGF5bG9hZC5mcmVxdWVuY3ksXG4gICAgICBkdXJhdGlvbk1vbnRoczogcGF5bG9hZC5kdXJhdGlvbk1vbnRocyA/PyBudWxsLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogcGF5bG9hZC5pbmZsYXRpb25JbmRleGVkID8/IHRydWUsXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IGV2ZW50LmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVFdmVudChhdXRoVXNlcklkOiBzdHJpbmcsIGV2ZW50SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGF1dGhVc2VySWQgfSB9KVxuICBpZiAoIXByb2ZpbGUpIHJldHVyblxuXG4gIGNvbnN0IGV2ZW50ID0gYXdhaXQgcHJpc21hLmxpZmVFdmVudC5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBldmVudElkLCBzY2VuYXJpbzogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQgfSB9LFxuICB9KVxuICBpZiAoZXZlbnQpIGF3YWl0IHByaXNtYS5saWZlRXZlbnQuZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IGV2ZW50SWQgfSB9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBMaWZlTWljcm9QbGFuUGF5bG9hZFxuKTogUHJvbWlzZTx7IGlkOiBzdHJpbmcgfT4ge1xuICBjb25zdCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogc2NlbmFyaW9JZCwgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykgdGhyb3cgbmV3IEVycm9yKCdTY2VuYXJpbyBub3QgZm91bmQnKVxuXG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG5ldyBEYXRlKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSArICdUMTI6MDA6MDAnKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IHBheWxvYWQubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IG1pY3JvUGxhbi5pZCB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVMaWZlTWljcm9QbGFuKFxuICBhdXRoVXNlcklkOiBzdHJpbmcsXG4gIG1pY3JvUGxhbklkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IFBhcnRpYWw8TGlmZU1pY3JvUGxhblBheWxvYWQ+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQsIHNjZW5hcmlvOiB7IHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0gfSxcbiAgfSlcbiAgaWYgKCFtaWNyb1BsYW4pIHRocm93IG5ldyBFcnJvcignTWljcm8gcGxhbiBub3QgZm91bmQnKVxuXG4gIGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0sXG4gICAgZGF0YToge1xuICAgICAgLi4uKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSAhPSBudWxsICYmIHsgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUluY29tZSAhPSBudWxsICYmIHsgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUV4cGVuc2VzICE9IG51bGwgJiYgeyBtb250aGx5RXhwZW5zZXM6IHBheWxvYWQubW9udGhseUV4cGVuc2VzIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbiAhPSBudWxsICYmIHsgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uIH0pLFxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVMaWZlTWljcm9QbGFuKGF1dGhVc2VySWQ6IHN0cmluZywgbWljcm9QbGFuSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAobWljcm9QbGFuKSB7XG4gICAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0gfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIyU0FvTnNCLDRMQUFBIn0=
}),
"[project]/foundation-life/src/app/actions/data:f3f101 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
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
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFQYXlsb2FkIHtcbiAgYmlydGhEYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBiYXNlTmV0V29ydGg6IG51bWJlclxuICBiYXNlTW9udGhseUluY29tZTogbnVtYmVyXG4gIGJhc2VNb250aGx5RXhwZW5zZXM6IG51bWJlclxuICBtb250aGx5Q29udHJpYnV0aW9uOiBudW1iZXJcbiAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IG51bWJlclxuICBpbmZsYXRpb25ZZWFybHk6IG51bWJlclxuICBpbmZsYXRlSW5jb21lOiBib29sZWFuXG4gIGluZmxhdGVFeHBlbnNlczogYm9vbGVhblxuICByZXRpcmVtZW50QWdlOiBudW1iZXJcbiAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IG51bWJlclxuICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVFdmVudFBheWxvYWQge1xuICBpZD86IHN0cmluZ1xuICB0eXBlOiBMaWZlRXZlbnRUeXBlXG4gIHRpdGxlOiBzdHJpbmdcbiAgZGF0ZTogc3RyaW5nIC8vIElTT1xuICBlbmREYXRlPzogc3RyaW5nXG4gIGFtb3VudDogbnVtYmVyXG4gIGZyZXF1ZW5jeTogJ29uY2UnIHwgJ21vbnRobHknIHwgJ3llYXJseSdcbiAgZHVyYXRpb25Nb250aHM/OiBudW1iZXJcbiAgaW5mbGF0aW9uSW5kZXhlZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWZlTWljcm9QbGFuUGF5bG9hZCB7XG4gIGVmZmVjdGl2ZURhdGU6IHN0cmluZyAvLyBJU08gZGF0ZSAoWVlZWS1NTS1ERCBvciBmdWxsIElTTylcbiAgbW9udGhseUluY29tZTogbnVtYmVyXG4gIG1vbnRobHlFeHBlbnNlczogbnVtYmVyXG4gIG1vbnRobHlDb250cmlidXRpb246IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUmVzdWx0IHtcbiAgcHJvZmlsZUlkOiBzdHJpbmdcbiAgc2NlbmFyaW9JZDogc3RyaW5nXG4gIGJpcnRoRGF0ZTogc3RyaW5nXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBzZXR0aW5nczogTGlmZURhdGFQYXlsb2FkXG4gIGV2ZW50czogTGlmZUV2ZW50UGF5bG9hZFtdXG4gIG1pY3JvUGxhbnM6IChMaWZlTWljcm9QbGFuUGF5bG9hZCAmIHsgaWQ6IHN0cmluZyB9KVtdXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMaWZlRGF0YShhdXRoVXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPExpZmVEYXRhUmVzdWx0IHwgbnVsbD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGlmICghcHJvZmlsZT8uYmlydGhEYXRlKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCwgaXNEZWZhdWx0OiB0cnVlIH0sXG4gICAgaW5jbHVkZToge1xuICAgICAgc2V0dGluZ3M6IHRydWUsXG4gICAgICBldmVudHM6IHsgb3JkZXJCeTogeyBkYXRlOiAnYXNjJyB9IH0sXG4gICAgfSxcbiAgfSlcblxuICBpZiAoIXNjZW5hcmlvPy5zZXR0aW5ncykgcmV0dXJuIG51bGxcblxuICBjb25zdCBtaWNyb1BsYW5zID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZE1hbnkoe1xuICAgIHdoZXJlOiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH0sXG4gICAgb3JkZXJCeTogeyBlZmZlY3RpdmVEYXRlOiAnYXNjJyB9LFxuICB9KVxuXG4gIGNvbnN0IHNldHRpbmdzID0gc2NlbmFyaW8uc2V0dGluZ3NcbiAgY29uc3QgYmlydGhEYXRlID0gcHJvZmlsZS5iaXJ0aERhdGVcblxuICByZXR1cm4ge1xuICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCxcbiAgICBiaXJ0aERhdGU6IGJpcnRoRGF0ZS50b0lTT1N0cmluZygpLFxuICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICBzZXR0aW5nczoge1xuICAgICAgYmlydGhEYXRlOiBiaXJ0aERhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICAgIGJhc2VOZXRXb3J0aDogc2V0dGluZ3MuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHNldHRpbmdzLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogc2V0dGluZ3MuYmFzZU1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHNldHRpbmdzLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogc2V0dGluZ3MuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHNldHRpbmdzLmluZmxhdGlvblllYXJseSxcbiAgICAgIGluZmxhdGVJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogc2V0dGluZ3MuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBzZXR0aW5ncy5yZXRpcmVtZW50QWdlID8/IDY1LFxuICAgICAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IHNldHRpbmdzLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogc2V0dGluZ3MuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIGV2ZW50czogc2NlbmFyaW8uZXZlbnRzLm1hcChlID0+ICh7XG4gICAgICBpZDogZS5pZCxcbiAgICAgIHR5cGU6IGUudHlwZSBhcyBMaWZlRXZlbnRUeXBlLFxuICAgICAgdGl0bGU6IGUudGl0bGUsXG4gICAgICBkYXRlOiBlLmRhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZERhdGU6IGUuZW5kRGF0ZT8udG9JU09TdHJpbmcoKSxcbiAgICAgIGFtb3VudDogZS5hbW91bnQsXG4gICAgICBmcmVxdWVuY3k6IGUuZnJlcXVlbmN5IGFzICdvbmNlJyB8ICdtb250aGx5JyB8ICd5ZWFybHknLFxuICAgICAgZHVyYXRpb25Nb250aHM6IGUuZHVyYXRpb25Nb250aHMgPz8gdW5kZWZpbmVkLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogZS5pbmZsYXRpb25JbmRleGVkLFxuICAgIH0pKSxcbiAgICBtaWNyb1BsYW5zOiBtaWNyb1BsYW5zLm1hcChtID0+ICh7XG4gICAgICBpZDogbS5pZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG0uZWZmZWN0aXZlRGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IG0ubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogbS5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBtLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSkpLFxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZURhdGEoYXV0aFVzZXJJZDogc3RyaW5nLCBwYXlsb2FkOiBMaWZlRGF0YVBheWxvYWQpOiBQcm9taXNlPHsgc2NlbmFyaW9JZDogc3RyaW5nIH0+IHtcbiAgbGV0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlKSB7XG4gICAgcHJvZmlsZSA9IGF3YWl0IHByaXNtYS5wcm9maWxlLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIGF1dGhVc2VySWQsXG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBsZXQgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykge1xuICAgIHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsXG4gICAgICAgIG5hbWU6ICdQbGFubyBwcmluY2lwYWwnLFxuICAgICAgICBpc0RlZmF1bHQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBhd2FpdCBwcmlzbWEubGlmZVNldHRpbmdzLnVwc2VydCh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBjcmVhdGU6IHtcbiAgICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIHVwZGF0ZToge1xuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuXG4gIHJldHVybiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVMaWZlRXZlbnQoXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBPbWl0PExpZmVFdmVudFBheWxvYWQsICdpZCc+XG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIHR5cGU6IHBheWxvYWQudHlwZSxcbiAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxuICAgICAgZGF0ZTogbmV3IERhdGUocGF5bG9hZC5kYXRlKSxcbiAgICAgIGVuZERhdGU6IHBheWxvYWQuZW5kRGF0ZSA/IG5ldyBEYXRlKHBheWxvYWQuZW5kRGF0ZSkgOiBudWxsLFxuICAgICAgYW1vdW50OiBwYXlsb2FkLmFtb3VudCxcbiAgICAgIGZyZXF1ZW5jeTogcGF5bG9hZC5mcmVxdWVuY3ksXG4gICAgICBkdXJhdGlvbk1vbnRoczogcGF5bG9hZC5kdXJhdGlvbk1vbnRocyA/PyBudWxsLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogcGF5bG9hZC5pbmZsYXRpb25JbmRleGVkID8/IHRydWUsXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IGV2ZW50LmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVFdmVudChhdXRoVXNlcklkOiBzdHJpbmcsIGV2ZW50SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGF1dGhVc2VySWQgfSB9KVxuICBpZiAoIXByb2ZpbGUpIHJldHVyblxuXG4gIGNvbnN0IGV2ZW50ID0gYXdhaXQgcHJpc21hLmxpZmVFdmVudC5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBldmVudElkLCBzY2VuYXJpbzogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQgfSB9LFxuICB9KVxuICBpZiAoZXZlbnQpIGF3YWl0IHByaXNtYS5saWZlRXZlbnQuZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IGV2ZW50SWQgfSB9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBMaWZlTWljcm9QbGFuUGF5bG9hZFxuKTogUHJvbWlzZTx7IGlkOiBzdHJpbmcgfT4ge1xuICBjb25zdCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogc2NlbmFyaW9JZCwgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykgdGhyb3cgbmV3IEVycm9yKCdTY2VuYXJpbyBub3QgZm91bmQnKVxuXG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG5ldyBEYXRlKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSArICdUMTI6MDA6MDAnKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IHBheWxvYWQubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IG1pY3JvUGxhbi5pZCB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVMaWZlTWljcm9QbGFuKFxuICBhdXRoVXNlcklkOiBzdHJpbmcsXG4gIG1pY3JvUGxhbklkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IFBhcnRpYWw8TGlmZU1pY3JvUGxhblBheWxvYWQ+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQsIHNjZW5hcmlvOiB7IHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0gfSxcbiAgfSlcbiAgaWYgKCFtaWNyb1BsYW4pIHRocm93IG5ldyBFcnJvcignTWljcm8gcGxhbiBub3QgZm91bmQnKVxuXG4gIGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0sXG4gICAgZGF0YToge1xuICAgICAgLi4uKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSAhPSBudWxsICYmIHsgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUluY29tZSAhPSBudWxsICYmIHsgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUV4cGVuc2VzICE9IG51bGwgJiYgeyBtb250aGx5RXhwZW5zZXM6IHBheWxvYWQubW9udGhseUV4cGVuc2VzIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbiAhPSBudWxsICYmIHsgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uIH0pLFxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVMaWZlTWljcm9QbGFuKGF1dGhVc2VySWQ6IHN0cmluZywgbWljcm9QbGFuSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAobWljcm9QbGFuKSB7XG4gICAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0gfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI2U0E4TnNCLDhMQUFBIn0=
}),
"[project]/foundation-life/src/app/actions/data:01b7d0 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
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
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbGlmZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcidcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHR5cGUgeyBMaWZlRXZlbnRUeXBlIH0gZnJvbSAnQC9tb2R1bGVzL2NvcmUvZG9tYWluL2xpZmUtdHlwZXMnXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZURhdGFQYXlsb2FkIHtcbiAgYmlydGhEYXRlOiBzdHJpbmcgLy8gSVNPXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBiYXNlTmV0V29ydGg6IG51bWJlclxuICBiYXNlTW9udGhseUluY29tZTogbnVtYmVyXG4gIGJhc2VNb250aGx5RXhwZW5zZXM6IG51bWJlclxuICBtb250aGx5Q29udHJpYnV0aW9uOiBudW1iZXJcbiAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IG51bWJlclxuICBpbmZsYXRpb25ZZWFybHk6IG51bWJlclxuICBpbmZsYXRlSW5jb21lOiBib29sZWFuXG4gIGluZmxhdGVFeHBlbnNlczogYm9vbGVhblxuICByZXRpcmVtZW50QWdlOiBudW1iZXJcbiAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IG51bWJlclxuICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVFdmVudFBheWxvYWQge1xuICBpZD86IHN0cmluZ1xuICB0eXBlOiBMaWZlRXZlbnRUeXBlXG4gIHRpdGxlOiBzdHJpbmdcbiAgZGF0ZTogc3RyaW5nIC8vIElTT1xuICBlbmREYXRlPzogc3RyaW5nXG4gIGFtb3VudDogbnVtYmVyXG4gIGZyZXF1ZW5jeTogJ29uY2UnIHwgJ21vbnRobHknIHwgJ3llYXJseSdcbiAgZHVyYXRpb25Nb250aHM/OiBudW1iZXJcbiAgaW5mbGF0aW9uSW5kZXhlZD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaWZlTWljcm9QbGFuUGF5bG9hZCB7XG4gIGVmZmVjdGl2ZURhdGU6IHN0cmluZyAvLyBJU08gZGF0ZSAoWVlZWS1NTS1ERCBvciBmdWxsIElTTylcbiAgbW9udGhseUluY29tZTogbnVtYmVyXG4gIG1vbnRobHlFeHBlbnNlczogbnVtYmVyXG4gIG1vbnRobHlDb250cmlidXRpb246IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpZmVEYXRhUmVzdWx0IHtcbiAgcHJvZmlsZUlkOiBzdHJpbmdcbiAgc2NlbmFyaW9JZDogc3RyaW5nXG4gIGJpcnRoRGF0ZTogc3RyaW5nXG4gIGxpZmVFeHBlY3RhbmN5WWVhcnM6IG51bWJlclxuICBzZXR0aW5nczogTGlmZURhdGFQYXlsb2FkXG4gIGV2ZW50czogTGlmZUV2ZW50UGF5bG9hZFtdXG4gIG1pY3JvUGxhbnM6IChMaWZlTWljcm9QbGFuUGF5bG9hZCAmIHsgaWQ6IHN0cmluZyB9KVtdXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMaWZlRGF0YShhdXRoVXNlcklkOiBzdHJpbmcpOiBQcm9taXNlPExpZmVEYXRhUmVzdWx0IHwgbnVsbD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgYXV0aFVzZXJJZCB9LFxuICB9KVxuXG4gIGlmICghcHJvZmlsZT8uYmlydGhEYXRlKSByZXR1cm4gbnVsbFxuXG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IHByb2ZpbGVJZDogcHJvZmlsZS5pZCwgaXNEZWZhdWx0OiB0cnVlIH0sXG4gICAgaW5jbHVkZToge1xuICAgICAgc2V0dGluZ3M6IHRydWUsXG4gICAgICBldmVudHM6IHsgb3JkZXJCeTogeyBkYXRlOiAnYXNjJyB9IH0sXG4gICAgfSxcbiAgfSlcblxuICBpZiAoIXNjZW5hcmlvPy5zZXR0aW5ncykgcmV0dXJuIG51bGxcblxuICBjb25zdCBtaWNyb1BsYW5zID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZE1hbnkoe1xuICAgIHdoZXJlOiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH0sXG4gICAgb3JkZXJCeTogeyBlZmZlY3RpdmVEYXRlOiAnYXNjJyB9LFxuICB9KVxuXG4gIGNvbnN0IHNldHRpbmdzID0gc2NlbmFyaW8uc2V0dGluZ3NcbiAgY29uc3QgYmlydGhEYXRlID0gcHJvZmlsZS5iaXJ0aERhdGVcblxuICByZXR1cm4ge1xuICAgIHByb2ZpbGVJZDogcHJvZmlsZS5pZCxcbiAgICBzY2VuYXJpb0lkOiBzY2VuYXJpby5pZCxcbiAgICBiaXJ0aERhdGU6IGJpcnRoRGF0ZS50b0lTT1N0cmluZygpLFxuICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICBzZXR0aW5nczoge1xuICAgICAgYmlydGhEYXRlOiBiaXJ0aERhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGxpZmVFeHBlY3RhbmN5WWVhcnM6IHByb2ZpbGUubGlmZUV4cGVjdGFuY3lZZWFycyxcbiAgICAgIGJhc2VOZXRXb3J0aDogc2V0dGluZ3MuYmFzZU5ldFdvcnRoLFxuICAgICAgYmFzZU1vbnRobHlJbmNvbWU6IHNldHRpbmdzLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogc2V0dGluZ3MuYmFzZU1vbnRobHlFeHBlbnNlcyxcbiAgICAgIG1vbnRobHlDb250cmlidXRpb246IHNldHRpbmdzLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgICBleHBlY3RlZFJldHVyblllYXJseTogc2V0dGluZ3MuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHNldHRpbmdzLmluZmxhdGlvblllYXJseSxcbiAgICAgIGluZmxhdGVJbmNvbWU6IHNldHRpbmdzLmluZmxhdGVJbmNvbWUgPz8gdHJ1ZSxcbiAgICAgIGluZmxhdGVFeHBlbnNlczogc2V0dGluZ3MuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBzZXR0aW5ncy5yZXRpcmVtZW50QWdlID8/IDY1LFxuICAgICAgcmV0aXJlbWVudE1vbnRobHlJbmNvbWU6IHNldHRpbmdzLnJldGlyZW1lbnRNb250aGx5SW5jb21lID8/IDAsXG4gICAgICBpbmZsYXRlUmV0aXJlbWVudEluY29tZTogc2V0dGluZ3MuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIGV2ZW50czogc2NlbmFyaW8uZXZlbnRzLm1hcChlID0+ICh7XG4gICAgICBpZDogZS5pZCxcbiAgICAgIHR5cGU6IGUudHlwZSBhcyBMaWZlRXZlbnRUeXBlLFxuICAgICAgdGl0bGU6IGUudGl0bGUsXG4gICAgICBkYXRlOiBlLmRhdGUudG9JU09TdHJpbmcoKSxcbiAgICAgIGVuZERhdGU6IGUuZW5kRGF0ZT8udG9JU09TdHJpbmcoKSxcbiAgICAgIGFtb3VudDogZS5hbW91bnQsXG4gICAgICBmcmVxdWVuY3k6IGUuZnJlcXVlbmN5IGFzICdvbmNlJyB8ICdtb250aGx5JyB8ICd5ZWFybHknLFxuICAgICAgZHVyYXRpb25Nb250aHM6IGUuZHVyYXRpb25Nb250aHMgPz8gdW5kZWZpbmVkLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogZS5pbmZsYXRpb25JbmRleGVkLFxuICAgIH0pKSxcbiAgICBtaWNyb1BsYW5zOiBtaWNyb1BsYW5zLm1hcChtID0+ICh7XG4gICAgICBpZDogbS5pZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG0uZWZmZWN0aXZlRGF0ZS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IG0ubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogbS5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBtLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSkpLFxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzYXZlTGlmZURhdGEoYXV0aFVzZXJJZDogc3RyaW5nLCBwYXlsb2FkOiBMaWZlRGF0YVBheWxvYWQpOiBQcm9taXNlPHsgc2NlbmFyaW9JZDogc3RyaW5nIH0+IHtcbiAgbGV0IHByb2ZpbGUgPSBhd2FpdCBwcmlzbWEucHJvZmlsZS5maW5kVW5pcXVlKHtcbiAgICB3aGVyZTogeyBhdXRoVXNlcklkIH0sXG4gIH0pXG5cbiAgaWYgKCFwcm9maWxlKSB7XG4gICAgcHJvZmlsZSA9IGF3YWl0IHByaXNtYS5wcm9maWxlLmNyZWF0ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIGF1dGhVc2VySWQsXG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgYXdhaXQgcHJpc21hLnByb2ZpbGUudXBkYXRlKHtcbiAgICAgIHdoZXJlOiB7IGlkOiBwcm9maWxlLmlkIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGJpcnRoRGF0ZTogbmV3IERhdGUocGF5bG9hZC5iaXJ0aERhdGUpLFxuICAgICAgICBsaWZlRXhwZWN0YW5jeVllYXJzOiBwYXlsb2FkLmxpZmVFeHBlY3RhbmN5WWVhcnMsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBsZXQgc2NlbmFyaW8gPSBhd2FpdCBwcmlzbWEubGlmZVNjZW5hcmlvLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IHsgcHJvZmlsZUlkOiBwcm9maWxlLmlkLCBpc0RlZmF1bHQ6IHRydWUgfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykge1xuICAgIHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICBwcm9maWxlSWQ6IHByb2ZpbGUuaWQsXG4gICAgICAgIG5hbWU6ICdQbGFubyBwcmluY2lwYWwnLFxuICAgICAgICBpc0RlZmF1bHQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBhd2FpdCBwcmlzbWEubGlmZVNldHRpbmdzLnVwc2VydCh7XG4gICAgd2hlcmU6IHsgc2NlbmFyaW9JZDogc2NlbmFyaW8uaWQgfSxcbiAgICBjcmVhdGU6IHtcbiAgICAgIHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkLFxuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICAgIHVwZGF0ZToge1xuICAgICAgYmFzZU5ldFdvcnRoOiBwYXlsb2FkLmJhc2VOZXRXb3J0aCxcbiAgICAgIGJhc2VNb250aGx5SW5jb21lOiBwYXlsb2FkLmJhc2VNb250aGx5SW5jb21lLFxuICAgICAgYmFzZU1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5iYXNlTW9udGhseUV4cGVuc2VzLFxuICAgICAgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uLFxuICAgICAgZXhwZWN0ZWRSZXR1cm5ZZWFybHk6IHBheWxvYWQuZXhwZWN0ZWRSZXR1cm5ZZWFybHksXG4gICAgICBpbmZsYXRpb25ZZWFybHk6IHBheWxvYWQuaW5mbGF0aW9uWWVhcmx5LFxuICAgICAgaW5mbGF0ZUluY29tZTogcGF5bG9hZC5pbmZsYXRlSW5jb21lID8/IHRydWUsXG4gICAgICBpbmZsYXRlRXhwZW5zZXM6IHBheWxvYWQuaW5mbGF0ZUV4cGVuc2VzID8/IHRydWUsXG4gICAgICByZXRpcmVtZW50QWdlOiBwYXlsb2FkLnJldGlyZW1lbnRBZ2UgPz8gNjUsXG4gICAgICByZXRpcmVtZW50TW9udGhseUluY29tZTogcGF5bG9hZC5yZXRpcmVtZW50TW9udGhseUluY29tZSA/PyAwLFxuICAgICAgaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWU6IHBheWxvYWQuaW5mbGF0ZVJldGlyZW1lbnRJbmNvbWUgPz8gdHJ1ZSxcbiAgICB9LFxuICB9KVxuXG4gIHJldHVybiB7IHNjZW5hcmlvSWQ6IHNjZW5hcmlvLmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNhdmVMaWZlRXZlbnQoXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBPbWl0PExpZmVFdmVudFBheWxvYWQsICdpZCc+XG4pOiBQcm9taXNlPHsgaWQ6IHN0cmluZyB9PiB7XG4gIGNvbnN0IHNjZW5hcmlvID0gYXdhaXQgcHJpc21hLmxpZmVTY2VuYXJpby5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBzY2VuYXJpb0lkLCBwcm9maWxlOiB7IGF1dGhVc2VySWQgfSB9LFxuICB9KVxuICBpZiAoIXNjZW5hcmlvKSB0aHJvdyBuZXcgRXJyb3IoJ1NjZW5hcmlvIG5vdCBmb3VuZCcpXG5cbiAgY29uc3QgZXZlbnQgPSBhd2FpdCBwcmlzbWEubGlmZUV2ZW50LmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIHR5cGU6IHBheWxvYWQudHlwZSxcbiAgICAgIHRpdGxlOiBwYXlsb2FkLnRpdGxlLFxuICAgICAgZGF0ZTogbmV3IERhdGUocGF5bG9hZC5kYXRlKSxcbiAgICAgIGVuZERhdGU6IHBheWxvYWQuZW5kRGF0ZSA/IG5ldyBEYXRlKHBheWxvYWQuZW5kRGF0ZSkgOiBudWxsLFxuICAgICAgYW1vdW50OiBwYXlsb2FkLmFtb3VudCxcbiAgICAgIGZyZXF1ZW5jeTogcGF5bG9hZC5mcmVxdWVuY3ksXG4gICAgICBkdXJhdGlvbk1vbnRoczogcGF5bG9hZC5kdXJhdGlvbk1vbnRocyA/PyBudWxsLFxuICAgICAgaW5mbGF0aW9uSW5kZXhlZDogcGF5bG9hZC5pbmZsYXRpb25JbmRleGVkID8/IHRydWUsXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IGV2ZW50LmlkIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUxpZmVFdmVudChhdXRoVXNlcklkOiBzdHJpbmcsIGV2ZW50SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBwcm9maWxlID0gYXdhaXQgcHJpc21hLnByb2ZpbGUuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGF1dGhVc2VySWQgfSB9KVxuICBpZiAoIXByb2ZpbGUpIHJldHVyblxuXG4gIGNvbnN0IGV2ZW50ID0gYXdhaXQgcHJpc21hLmxpZmVFdmVudC5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBldmVudElkLCBzY2VuYXJpbzogeyBwcm9maWxlSWQ6IHByb2ZpbGUuaWQgfSB9LFxuICB9KVxuICBpZiAoZXZlbnQpIGF3YWl0IHByaXNtYS5saWZlRXZlbnQuZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IGV2ZW50SWQgfSB9KVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUxpZmVNaWNyb1BsYW4oXG4gIGF1dGhVc2VySWQ6IHN0cmluZyxcbiAgc2NlbmFyaW9JZDogc3RyaW5nLFxuICBwYXlsb2FkOiBMaWZlTWljcm9QbGFuUGF5bG9hZFxuKTogUHJvbWlzZTx7IGlkOiBzdHJpbmcgfT4ge1xuICBjb25zdCBzY2VuYXJpbyA9IGF3YWl0IHByaXNtYS5saWZlU2NlbmFyaW8uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogc2NlbmFyaW9JZCwgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSxcbiAgfSlcbiAgaWYgKCFzY2VuYXJpbykgdGhyb3cgbmV3IEVycm9yKCdTY2VuYXJpbyBub3QgZm91bmQnKVxuXG4gIGNvbnN0IG1pY3JvUGxhbiA9IGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgc2NlbmFyaW9JZCxcbiAgICAgIGVmZmVjdGl2ZURhdGU6IG5ldyBEYXRlKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSArICdUMTI6MDA6MDAnKSxcbiAgICAgIG1vbnRobHlJbmNvbWU6IHBheWxvYWQubW9udGhseUluY29tZSxcbiAgICAgIG1vbnRobHlFeHBlbnNlczogcGF5bG9hZC5tb250aGx5RXhwZW5zZXMsXG4gICAgICBtb250aGx5Q29udHJpYnV0aW9uOiBwYXlsb2FkLm1vbnRobHlDb250cmlidXRpb24sXG4gICAgfSxcbiAgfSlcbiAgcmV0dXJuIHsgaWQ6IG1pY3JvUGxhbi5pZCB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVMaWZlTWljcm9QbGFuKFxuICBhdXRoVXNlcklkOiBzdHJpbmcsXG4gIG1pY3JvUGxhbklkOiBzdHJpbmcsXG4gIHBheWxvYWQ6IFBhcnRpYWw8TGlmZU1pY3JvUGxhblBheWxvYWQ+XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbWljcm9QbGFuID0gYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBpZDogbWljcm9QbGFuSWQsIHNjZW5hcmlvOiB7IHByb2ZpbGU6IHsgYXV0aFVzZXJJZCB9IH0gfSxcbiAgfSlcbiAgaWYgKCFtaWNyb1BsYW4pIHRocm93IG5ldyBFcnJvcignTWljcm8gcGxhbiBub3QgZm91bmQnKVxuXG4gIGF3YWl0IHByaXNtYS5saWZlTWljcm9QbGFuLnVwZGF0ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0sXG4gICAgZGF0YToge1xuICAgICAgLi4uKHBheWxvYWQuZWZmZWN0aXZlRGF0ZSAhPSBudWxsICYmIHsgZWZmZWN0aXZlRGF0ZTogbmV3IERhdGUocGF5bG9hZC5lZmZlY3RpdmVEYXRlICsgJ1QxMjowMDowMCcpIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUluY29tZSAhPSBudWxsICYmIHsgbW9udGhseUluY29tZTogcGF5bG9hZC5tb250aGx5SW5jb21lIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUV4cGVuc2VzICE9IG51bGwgJiYgeyBtb250aGx5RXhwZW5zZXM6IHBheWxvYWQubW9udGhseUV4cGVuc2VzIH0pLFxuICAgICAgLi4uKHBheWxvYWQubW9udGhseUNvbnRyaWJ1dGlvbiAhPSBudWxsICYmIHsgbW9udGhseUNvbnRyaWJ1dGlvbjogcGF5bG9hZC5tb250aGx5Q29udHJpYnV0aW9uIH0pLFxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVMaWZlTWljcm9QbGFuKGF1dGhVc2VySWQ6IHN0cmluZywgbWljcm9QbGFuSWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBtaWNyb1BsYW4gPSBhd2FpdCBwcmlzbWEubGlmZU1pY3JvUGxhbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiB7IGlkOiBtaWNyb1BsYW5JZCwgc2NlbmFyaW86IHsgcHJvZmlsZTogeyBhdXRoVXNlcklkIH0gfSB9LFxuICB9KVxuICBpZiAobWljcm9QbGFuKSB7XG4gICAgYXdhaXQgcHJpc21hLmxpZmVNaWNyb1BsYW4uZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IG1pY3JvUGxhbklkIH0gfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIrU0F5UXNCLGdNQUFBIn0=
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
    const [monthlyContribution, setMonthlyContribution] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({
            effectiveDate,
            monthlyIncome,
            monthlyExpenses,
            monthlyContribution
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
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                lineNumber: 44,
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
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            type: "date",
                                            value: effectiveDate,
                                            onChange: (e)=>setEffectiveDate(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 52,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Renda mensal (R$)"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 59,
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
                                            lineNumber: 60,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Gastos mensais (R$)"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 69,
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
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Aporte mensal (R$)"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 79,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$foundation$2d$life$2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            type: "number",
                                            min: 0,
                                            value: monthlyContribution || '',
                                            onChange: (e)=>setMonthlyContribution(Number(e.target.value)),
                                            placeholder: "0"
                                        }, void 0, false, {
                                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                            lineNumber: 49,
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
                                    lineNumber: 90,
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
                                    lineNumber: 94,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/micro-plans/components/life-micro-plan-form.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(LifeMicroPlanForm, "1uxKIbp3U5yB9NBF0iWx99ch6+I=");
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
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 1);
    switch(state.preset){
        case 'current_year':
            return {
                startKey: getMonthKey(yearStart),
                endKey: getMonthKey(yearEnd)
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
    preset: 'current_year',
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
                    lineNumber: 79,
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
                                lineNumber: 92,
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
                                lineNumber: 95,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                        lineNumber: 91,
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
                                lineNumber: 104,
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
                                lineNumber: 107,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/foundation-life/src/modules/timeline/components/chart-range-filter.tsx",
        lineNumber: 77,
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
"[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/foundation-life/src/modules/dashboard/components/life-dashboard.tsx'\n\nUnexpected token. Did you mean `{'}'}` or `&rbrace;`?");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
]);

//# sourceMappingURL=foundation-life_src_ea1359cd._.js.map