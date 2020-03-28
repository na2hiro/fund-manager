
//Display in JPY only supported
export const currencyFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
});

export const currencyValueFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0
});

export const percentageFormatter = new Intl.NumberFormat('ja-JP', {
    style: 'percent',
    minimumFractionDigits: 1
});