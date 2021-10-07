import "./main.css";
import {
  Observable,
  Subject,
  BehaviorSubject,
  fromEvent,
  Subscription,
  of,
} from "rxjs";
import {
  switchMap,
  tap,
  map,
  scan,
  catchError,
  distinctUntilKeyChanged,
} from "rxjs/operators";
import { html, render } from "lit-html";

import { Connection } from "./types";
import { puckDeviceOptions, getPuckAccelerometerData } from "./puck";
import {
  circuitPlaygroundDeviceOptions,
  getCircuitPLaygroundAccelerometerData,
} from "./circuit-playground";
import fish from "./animations/fish";

const enum ConnectionStatus {
  Disconnected,
  Connecting,
  Connected,
}

const sketches = {
  fish: fish,
};

const combinedDeviceFilters = {
  filters: [
    ...puckDeviceOptions.filters,
    ...circuitPlaygroundDeviceOptions.filters,
  ],
  optionalServices: [
    ...puckDeviceOptions.optionalServices,
    ...circuitPlaygroundDeviceOptions.optionalServices,
  ],
};

interface ViewModel {
  connectionStatus: ConnectionStatus;
  connection?: Connection;
  errorMessage: string;
  sketch: string;
}

const INITIAL_VIEW_MODEL: ViewModel = {
  connectionStatus: ConnectionStatus.Disconnected,
  connection: null,
  errorMessage: "",
  sketch: null,
};

const viewModelSubject = new BehaviorSubject<Partial<ViewModel>>(
  INITIAL_VIEW_MODEL
);
const viewModelUpdate = (viewModel: Partial<ViewModel>) =>
  viewModelSubject.next(viewModel);
const viewModel$: Observable<ViewModel> = viewModelSubject
  .asObservable()
  .pipe(
    scan(
      (acc: ViewModel, curr: Partial<ViewModel>) => ({ ...curr, ...acc }),
      INITIAL_VIEW_MODEL
    )
  );

viewModel$.subscribe(({ connectionStatus, connection, errorMessage }) => {
  const connectButton = {
    [ConnectionStatus.Disconnected]: html`<button
      @click="${(_) => connectSubject.next()}"
    >
      Connect
    </button>`,
    [ConnectionStatus.Connecting]: html`<button disabled>Connecting</button>`,
    [ConnectionStatus.Connected]: html`<button
      @click="${(_) => disconnectSubject.next()}"
    >
      Disconnect
    </button>`,
  };

  const template = html`
    <header>
      ${connectButton[connectionStatus]}
      ${connection?.name
        ? html`<div>Connected to ${connection.name}</div>`
        : ""}
    </header>
    ${errorMessage ? html`<div class="error">${errorMessage}</div>` : ""}
    <main>
      <div id="sketch"></div>
    </main>
  `;
  render(template, document.body);
});

viewModel$
  .pipe(distinctUntilKeyChanged("sketch"))
  .subscribe(({ sketch, connection }) =>
    sketches[sketch](
      connection.accelerometerData$,
      document.querySelector("#sketch")
    )
  );

const connectSubject: Subject<void> = new Subject();
const disconnectSubject: Subject<void> = new Subject();

connectSubject
  .asObservable()
  .pipe(
    tap((_) =>
      viewModelUpdate({ connectionStatus: ConnectionStatus.Connecting })
    ),
    switchMap(getConnection),
    map((connection) => ({
      connectionStatus: ConnectionStatus.Connected,
      connection,
    })),
    catchError((error: DOMException) =>
      of({
        errorMessage: error.message,
        connectionStatus: ConnectionStatus.Disconnected,
      })
    )
  )
  .subscribe(viewModelUpdate);

disconnectSubject.asObservable().subscribe((_) => {
  //todo disconnect
  viewModelUpdate({ connectionStatus: ConnectionStatus.Disconnected });
});

function log(data) {
  console.log(data);
}

async function getConnection(): Promise<Connection> {
  const device = await navigator.bluetooth.requestDevice(combinedDeviceFilters);
  const disconnectedSub = new BehaviorSubject(false);
  const subscriptions = new Subscription();
  subscriptions.add(
    fromEvent(device, "gattserverdisconnected").subscribe((_) =>
      disconnectedSub.next(true)
    )
  );
  const server = await device.gatt.connect();
  const services = await server.getPrimaryServices();
  const primaryService = services.at(0);
  const characteristics = await primaryService.getCharacteristics();

  const accelerometerData$ = isCircuitPlayground(primaryService)
    ? await getCircuitPLaygroundAccelerometerData(characteristics)
    : await getPuckAccelerometerData(characteristics);

  return {
    name: device.name,
    accelerometerData$,
    disconnected$: disconnectedSub.asObservable(),
    disconnect: () => {
      device.gatt.disconnect();
      accelerometerData$.unsubscribe();
      subscriptions.unsubscribe();
      disconnectedSub.next(true);
    },
  };
}

function isCircuitPlayground(service: BluetoothRemoteGATTService): boolean {
  return service.uuid.startsWith("adaf");
}

async function connectToDevice(
  device: BluetoothDevice
): Promise<BluetoothRemoteGATTServer> {
  return await device.gatt.connect();
}

async function getPrimaryService(
  server: BluetoothRemoteGATTServer
): Promise<BluetoothRemoteGATTService> {
  const services = await server.getPrimaryServices();
  return services.at(0);
}
