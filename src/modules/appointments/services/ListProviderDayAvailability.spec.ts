import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailability';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from providers', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user_id',
      user_id: '123',
      date: new Date(2021, 4, 21, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id',
      user_id: '123',
      date: new Date(2021, 4, 21, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 21, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user_id',
      year: 2021,
      month: 5,
      day: 21,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 12, available: true },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });
});
