export function formatTradeDisplay(trade: string): string {
    return trade
        .replace(/_/g, ' ')           // ac_technician → ac technician
        .replace(/\b\w/g, c => c.toUpperCase()) // ac technician → Ac Technician
}


export function formatTradeSlug(trade: string): string {
    return trade
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')         // "ac technician" → "ac_technician"
        .replace(/[^a-z0-9_]/g, '')   // strip special chars
        .replace(/_+/g, '_')          // collapse multiple underscores
}


export function formatTradeUrl(trade: string): string {
    return formatTradeSlug(trade).replace(/_/g, '-')  // "ac_technician" → "ac-technician"
}