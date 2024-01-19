export declare function Emitter<EventMap extends {
    [key: string]: any;
}>(namespace: string): {
    on<EventName extends keyof EventMap>(name: EventName, handler: (data?: EventMap[EventName] | undefined) => any): void;
    emit<EventName_1 extends keyof EventMap>(name: EventName_1, data?: EventMap[EventName_1] | undefined): void;
};
export default Emitter;
