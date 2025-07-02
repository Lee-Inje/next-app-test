import mitt from 'mitt';

type Events = Record<string, any>;

export const eventBus = mitt<Events>();
