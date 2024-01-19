type PaletteShade = readonly [number, string];
type PaletteShades = readonly PaletteShade[];
type PaletteMapPair<T extends PaletteShade> = {
    [Pair in T as `${Pair[0]}`]: Pair[1];
};
type PaletteMap<T extends PaletteShades> = {
    [PS in T[number] as keyof PaletteMapPair<PS>]: PaletteMapPair<PS>[keyof PaletteMapPair<PS>];
};
export declare const createPalette: <TName extends string, TShades extends PaletteShades, TColor = TShades[number][1], TMap = PaletteMap<TShades>>(name: TName, shades: TShades) => readonly [TMap, Record<`${TName}-${TShades[number][0]}`, string>, TColor[]];
export default createPalette;
