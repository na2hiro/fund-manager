
//Display in JPY only supported
export const jpyFormatter: Formatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
});

export const percentageFormatter: Formatter = new Intl.NumberFormat('ja-JP', {
    style: 'percent',
    minimumFractionDigits: 1
});

export type CurrencyValueFormatterHolder = {
    currencyValueFormatter: Formatter;
}
export type CurrencyFormatterHolder = {
    currencyFormatter: Formatter;
}

export type Formatter = {
    format: (amount: number) => string;
}
export type FormatterHolder = CurrencyValueFormatterHolder & CurrencyFormatterHolder;

export const numberFormatter = new Intl.NumberFormat('ja-JP', { });
export const priceRenderer = (price: number, holder: FormatterHolder) => holder.currencyFormatter.format(price);
export const valueRenderer = (price: number, holder: FormatterHolder) => holder.currencyValueFormatter.format(price);