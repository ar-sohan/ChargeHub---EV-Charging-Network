import { ChargingService, chargingPercent, CHARGING_DURATION_MS } from './charging.service';

describe('simulated charging', () => {
  it('calculates elapsed progress and clamps it', () => {
    const start = new Date(1000000);
    expect(chargingPercent(start, 1000000)).toBe(0);
    expect(chargingPercent(start, 1000000 + CHARGING_DURATION_MS / 2)).toBe(50);
    expect(chargingPercent(start, 1000000 + CHARGING_DURATION_MS * 2)).toBe(100);
    expect(chargingPercent(start, 0)).toBe(0);
  });

  it('rejects pending payment and scopes lookup to the current user', async () => {
    const manager = { findOne: jest.fn().mockResolvedValue({ status: 'pending_payment' }) };
    const db = { transaction: (fn: any) => fn(manager) };
    const service = new ChargingService(db as any, {} as any);
    await expect(service.start(4, 8)).rejects.toThrow('Payment must be confirmed');
    expect(manager.findOne.mock.calls[0][1].where).toEqual({ id: 4, user: { id: 8 } });
  });

  it('does not reset a session on repeated start', async () => {
    const started = new Date();
    const booking = { id: 1, slotNumber: 'A-1', status: 'confirmed', chargingStartedAt: started };
    const manager = { findOne: jest.fn().mockResolvedValue(booking), save: jest.fn() };
    const service = new ChargingService({ transaction: (fn: any) => fn(manager) } as any, {} as any);
    const result = await service.start(1, 8);
    expect(result.startedAt).toEqual(started);
    expect(manager.save).not.toHaveBeenCalled();
  });

  it('completes and saves only one notification over repeated worker runs', async () => {
    const booking = { id: 1, slotNumber: 'A-1', status: 'confirmed', chargingStartedAt: new Date(Date.now() - CHARGING_DURATION_MS - 1000), chargingCompletedAt: null, user: { id: 8 } };
    const manager = {
      findOne: jest.fn().mockResolvedValue(booking),
      create: jest.fn((_entity, data) => data),
      save: jest.fn(async (...args) => args[args.length - 1]),
    };
    const db = { transaction: (fn: any) => fn(manager), getRepository: () => ({ find: async () => [booking] }) };
    const notifications = { deliver: jest.fn() };
    const service = new ChargingService(db as any, notifications as any);
    await service.completeDue();
    await service.completeDue();
    expect(booking.status).toBe('completed');
    expect(booking.chargingCompletedAt).toBeInstanceOf(Date);
    expect(manager.create).toHaveBeenCalledTimes(1);
    expect(notifications.deliver).toHaveBeenCalledTimes(1);
  });
});

describe('stop charging', () => {
  it('freezes percentage, releases booking and does not duplicate notifications', async () => {
    const booking: any = { id: 3, slotNumber: 'A-3', status: 'confirmed', chargingStartedAt: new Date(Date.now() - 60000) };
    const manager = {
      findOne: jest.fn().mockResolvedValue(booking),
      create: jest.fn((_entity, data) => data),
      save: jest.fn(async (...args) => args[args.length - 1]),
    };
    const notifications = { deliver: jest.fn() };
    const service = new ChargingService({ transaction: (fn: any) => fn(manager) } as any, notifications as any);
    const first = await service.stop(3, 9);
    const second = await service.stop(3, 9);
    expect(first.status).toBe('stopped');
    expect(first.percentage).toBe(50);
    expect(second.percentage).toBe(first.percentage);
    expect(booking.status).toBe('stopped');
    expect(notifications.deliver).toHaveBeenCalledTimes(1);
    expect(manager.findOne.mock.calls[0][1].where).toEqual({ id: 3, user: { id: 9 } });
  });
  it('rejects a session that has not started', async () => {
    const service = new ChargingService({ transaction: (fn: any) => fn({ findOne: async () => ({ id: 1 }) }) } as any, {} as any);
    await expect(service.stop(1, 9)).rejects.toThrow('Charging has not started');
  });
});
