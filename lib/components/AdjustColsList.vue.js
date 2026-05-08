const props = defineProps();
const excludedHeaders = defineModel({ required: true });
const emit = defineEmits();
function getHeaderListIcon(excludedHeaders, headerKey) {
    return excludedHeaders.includes(headerKey) ? 'mdi-close' : 'mdi-check';
}
function getHeaderListIconColor(excludedHeaders, headerKey) {
    return excludedHeaders.includes(headerKey) ? 'error' : 'success';
}
let __VLS_modelEmit;
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.vMenu | typeof __VLS_components.VMenu | typeof __VLS_components['v-menu'] | typeof __VLS_components.vMenu | typeof __VLS_components.VMenu | typeof __VLS_components['v-menu']} */
vMenu;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    closeOnContentClick: (false),
    location: "start",
}));
const __VLS_2 = __VLS_1({
    closeOnContentClick: (false),
    location: "start",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5 = {};
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { activator: __VLS_7 } = __VLS_3.slots;
    const [{ props }] = __VLS_vSlot(__VLS_7);
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.vListItem | typeof __VLS_components.VListItem | typeof __VLS_components['v-list-item'] | typeof __VLS_components.vListItem | typeof __VLS_components.VListItem | typeof __VLS_components['v-list-item']} */
    vListItem;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...(props),
        prependIcon: "mdi-table-column",
    }));
    const __VLS_10 = __VLS_9({
        ...(props),
        prependIcon: "mdi-table-column",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    const { default: __VLS_13 } = __VLS_11.slots;
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.vListItemTitle | typeof __VLS_components.VListItemTitle | typeof __VLS_components['v-list-item-title'] | typeof __VLS_components.vListItemTitle | typeof __VLS_components.VListItemTitle | typeof __VLS_components['v-list-item-title']} */
    vListItemTitle;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        ...{ class: "clickable" },
    }));
    const __VLS_16 = __VLS_15({
        ...{ class: "clickable" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    /** @type {__VLS_StyleScopedClasses['clickable']} */ ;
    const { default: __VLS_19 } = __VLS_17.slots;
    var __VLS_17;
    var __VLS_11;
}
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.vList | typeof __VLS_components.VList | typeof __VLS_components['v-list'] | typeof __VLS_components.vList | typeof __VLS_components.VList | typeof __VLS_components['v-list']} */
vList;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({}));
const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_25 } = __VLS_23.slots;
for (const [header, i] of __VLS_vFor((props.headers))) {
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.vListItem | typeof __VLS_components.VListItem | typeof __VLS_components['v-list-item'] | typeof __VLS_components.vListItem | typeof __VLS_components.VListItem | typeof __VLS_components['v-list-item']} */
    vListItem;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        ...{ 'onClick': {} },
        key: (i),
        value: (header),
    }));
    const __VLS_28 = __VLS_27({
        ...{ 'onClick': {} },
        key: (i),
        value: (header),
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    let __VLS_31;
    const __VLS_32 = ({ click: {} },
        { onClick: (...[$event]) => {
                __VLS_ctx.excludedHeaders.includes(header.key) ? __VLS_ctx.excludedHeaders = __VLS_ctx.excludedHeaders.filter((v) => v != header.key) : __VLS_ctx.excludedHeaders.push(header.key);
                __VLS_ctx.emit('change');
                // @ts-ignore
                [excludedHeaders, excludedHeaders, excludedHeaders, excludedHeaders, emit,];
            } });
    const { default: __VLS_33 } = __VLS_29.slots;
    {
        const { append: __VLS_34 } = __VLS_29.slots;
        let __VLS_35;
        /** @ts-ignore @type { | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components['v-icon'] | typeof __VLS_components.vIcon | typeof __VLS_components.VIcon | typeof __VLS_components['v-icon']} */
        vIcon;
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
            icon: (__VLS_ctx.getHeaderListIcon(__VLS_ctx.excludedHeaders, header.key)),
            color: (__VLS_ctx.getHeaderListIconColor(__VLS_ctx.excludedHeaders, header.key)),
        }));
        const __VLS_37 = __VLS_36({
            icon: (__VLS_ctx.getHeaderListIcon(__VLS_ctx.excludedHeaders, header.key)),
            color: (__VLS_ctx.getHeaderListIconColor(__VLS_ctx.excludedHeaders, header.key)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_36));
        // @ts-ignore
        [excludedHeaders, excludedHeaders, getHeaderListIcon, getHeaderListIconColor,];
    }
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.vListItemTitle | typeof __VLS_components.VListItemTitle | typeof __VLS_components['v-list-item-title'] | typeof __VLS_components.vListItemTitle | typeof __VLS_components.VListItemTitle | typeof __VLS_components['v-list-item-title']} */
    vListItemTitle;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        ...{ class: "clickable" },
    }));
    const __VLS_42 = __VLS_41({
        ...{ class: "clickable" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_asFunctionalDirective(__VLS_directives.vText, {})(null, { ...__VLS_directiveBindingRestFields, value: (header.title) }, null, null);
    /** @type {__VLS_StyleScopedClasses['clickable']} */ ;
    // @ts-ignore
    [];
    var __VLS_29;
    var __VLS_30;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_23;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
