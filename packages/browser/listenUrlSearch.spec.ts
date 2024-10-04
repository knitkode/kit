// TODO: mock browser globals correctly
// import { listenUrlSearch, type HistoryExtended } from './listenUrlSearch';

// declare const window: Window;

// declare const history: HistoryExtended;
// // Mocking the external dependencies
// jest.mock('@koine/utils', () => ({
//   isBrowser: true, // or false depending on what you want to test
// }));

// describe('listenUrlSearch', () => {
//   let originalPushState: (...args: string[]) => void;
//   let originalReplaceState: (...args: string[]) => void;
//   let originalLocation: Window["location"];
//   let runHandlers: () => void;
  
//   beforeEach(() => {
//     // Backup original functions
//     originalPushState = history.pushState;
//     originalReplaceState = history.replaceState;
//     originalLocation = window.location;

//     // @ts-expect-error Create a mock for location.search
//     delete window.location;
//     window.location = {
//       search: '',
//     } as Window["location"];
    
//     // Create the runHandlers function to call directly
//     runHandlers = jest.fn();
    
//     // Mock the extendHistoryMethod
//     jest.spyOn(window.history, 'pushState').mockImplementation((...args) => {
//       runHandlers();
//       return originalPushState.apply(history, args);
//     });
//     jest.spyOn(window.history, 'replaceState').mockImplementation((...args) => {
//       runHandlers();
//       return originalReplaceState.apply(history, args);
//     });
//   });

//   afterEach(() => {
//     // Restore original functions and location
//     history.pushState = originalPushState;
//     history.replaceState = originalReplaceState;
//     window.location = originalLocation;
//     jest.clearAllMocks(); // Clear mocks for each test
//   });

//   it('should register a new handler and invoke it when the URL search changes', () => {
//     const handler = jest.fn();
//     listenUrlSearch(handler);

//     // Simulate a change in location.search
//     window.location.search = '?new=value';
//     window.history.pushState({}, '');

//     expect(handler).toHaveBeenCalledWith('', '?new=value');
//   });

//   it('should not invoke the handler if the URL search has not changed', () => {
//     const handler = jest.fn();
//     listenUrlSearch(handler);

//     // Simulate no change in location.search
//     window.location.search = '';
//     window.history.pushState({}, '');

//     expect(handler).not.toHaveBeenCalled();
//   });

//   it('should allow multiple handlers to be registered', () => {
//     const handler1 = jest.fn();
//     const handler2 = jest.fn();
//     listenUrlSearch(handler1);
//     listenUrlSearch(handler2);

//     // Simulate a change in location.search
//     window.location.search = '?new=value';
//     window.history.pushState({}, '');

//     expect(handler1).toHaveBeenCalledWith('', '?new=value');
//     expect(handler2).toHaveBeenCalledWith('', '?new=value');
//   });

//   it('should deregister a handler', () => {
//     const handler = jest.fn();
//     const deregister = listenUrlSearch(handler);

//     // Simulate a change in location.search
//     window.location.search = '?new=value';
//     window.history.pushState({}, '');

//     expect(handler).toHaveBeenCalled();

//     // Deregister the handler
//     deregister();

//     // Simulate another change in location.search
//     window.location.search = '?new=value2';
//     window.history.pushState({}, '');

//     expect(handler).toHaveBeenCalledTimes(1); // Should only have been called once
//   });

//   it('should correctly handle the popstate event', () => {
//     const handler = jest.fn();
//     listenUrlSearch(handler);

//     // Simulate a popstate event
//     window.location.search = '?popstate=value';
//     window.dispatchEvent(new Event('popstate'));

//     expect(handler).toHaveBeenCalledWith('', '?popstate=value');
//   });

//   it('should not register the handler if it already exists', () => {
//     const handler = jest.fn();
//     const deregister = listenUrlSearch(handler);
//     listenUrlSearch(handler); // Registering the same handler again

//     expect((history.__.h.size)).toBe(1); // Should still be 1

//     deregister();
//     expect((history.__.h.size)).toBe(0); // Should now be deregistered
//   });

//   it('should set up the history extension only once', () => {
//     const handler = jest.fn();
//     listenUrlSearch(handler);
//     listenUrlSearch(handler); // Call again

//     expect((history.__.h.size)).toBe(1); // Still only one handler
//   });
// });
