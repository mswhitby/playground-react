/** Join truthy class names: cn("btn", isActive && "active") → "btn active" */
export const cn = (...values) => values.filter(Boolean).join(" ");
