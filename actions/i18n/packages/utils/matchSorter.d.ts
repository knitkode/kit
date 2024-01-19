type KeyAttributes = {
    threshold?: Ranking;
    maxRanking: Ranking;
    minRanking: Ranking;
};
interface RankingInfo {
    rankedValue: string;
    rank: Ranking;
    keyIndex: number;
    keyThreshold: Ranking | undefined;
}
interface ValueGetterKey<ItemType> {
    (item: ItemType): string | Array<string>;
}
interface IndexedItem<ItemType> {
    item: ItemType;
    index: number;
}
interface RankedItem<ItemType> extends RankingInfo, IndexedItem<ItemType> {
}
interface BaseSorter<ItemType> {
    (a: RankedItem<ItemType>, b: RankedItem<ItemType>): number;
}
interface Sorter<ItemType> {
    (matchItems: Array<RankedItem<ItemType>>): Array<RankedItem<ItemType>>;
}
interface KeyAttributesOptions<ItemType> {
    key?: string | ValueGetterKey<ItemType>;
    threshold?: Ranking;
    maxRanking?: Ranking;
    minRanking?: Ranking;
}
type KeyOption<ItemType> = KeyAttributesOptions<ItemType> | ValueGetterKey<ItemType> | string;
interface MatchSorterOptions<ItemType = unknown> {
    keys?: ReadonlyArray<KeyOption<ItemType>>;
    threshold?: Ranking;
    baseSort?: BaseSorter<ItemType>;
    keepDiacritics?: boolean;
    sorter?: Sorter<ItemType>;
}
declare const RANKING_CASE_SENSITIVE_EQUAL = 7;
declare const RANKING_EQUAL = 6;
declare const RANKING_STARTS_WITH = 5;
declare const RANKING_WORD_STARTS_WITH = 4;
declare const RANKING_CONTAINS = 3;
declare const RANKING_ACRONYM = 2;
declare const RANKING_MATCHES = 1;
declare const RANKING_NO_MATCH = 0;
type Ranking = typeof RANKING_CASE_SENSITIVE_EQUAL | typeof RANKING_EQUAL | typeof RANKING_STARTS_WITH | typeof RANKING_WORD_STARTS_WITH | typeof RANKING_CONTAINS | typeof RANKING_ACRONYM | typeof RANKING_MATCHES | typeof RANKING_NO_MATCH;
declare const defaultBaseSortFn: BaseSorter<unknown>;
declare function matchSorter<ItemType = string>(items: ReadonlyArray<ItemType>, value: string, options?: MatchSorterOptions<ItemType>): Array<ItemType>;
export { matchSorter, defaultBaseSortFn };
export type { MatchSorterOptions, KeyAttributesOptions, KeyOption, KeyAttributes, RankingInfo, ValueGetterKey, };
export default matchSorter;
