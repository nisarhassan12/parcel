// @flow strict-local

import type {
  IDisposable,
  Tracer as ITracer,
  TraceEvent,
  SubscribableTracer as ISubscribableTracer,
  Measurement,
} from '@parcel/types';

import {ValueEmitter} from '@parcel/events';

// $FlowFixMe
import {performance as _performance} from 'perf_hooks';

const performance: Performance = _performance;

export class Tracer implements ITracer {
  #events /*: ValueEmitter<TraceEvent> */ = new ValueEmitter();

  createMeasurement(name: string): Measurement {
    let start = performance.now();
    return {
      end: () => {
        this.#events.emit({
          start,
          dur: performance.now() - start,
          name,
        });
      },
    };
  }
}

export class SubscribableTracer extends Tracer implements ISubscribableTracer {
  #events /*: ValueEmitter<TraceEvent> */;

  addListener(listener: TraceEvent => mixed): IDisposable {
    return this.#events.addListener(listener);
  }
}
