import { GactHistory } from "@gact/history";
import { createBindings, WithStore } from "@gact/react-store";
import { createStore, Store } from "@gact/store";

import { createHistory, HistoryState, Location } from "../src";

type State = {
  location: Location;
};

type RouterSetup = {
  history: GactHistory<HistoryState>;
  store: Store<State>;
  withStore: WithStore<State>;
  streamLocation: () => void;
};

export function createRouterSetup(): RouterSetup {
  const history = createHistory();

  const initialState: State = {
    location: history.location,
  };

  const store = createStore(initialState);
  const { set, path } = store;

  const { withStore } = createBindings(store);

  function streamLocation(): void {
    history.subscribe(function(location) {
      set(path("location"), location);
    });
  }

  return { history, store, streamLocation, withStore };
}
