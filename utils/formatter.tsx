
//Display in JPY only supported
export const jpyFormatter = new Intl.NumberFormat('ja-JP', {
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

export type CurrencyValueFormatterHolder = {
    currencyValueFormatter: Intl.NumberFormat;
}
export type CurrencyFormatterHolder = {
    currencyFormatter: Intl.NumberFormat;
}

export type FormatterHolder = CurrencyValueFormatterHolder & CurrencyFormatterHolder;

export const numberFormatter = new Intl.NumberFormat('ja-JP', { });
export const priceRenderer = (price: number, holder: FormatterHolder) => holder.currencyFormatter.format(price);
export const valueRenderer = (price: number, holder: FormatterHolder) => holder.currencyValueFormatter.format(price);